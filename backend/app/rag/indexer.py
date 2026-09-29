import os
import math
import logging
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.entities import Repository, RepositoryFile, RepositoryChunk
from app.rag.chunker import CodeChunker

logger = logging.getLogger(__name__)

class RepositoryIndexer:
    """Indexes local or cloned repositories into database chunks with vector embeddings."""
    
    SUPPORTED_EXTENSIONS = {
        ".py": "python",
        ".ts": "typescript",
        ".tsx": "tsx",
        ".js": "javascript",
        ".jsx": "jsx",
        ".json": "json",
        ".md": "markdown",
        ".html": "html",
        ".css": "css",
        ".sql": "sql",
        ".yml": "yaml",
        ".yaml": "yaml"
    }

    @staticmethod
    def _compute_vector_embedding(text: str) -> list:
        """Compute a deterministic 64-dimensional float vector from text content."""
        words = text.lower().split()
        vector = [0.0] * 64
        for word in words:
            h = hash(word)
            idx = abs(h) % 64
            vector[idx] += 1.0
        # Normalize
        norm = math.sqrt(sum(v * v for v in vector))
        if norm > 0:
            vector = [v / norm for v in vector]
        return vector

    @classmethod
    async def index_directory(cls, db: AsyncSession, repository_id: str, repo_path: str):
        repo_result = await db.execute(select(Repository).where(Repository.id == repository_id))
        repo = repo_result.scalar_one_or_none()
        if not repo:
            logger.error(f"Repository {repository_id} not found")
            return

        repo.status = "indexing"
        await db.commit()

        # Clean existing files and chunks
        file_ids_query = await db.execute(select(RepositoryFile.id).where(RepositoryFile.repository_id == repository_id))
        existing_file_ids = file_ids_query.scalars().all()
        if existing_file_ids:
            await db.execute(delete(RepositoryChunk).where(RepositoryChunk.file_id.in_(existing_file_ids)))
            await db.execute(delete(RepositoryFile).where(RepositoryFile.repository_id == repository_id))
            await db.commit()

        total_files = 0
        total_chunks = 0

        for root, dirs, files in os.walk(repo_path):
            # Exclude build/cache dirs
            dirs[:] = [d for d in dirs if d not in [".git", "node_modules", "__pycache__", "venv", ".next", "dist", "build"]]
            
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext not in cls.SUPPORTED_EXTENSIONS:
                    continue

                abs_file_path = os.path.join(root, f)
                rel_path = os.path.relpath(abs_file_path, repo_path).replace("\\", "/")
                
                try:
                    with open(abs_file_path, "r", encoding="utf-8", errors="ignore") as fh:
                        content = fh.read()
                except Exception as e:
                    logger.warning(f"Skipping file {rel_path}: {e}")
                    continue

                lang = cls.SUPPORTED_EXTENSIONS[ext]
                repo_file = RepositoryFile(
                    repository_id=repository_id,
                    path=rel_path,
                    language=lang,
                    size_bytes=len(content.encode("utf-8")),
                    content=content
                )
                db.add(repo_file)
                await db.flush()  # assign repo_file.id

                chunks = CodeChunker.chunk_file(rel_path, content, lang)
                for c in chunks:
                    vec = cls._compute_vector_embedding(c["content"] + " " + (c["symbol_name"] or ""))
                    chunk_obj = RepositoryChunk(
                        file_id=repo_file.id,
                        content=c["content"],
                        start_line=c["start_line"],
                        end_line=c["end_line"],
                        symbol_name=c["symbol_name"],
                        chunk_type=c["chunk_type"],
                        embedding_json=vec
                    )
                    db.add(chunk_obj)
                    total_chunks += 1
                
                total_files += 1

        repo.file_count = total_files
        repo.chunk_count = total_chunks
        repo.status = "indexed"
        repo.indexed_at = datetime.now(timezone.utc)
        await db.commit()
        logger.info(f"Repository {repository_id} indexed: {total_files} files, {total_chunks} chunks.")
