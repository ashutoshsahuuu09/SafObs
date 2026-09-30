import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class Settings:
    PROJECT_NAME: str = "SafObs AI Safety Platform"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = f"sqlite+aiosqlite:///{BASE_DIR}/safobs.db"
    UPLOAD_FOLDER: str = str(UPLOAD_DIR)
    
    # AI Engine Keys (optional live key, fallback to local industrial LLM simulator)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()
