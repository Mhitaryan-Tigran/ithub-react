from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    jwt_secret: str = "dev-secret-change-me-at-least-32-characters"
    access_ttl_seconds: int = 300
    refresh_ttl_seconds: int = 7 * 24 * 3600
    database_path: str = "shop.db"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


settings = Settings()
