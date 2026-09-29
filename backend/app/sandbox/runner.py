import os
import sys
import time
import asyncio
import subprocess
import shutil
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class SandboxRunner:
    """Isolated subprocess sandbox runner with workspace isolation, timeout, and IO capture."""

    BASE_WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "workspaces"))

    @classmethod
    def ensure_workspace(cls, run_id: str, source_repo_path: Optional[str] = None) -> str:
        """Create or clone an isolated workspace directory for a specific run ID."""
        os.makedirs(cls.BASE_WORKSPACE_DIR, exist_ok=True)
        run_workspace = os.path.join(cls.BASE_WORKSPACE_DIR, run_id)
        
        if os.path.exists(run_workspace):
            shutil.rmtree(run_workspace, ignore_errors=True)
            
        os.makedirs(run_workspace, exist_ok=True)

        if source_repo_path and os.path.exists(source_repo_path):
            for item in os.listdir(source_repo_path):
                if item in [".git", "node_modules", "venv", "__pycache__", ".next"]:
                    continue
                s = os.path.join(source_repo_path, item)
                d = os.path.join(run_workspace, item)
                if os.path.isdir(s):
                    shutil.copytree(s, d, symlinks=False, ignore=None)
                else:
                    shutil.copy2(s, d)
                    
        return run_workspace

    @classmethod
    async def execute_command(
        cls,
        command: str,
        workspace_path: str,
        timeout_seconds: int = 30,
        env_vars: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """Execute a shell command inside the specified isolated workspace."""
        start_time = time.time()
        
        # Prepare environment
        env = os.environ.copy()
        if env_vars:
            env.update(env_vars)

        logger.info(f"Sandbox executing command: '{command}' in {workspace_path}")

        try:
            process = await asyncio.create_subprocess_shell(
                command,
                cwd=workspace_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=env
            )

            try:
                stdout_bytes, stderr_bytes = await asyncio.wait_for(
                    process.communicate(),
                    timeout=float(timeout_seconds)
                )
                duration_ms = int((time.time() - start_time) * 1000)
                
                stdout_str = stdout_bytes.decode("utf-8", errors="replace")
                stderr_str = stderr_bytes.decode("utf-8", errors="replace")
                exit_code = process.returncode

                return {
                    "command": command,
                    "exit_code": exit_code,
                    "stdout": stdout_str,
                    "stderr": stderr_str,
                    "duration_ms": duration_ms,
                    "timeout": False
                }
            except asyncio.TimeoutError:
                process.kill()
                await process.wait()
                duration_ms = int((time.time() - start_time) * 1000)
                return {
                    "command": command,
                    "exit_code": -1,
                    "stdout": "",
                    "stderr": f"Execution timed out after {timeout_seconds} seconds.",
                    "duration_ms": duration_ms,
                    "timeout": True
                }

        except Exception as e:
            duration_ms = int((time.time() - start_time) * 1000)
            return {
                "command": command,
                "exit_code": 1,
                "stdout": "",
                "stderr": f"Sandbox error: {str(e)}",
                "duration_ms": duration_ms,
                "timeout": False
            }

    @classmethod
    def cleanup_workspace(cls, run_id: str):
        run_workspace = os.path.join(cls.BASE_WORKSPACE_DIR, run_id)
        if os.path.exists(run_workspace):
            shutil.rmtree(run_workspace, ignore_errors=True)
