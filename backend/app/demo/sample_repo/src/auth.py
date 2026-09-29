import time

class SessionStore:
    def __init__(self):
        self.sessions = {}

    def create_session(self, user_id: str) -> str:
        token = f"token_{user_id}_{int(time.time())}"
        # BUG: Expiry set to 0 causes session to expire immediately on refresh!
        self.sessions[token] = {"user_id": user_id, "expires_at": 0}
        return token

    def is_valid_session(self, token: str) -> bool:
        session = self.sessions.get(token)
        if not session:
            return False
        # If expires_at is 0, session is considered expired
        if session["expires_at"] == 0:
            return False
        return session["expires_at"] > time.time()

class AuthService:
    def __init__(self):
        self.store = SessionStore()

    def login(self, username: str, password: str) -> dict:
        if username == "admin" and password == "secret123":
            token = self.store.create_session("usr_101")
            return {"status": "success", "token": token, "user": {"id": "usr_101", "name": "Admin User"}}
        return {"status": "error", "message": "Invalid credentials"}

    def verify_token(self, token: str) -> bool:
        return self.store.is_valid_session(token)
