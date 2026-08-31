import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrustNet AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # Server configuration
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # File Storage & Limits
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    MAX_FILE_SIZE_MB: int = 15
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp", "tiff"]
    ALLOWED_VIDEO_EXTENSIONS: List[str] = ["mp4", "mov", "avi", "webm"]
    ALLOWED_AUDIO_EXTENSIONS: List[str] = ["wav", "mp3", "m4a", "flac"]
    ALLOWED_DOC_EXTENSIONS: List[str] = ["pdf", "png", "jpg", "jpeg"]
    
    # Default Trust Engine Weights
    WEIGHT_AUTHENTICITY: float = 0.45
    WEIGHT_MANIPULATION: float = 0.35
    WEIGHT_SOURCE_RELIABILITY: float = 0.10
    WEIGHT_CLAIM_SUPPORT: float = 0.10

    # Persistence path
    DATA_STORAGE_FILE: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "analyses.json")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.DATA_STORAGE_FILE), exist_ok=True)
