import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from main import app

def test_root_endpoint():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["app"] == "DevPilot AI"
        assert data["status"] == "online"

def test_auth_register_and_login():
    with TestClient(app) as client:
        email = f"testuser_{os.urandom(4).hex()}@devpilot.ai"
        password = "SecurePassword123!"

        # Register
        reg_response = client.post("/api/v1/auth/register", json={
            "email": email,
            "password": password,
            "full_name": "Test Engineer"
        })
        assert reg_response.status_code == 200
        reg_data = reg_response.json()
        assert "access_token" in reg_data
        token = reg_data["access_token"]

        # Me
        me_response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_response.status_code == 200
        assert me_response.json()["email"] == email

def test_create_demo_project():
    with TestClient(app) as client:
        # Register user first
        email = f"demouser_{os.urandom(4).hex()}@devpilot.ai"
        reg_response = client.post("/api/v1/auth/register", json={
            "email": email,
            "password": "Password123!",
            "full_name": "Demo User"
        })
        token = reg_response.json()["access_token"]

        # Create demo project
        proj_response = client.post(
            "/api/v1/projects",
            headers={"Authorization": f"Bearer {token}"},
            json={
                "name": "Demo E-Commerce Service",
                "description": "Autonomous AI Test Project",
                "is_demo": True
            }
        )
        assert proj_response.status_code == 200
        proj_data = proj_response.json()
        assert proj_data["is_demo"] is True
        assert "id" in proj_data
