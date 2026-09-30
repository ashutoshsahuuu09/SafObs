from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from app.db.database import get_db
from app.models.models import CorrectiveAction, Observation
from app.models.schemas import (
    CorrectiveActionCreate,
    CorrectiveActionResponse,
    CorrectiveActionUpdate
)

router = APIRouter(prefix="/capa", tags=["Corrective Actions"])

@router.get("/", response_model=List[CorrectiveActionResponse])
async def list_corrective_actions(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(CorrectiveAction).order_by(desc(CorrectiveAction.created_at))
    if status:
        stmt = stmt.where(CorrectiveAction.status == status.upper())
    if priority:
        stmt = stmt.where(CorrectiveAction.priority == priority.upper())
    if assigned_to:
        stmt = stmt.where(CorrectiveAction.assigned_to.ilike(f"%{assigned_to}%"))

    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=CorrectiveActionResponse)
async def create_corrective_action(
    payload: CorrectiveActionCreate,
    db: AsyncSession = Depends(get_db)
):
    # Verify observation exists
    obs_stmt = select(Observation).where(Observation.id == payload.observation_id)
    res = await db.execute(obs_stmt)
    if not res.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Parent observation not found")

    capa = CorrectiveAction(
        observation_id=payload.observation_id,
        title=payload.title,
        action_description=payload.action_description,
        assigned_to=payload.assigned_to,
        assigned_email=payload.assigned_email,
        priority=payload.priority,
        due_date=payload.due_date,
        status=payload.status,
        resolution_notes=payload.resolution_notes,
        proof_url=payload.proof_url
    )
    db.add(capa)
    await db.commit()
    await db.refresh(capa)
    return capa

@router.patch("/{id}", response_model=CorrectiveActionResponse)
async def update_corrective_action(
    id: str,
    payload: CorrectiveActionUpdate,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(CorrectiveAction).where(CorrectiveAction.id == id)
    result = await db.execute(stmt)
    capa = result.scalar_one_or_none()
    if not capa:
        raise HTTPException(status_code=404, detail="Corrective action not found")

    if payload.status:
        capa.status = payload.status
        if payload.status == "CLOSED":
            capa.closed_at = datetime.utcnow()
            # Also check if parent observation should be resolved
            obs_stmt = select(Observation).where(Observation.id == capa.observation_id)
            obs_res = await db.execute(obs_stmt)
            obs = obs_res.scalar_one_or_none()
            if obs:
                obs.status = "RESOLVED"

    if payload.resolution_notes:
        capa.resolution_notes = payload.resolution_notes
    if payload.proof_url:
        capa.proof_url = payload.proof_url
    if payload.verified_by:
        capa.verified_by = payload.verified_by

    await db.commit()
    await db.refresh(capa)
    return capa
