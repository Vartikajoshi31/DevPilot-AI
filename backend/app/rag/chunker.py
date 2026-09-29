import re
import ast
from typing import List, Dict, Any

class CodeChunker:
    """AST-Aware and structural code chunker supporting Python, JS/TS, Markdown, and JSON."""
    
    @staticmethod
    def chunk_file(path: str, content: str, language: str) -> List[Dict[str, Any]]:
        chunks = []
        lines = content.splitlines()
        total_lines = len(lines)
        
        if language == "python":
            chunks = CodeChunker._chunk_python(content, lines)
        elif language in ["typescript", "javascript", "tsx", "jsx"]:
            chunks = CodeChunker._chunk_js_ts(content, lines)
        else:
            # Fallback sliding window chunking by line blocks
            chunks = CodeChunker._chunk_generic(lines)
            
        if not chunks:
            chunks = CodeChunker._chunk_generic(lines)
            
        return chunks

    @staticmethod
    def _chunk_python(content: str, lines: List[str]) -> List[Dict[str, Any]]:
        chunks = []
        try:
            tree = ast.parse(content)
            for node in ast.walk(tree):
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    start = getattr(node, "lineno", 1)
                    end = getattr(node, "end_lineno", start + 10)
                    chunk_text = "\n".join(lines[start - 1:end])
                    chunk_type = "class" if isinstance(node, ast.ClassDef) else "function"
                    chunks.append({
                        "content": chunk_text,
                        "start_line": start,
                        "end_line": end,
                        "symbol_name": node.name,
                        "chunk_type": chunk_type
                    })
        except SyntaxError:
            pass
        return chunks

    @staticmethod
    def _chunk_js_ts(content: str, lines: List[str]) -> List[Dict[str, Any]]:
        chunks = []
        # Regex heuristic for classes and functions in JS/TS
        pattern = re.compile(r'^\s*(export\s+)?(function|class|const|async\s+function)\s+([A-Za-z0-9_]+)', re.MULTILINE)
        matches = list(pattern.finditer(content))
        
        for i, match in enumerate(matches):
            symbol_name = match.group(3)
            chunk_type = match.group(2) if match.group(2) in ["function", "class"] else "function"
            
            # Find line numbers
            start_pos = match.start()
            start_line = content[:start_pos].count("\n") + 1
            
            if i < len(matches) - 1:
                end_pos = matches[i + 1].start()
                end_line = content[:end_pos].count("\n")
            else:
                end_line = len(lines)
                
            chunk_text = "\n".join(lines[start_line - 1:end_line])
            chunks.append({
                "content": chunk_text,
                "start_line": start_line,
                "end_line": end_line,
                "symbol_name": symbol_name,
                "chunk_type": chunk_type
            })
        return chunks

    @staticmethod
    def _chunk_generic(lines: List[str], chunk_size: int = 50, overlap: int = 10) -> List[Dict[str, Any]]:
        chunks = []
        total = len(lines)
        if total == 0:
            return []
            
        step = max(1, chunk_size - overlap)
        for i in range(0, total, step):
            end = min(i + chunk_size, total)
            chunk_text = "\n".join(lines[i:end])
            chunks.append({
                "content": chunk_text,
                "start_line": i + 1,
                "end_line": end,
                "symbol_name": f"block_{i+1}_{end}",
                "chunk_type": "module"
            })
        return chunks
