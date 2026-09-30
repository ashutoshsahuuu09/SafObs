from datetime import datetime
import uuid
from sqlalchemy import Column, String, Text, Integer, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Site(Base):
    __tablename__ = "sites"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    location = Column(String(150), nullable=False)
    industry_type = Column(String(100), default="Manufacturing")
    created_at = Column(DateTime, default=datetime.utcnow)

    observations = relationship("Observation", back_populates="site", cascade="all, delete-orphan")


class Observation(Base):
    __tablename__ = "observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    site_id = Column(String(36), ForeignKey("sites.id"), nullable=True)
    unit_name = Column(String(100), nullable=False, default="Plant 01 - Main Facility")
    department = Column(String(100), nullable=False)
    location_details = Column(String(150), nullable=False)
    observer_name = Column(String(100), nullable=False)
    
    # Input channel
    source_type = Column(String(50), default="MANUAL")  # IMAGE, VOICE, PDF, MANUAL, CCTV
    
    # AI Classification
    hazard_category = Column(String(100), nullable=False)  # PPE, Chemical, Electrical, Slip/Trip, Fire/Explosion, Machine Guarding, Working at Height
    risk_level = Column(String(20), nullable=False)       # CRITICAL, HIGH, MEDIUM, LOW
    severity_score = Column(Integer, default=5)           # 1 - 10
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    recommended_capa = Column(Text, nullable=True)
    ai_confidence = Column(Float, default=0.92)
    
    # Attachments & Voice Transcripts
    media_url = Column(String(255), nullable=True)
    original_transcript_or_text = Column(Text, nullable=True)
    
    # Lifecycle
    status = Column(String(50), default="OPEN")  # OPEN, UNDER_REVIEW, ACTION_ASSIGNED, RESOLVED
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    site = relationship("Site", back_populates="observations")
    corrective_actions = relationship("CorrectiveAction", back_populates="observation", cascade="all, delete-orphan")


class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    observation_id = Column(String(36), ForeignKey("observations.id"), nullable=False)
    
    title = Column(String(200), nullable=False)
    action_description = Column(Text, nullable=False)
    assigned_to = Column(String(100), nullable=False)
    assigned_email = Column(String(100), nullable=True)
    priority = Column(String(20), default="P2")  # P1-Critical, P2-High, P3-Standard
    
    due_date = Column(DateTime, nullable=False)
    status = Column(String(50), default="PENDING")  # PENDING, IN_PROGRESS, VERIFICATION_SUBMITTED, CLOSED
    
    proof_url = Column(String(255), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    verified_by = Column(String(100), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    observation = relationship("Observation", back_populates="corrective_actions")
