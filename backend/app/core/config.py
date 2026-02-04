# from pydantic import BaseSettings
from pydantic_settings import BaseSettings 


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"  # or postgres
    FINTERNET_BASE_URL: str = "https://api.fmm.finternetlab.io"
    FINTERNET_API_KEY: str = "sk_hackathon_7a33526211b1e2c7ad41487e8e016ca2"

    class Config:
        env_file = "app/core/.env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
