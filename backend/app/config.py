import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "MistiGolpo"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "mistigolpo_secret_key_change_in_production_123456789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mistigolpo.db")
    
    # CORS
    CORS_ORIGINS: list[str] = ["*"]
    
    # Admin Seed
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@mistigolpo.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Admin@123456")

    class Config:
        case_sensitive = True

settings = Settings()
