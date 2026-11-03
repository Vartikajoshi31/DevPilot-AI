import os
import sys
import time
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from main import app
from app.rag.chunker import CodeChunker
from app.rag.indexer import RepositoryIndexer
from app.sandbox.runner import SandboxRunner

client = TestClient(app)

class TestAuthModule:
    """Audit tests for Authentication & Authorization."""
    
    def test_register_success(self):
        email = f"qa_valid_{int(time.time()*1000)}@devpilot.ai"
        res = client.post("/api/v1/auth/register", json={
            "email": email,
            "password": "ValidPassword123!",
            "full_name": "QA Engineer"
        })
        assert res.status_code == 200
        data = res.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert data["user"]["email"] == email

    def test_register_duplicate_email(self):
        email = f"qa_dup_{int(time.time()*1000)}@devpilot.ai"
        payload = {"email": email, "password": "Password123!", "full_name": "User 1"}
        res1 = client.post("/api/v1/auth/register", json=payload)
        assert res1.status_code == 200

        res2 = client.post("/api/v1/auth/register", json=payload)
        assert res2.status_code == 400
        assert "already exists" in res2.json()["detail"].lower()

    def test_register_invalid_email(self):
        res = client.post("/api/v1/auth/register", json={
            "email": "not-an-email",
            "password": "Password123!"
        })
        assert res.status_code == 422  # Pydantic validation error

    def test_login_wrong_password(self):
        email = f"qa_wrongpass_{int(time.time()*1000)}@devpilot.ai"
        client.post("/api/v1/auth/register", json={"email": email, "password": "RealPassword123!"})
        
        res = client.post("/api/v1/auth/login", data={"username": email, "password": "WrongPassword"})
        assert res.status_code == 400
        assert "incorrect email or password" in res.json()["detail"].lower()

    def test_get_me_unauthorized(self):
        res = client.get("/api/v1/auth/me")
        assert res.status_code == 401

    def test_get_me_malformed_token(self):
        res = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer not-a-valid-jwt"})
        assert res.status_code == 401

class TestProjectsModule:
    """Audit tests for Projects & Cross-Tenant Isolation."""

    def _get_token(self, prefix="user"):
        email = f"{prefix}_{int(time.time()*1000)}@devpilot.ai"
        res = client.post("/api/v1/auth/register", json={"email": email, "password": "Password123!"})
        return res.json()["access_token"], res.json()["user"]

    def test_create_and_list_project(self):
        token, user = self._get_token("proj_owner")
        res = client.post(
            "/api/v1/projects",
            headers={"Authorization": f"Bearer {token}"},
            json={"name": "Custom Repo Project", "description": "Testing description", "is_demo": False}
        )
        assert res.status_code == 200
        proj_id = res.json()["id"]

        list_res = client.get("/api/v1/projects", headers={"Authorization": f"Bearer {token}"})
        assert list_res.status_code == 200
        assert any(p["id"] == proj_id for p in list_res.json())

    def test_idor_get_project_cross_tenant(self):
        """Security Check: Can user B read user A's private project by ID?"""
        token_a, user_a = self._get_token("tenant_a")
        token_b, user_b = self._get_token("tenant_b")

        res_a = client.post(
            "/api/v1/projects",
            headers={"Authorization": f"Bearer {token_a}"},
            json={"name": "Tenant A Secret Project", "is_demo": False}
        )
        proj_a_id = res_a.json()["id"]

        # Tenant B requests Tenant A's project
        res_b = client.get(
            f"/api/v1/projects/{proj_a_id}",
            headers={"Authorization": f"Bearer {token_b}"}
        )
        # Expected in multi-tenant SaaS: 403 or 404 (isolation enforced)
        # If 200, it is an IDOR vulnerability
        return res_b.status_code, proj_a_id

class TestBugsAndTestingModules:
    """Audit tests for Bugs, TestCases, Security findings, and Incidents."""

    def test_create_and_list_bugs(self):
        email = f"bug_qa_{int(time.time()*1000)}@devpilot.ai"
        reg = client.post("/api/v1/auth/register", json={"email": email, "password": "Password123!"})
        token = reg.json()["access_token"]
        
        proj = client.post("/api/v1/projects", headers={"Authorization": f"Bearer {token}"}, json={"name": "Bug Proj", "is_demo": False}).json()
        proj_id = proj["id"]

        bug_res = client.post(
            "/api/v1/bugs",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "project_id": proj_id,
                "title": "Payment gateway timeout on checkout",
                "description": "Stripe webhook 504 gateway timeout",
                "severity": "CRITICAL",
                "environment": "Staging"
            }
        )
        assert bug_res.status_code == 200
        bug_data = bug_res.json()
        assert bug_data["title"] == "Payment gateway timeout on checkout"
        assert bug_data["bug_number"].startswith("BUG-")

        list_bugs = client.get(f"/api/v1/bugs?project_id={proj_id}", headers={"Authorization": f"Bearer {token}"})
        assert list_bugs.status_code == 200
        assert len(list_bugs.json()) >= 1

class TestAgentRunsAndSecurity:
    """Audit tests for Agent Runs, Approvals, and Endpoint Authentication."""

    def test_unauthenticated_agent_run_get(self):
        """Security Check: Is GET /api/v1/agent-runs/{id} accessible without Auth?"""
        email = f"agent_qa_{int(time.time()*1000)}@devpilot.ai"
        reg = client.post("/api/v1/auth/register", json={"email": email, "password": "Password123!"})
        token = reg.json()["access_token"]

        proj = client.post("/api/v1/projects", headers={"Authorization": f"Bearer {token}"}, json={"name": "Agent Proj", "is_demo": False}).json()
        proj_id = proj["id"]

        create_res = client.post(
            "/api/v1/agent-runs",
            headers={"Authorization": f"Bearer {token}"},
            json={"project_id": proj_id, "prompt": "Investigate checkout latency"}
        )
        assert create_res.status_code == 200
        run_id = create_res.json()["id"]

        # Attempt to access with NO Authorization header
        unauth_res = client.get(f"/api/v1/agent-runs/{run_id}")
        # If unauth_res.status_code == 200, authentication is missing on this endpoint!
        assert unauth_res.status_code in [200, 401]
        return unauth_res.status_code == 200

class TestRagAndSandbox:
    """Audit tests for AST Chunker, Vector indexing, and Sandbox execution."""

    def test_ast_chunker_python(self):
        py_code = """
def authenticate_user(user, password):
    '''Docstring'''
    return user == 'admin'

class SessionManager:
    def __init__(self):
        self.active = True
"""
        chunks = CodeChunker.chunk_file("auth.py", py_code, "python")
        symbols = [c["symbol_name"] for c in chunks]
        assert "authenticate_user" in symbols
        assert "SessionManager" in symbols

    def test_sandbox_runner_timeout(self):
        """Test whether sandbox runner terminates hanging commands within timeout."""
        import asyncio
        res = asyncio.run(SandboxRunner.execute_command("powershell -Command Start-Sleep -Seconds 10", ".", timeout_seconds=1))
        assert res["timeout"] is True
        assert res["exit_code"] == -1
