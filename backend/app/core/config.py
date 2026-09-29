import os

class Settings:
    PROJECT_NAME: str = "DevPilot AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "devpilot-super-secret-production-key-2026-safe-default")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Default to SQLite async, support PostgreSQL via env)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./devpilot.db")
    
    # AI Model API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "gemini")
    
    # GitHub Integration
    GITHUB_CLIENT_ID: str = os.getenv("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET: str = os.getenv("GITHUB_CLIENT_SECRET", "")

settings = Settings()
