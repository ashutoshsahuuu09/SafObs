import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.db.database import engine, Base, AsyncSessionLocal
from app.services.seed_data import seed_database
from app.api.v1.observations import router as observations_router
from app.api.v1.capa import router as capa_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.copilot import router as copilot_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Auto-seed sample safety data
    async with AsyncSessionLocal() as session:
        await seed_database(session)
        
    yield
    
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="SafObs - AI-Powered Industrial Safety Observation & EHS Intelligence Platform",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads static directory
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_FOLDER), name="uploads")

# Include Routers
app.include_router(observations_router, prefix=settings.API_V1_STR)
app.include_router(capa_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(copilot_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root_health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
