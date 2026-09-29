import math
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.entities import RepositoryFile, RepositoryChunk, Repository
from app.rag.indexer import RepositoryIndexer

class CodeRetriever:
    """Hybrid semantic vector + keyword + symbol rerank code retriever."""

    @staticmethod
    def _cosine_similarity(vec1: list, vec2: list) -> float:
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        dot = sum(a * b for a, b in zip(vec1, vec2))
        return dot

    @classmethod
    async def search(
        cls,
        db: AsyncSession,
        project_id: str,
        query: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        # Get all repositories in the project
        repos_query = await db.execute(select(Repository.id).where(Repository.project_id == project_id))
        repo_ids = repos_query.scalars().all()
        if not repo_ids:
            return []

        # Get file paths and chunks
        chunks_query = await db.execute(
            select(RepositoryChunk, RepositoryFile.path, RepositoryFile.language)
            .join(RepositoryFile, RepositoryChunk.file_id == RepositoryFile.id)
            .where(RepositoryFile.repository_id.in_(repo_ids))
        )
        rows = chunks_query.all()
        if not rows:
            return []

        query_vec = RepositoryIndexer._compute_vector_embedding(query)
        query_words = set(query.lower().split())

        scored_results = []
        for chunk, path, language in rows:
            # 1. Cosine similarity score
            sem_score = cls._cosine_similarity(query_vec, chunk.embedding_json or [])
            
            # 2. Keyword match score
            content_lower = chunk.content.lower()
            keyword_score = sum(1.0 for word in query_words if word in content_lower) / max(1, len(query_words))
            
            # 3. Symbol match boost
            symbol_boost = 0.5 if chunk.symbol_name and any(w in chunk.symbol_name.lower() for w in query_words) else 0.0
            
            # 4. Path match boost
            path_boost = 0.3 if any(w in path.lower() for w in query_words) else 0.0

            total_score = (0.4 * sem_score) + (0.4 * keyword_score) + symbol_boost + path_boost
            
            scored_results.append({
                "chunk_id": chunk.id,
                "file_path": path,
                "language": language,
                "symbol_name": chunk.symbol_name,
                "chunk_type": chunk.chunk_type,
                "start_line": chunk.start_line,
                "end_line": chunk.end_line,
                "content": chunk.content,
                "score": round(total_score, 4)
            })

        # Sort by total_score descending
        scored_results.sort(key=lambda x: x["score"], reverse=True)
        return scored_results[:top_k]
