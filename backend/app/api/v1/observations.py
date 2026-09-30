import os
import shutil
import uuid
from typing import List, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from app.db.database import get_db
from app.core.config import settings
from app.models.models import Observation, CorrectiveAction, Site
from app.models.schemas import (
    ObservationCreate,
    ObservationResponse,
    ObservationUpdate,
    AIAnalysisResult
)
from app.services.ai_extractor import ai_extractor

router = APIRouter(prefix="/observations", tags=["Observations"])

@router.post("/analyze/text", response_model=AIAnalysisResult)
async def analyze_text_input(
    text: str = Form(...),
    observer: str = Form("Vikram Sharma (Safety Lead)")
):
    """Zero-friction AI extraction from freeform text or notes"""
    return ai_extractor.extract_from_text(text, observer_hint=observer)

@router.post("/analyze/image", response_model=AIAnalysisResult)
async def analyze_image_input(
    file: UploadFile = File(...),
    observer: str = Form("Vikram Sharma (Safety Lead)")
):
    """Upload plant photo, run AI vision perception & hazard extractor"""
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    saved_path = os.path.join(settings.UPLOAD_FOLDER, unique_filename)
    
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    result = ai_extractor.analyze_image_file(file.filename, saved_path, observer_hint=observer)
    return result

@router.post("/analyze/voice", response_model=AIAnalysisResult)
async def analyze_voice_input(
    audio_file: Optional[UploadFile] = File(None),
    transcript_text: Optional[str] = Form(None),
    observer: str = Form("Marcus Vance (Shift Supervisor)")
):
    """Process voice memo recording with Whisper transcription & safety entity extraction"""
    text_to_process = transcript_text or ""
    if audio_file:
        file_ext = audio_file.filename.split(".")[-1] if "." in audio_file.filename else "webm"
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        saved_path = os.path.join(settings.UPLOAD_FOLDER, unique_filename)
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(audio_file.file, buffer)
        if not text_to_process:
            text_to_process = f"Voice Recording Memo {audio_file.filename}"
            
    return ai_extractor.transcribe_and_extract_voice(text_to_process, observer_name=observer)

@router.post("/analyze/document", response_model=AIAnalysisResult)
async def analyze_document_input(
    file: UploadFile = File(...),
    observer: str = Form("Rajesh Patel (Safety Officer)")
):
    """OCR Document scan or audit PDF and extract safety observations"""
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "pdf"
    unique_filename = f"{uuid.uuid4()}.{file_ext}"
    saved_path = os.path.join(settings.UPLOAD_FOLDER, unique_filename)
    
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return ai_extractor.ocr_document(file.filename, observer_name=observer)

@router.post("/create", response_model=ObservationResponse)
async def create_observation(
    payload: ObservationCreate,
    auto_create_capa: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """Create a verified safety observation and optionally auto-generate the initial CAPA item"""
    obs = Observation(
        site_id=payload.site_id,
        unit_name=payload.unit_name,
        department=payload.department,
        location_details=payload.location_details,
        observer_name=payload.observer_name,
        source_type=payload.source_type,
        hazard_category=payload.hazard_category,
        risk_level=payload.risk_level,
        severity_score=payload.severity_score,
        title=payload.title,
        description=payload.description,
        recommended_capa=payload.recommended_capa,
        ai_confidence=payload.ai_confidence or 0.94,
        media_url=payload.media_url,
        original_transcript_or_text=payload.original_transcript_or_text,
        status="ACTION_ASSIGNED" if auto_create_capa and payload.recommended_capa else "OPEN"
    )
    db.add(obs)
    await db.flush()

    if auto_create_capa and payload.recommended_capa:
        priority = "P1" if payload.risk_level == "CRITICAL" else ("P2" if payload.risk_level == "HIGH" else "P3")
        due_days = 1 if payload.risk_level == "CRITICAL" else (3 if payload.risk_level == "HIGH" else 7)
        
        capa = CorrectiveAction(
            observation_id=obs.id,
            title=f"CAPA: {payload.title[:60]}",
            action_description=payload.recommended_capa,
            assigned_to=f"{payload.department} Safety Lead",
            priority=priority,
            due_date=datetime.utcnow() + timedelta(days=due_days),
            status="IN_PROGRESS"
        )
        db.add(capa)

    await db.commit()

    # Re-fetch with relationships
    stmt = (
        select(Observation)
        .where(Observation.id == obs.id)
        .options(selectinload(Observation.corrective_actions))
    )
    res = await db.execute(stmt)
    return res.scalar_one()

@router.get("/", response_model=List[ObservationResponse])
async def list_observations(
    search: Optional[str] = None,
    risk_level: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve observations with multi-field filtering and full relationship loading"""
    stmt = select(Observation).options(selectinload(Observation.corrective_actions)).order_by(desc(Observation.created_at))
    
    if risk_level:
        stmt = stmt.where(Observation.risk_level == risk_level.upper())
    if department:
        stmt = stmt.where(Observation.department == department)
    if status:
        stmt = stmt.where(Observation.status == status.upper())
    if search:
        search_fmt = f"%{search}%"
        stmt = stmt.where(
            (Observation.title.ilike(search_fmt)) |
            (Observation.description.ilike(search_fmt)) |
            (Observation.hazard_category.ilike(search_fmt)) |
            (Observation.location_details.ilike(search_fmt))
        )
        
    stmt = stmt.limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{id}", response_model=ObservationResponse)
async def get_observation(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Observation).where(Observation.id == id).options(selectinload(Observation.corrective_actions))
    result = await db.execute(stmt)
    obs = result.scalar_one_or_none()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    return obs

@router.patch("/{id}", response_model=ObservationResponse)
async def update_observation(
    id: str,
    payload: ObservationUpdate,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Observation).where(Observation.id == id).options(selectinload(Observation.corrective_actions))
    result = await db.execute(stmt)
    obs = result.scalar_one_or_none()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")

    if payload.status:
        obs.status = payload.status
    if payload.title:
        obs.title = payload.title
    if payload.description:
        obs.description = payload.description
    if payload.recommended_capa:
        obs.recommended_capa = payload.recommended_capa
    if payload.risk_level:
        obs.risk_level = payload.risk_level
    if payload.severity_score:
        obs.severity_score = payload.severity_score

    await db.commit()
    await db.refresh(obs)
    return obs

@router.delete("/{id}")
async def delete_observation(id: str, db: AsyncSession = Depends(get_db)):
    stmt = select(Observation).where(Observation.id == id)
    result = await db.execute(stmt)
    obs = result.scalar_one_or_none()
    if not obs:
        raise HTTPException(status_code=404, detail="Observation not found")
    await db.delete(obs)
    await db.commit()
    return {"message": "Observation deleted successfully", "id": id}
