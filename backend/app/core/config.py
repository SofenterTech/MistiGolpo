import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MistiGolpo"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "mistigolpo_super_secret_jwt_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # SQLite fallback if PostgreSQL is not configured
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mistigolpo.db")
    
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@mistigolpo.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminPassword123!")

settings = Settings()
