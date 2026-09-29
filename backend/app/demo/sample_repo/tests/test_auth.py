import pytest
from src.auth import AuthService

def test_login_success():
    service = AuthService()
    result = service.login("admin", "secret123")
    assert result["status"] == "success"
    assert "token" in result

def test_session_persistence_after_refresh():
    service = AuthService()
    login_result = service.login("admin", "secret123")
    token = login_result["token"]
    
    # Simulate page refresh by verifying token validity
    assert service.verify_token(token) is True, "User session should persist after page refresh"
