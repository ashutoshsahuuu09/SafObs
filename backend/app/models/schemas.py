from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class CorrectiveActionBase(BaseModel):
    title: str
    action_description: str
    assigned_to: str
    assigned_email: Optional[str] = None
    priority: str = "P2"
    due_date: datetime
    status: str = "PENDING"
    resolution_notes: Optional[str] = None
    proof_url: Optional[str] = None

class CorrectiveActionCreate(CorrectiveActionBase):
    observation_id: str

class CorrectiveActionUpdate(BaseModel):
    status: Optional[str] = None
    resolution_notes: Optional[str] = None
    proof_url: Optional[str] = None
    verified_by: Optional[str] = None

class CorrectiveActionResponse(CorrectiveActionBase):
    id: str
    observation_id: str
    created_at: datetime
    closed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ObservationBase(BaseModel):
    unit_name: str = "Plant 01 - Automotive Assembly"
    department: str
    location_details: str
    observer_name: str
    source_type: str = "MANUAL"
    hazard_category: str
    risk_level: str
    severity_score: int = Field(default=5, ge=1, le=10)
    title: str
    description: str
    recommended_capa: Optional[str] = None
    media_url: Optional[str] = None
    original_transcript_or_text: Optional[str] = None

class ObservationCreate(ObservationBase):
    site_id: Optional[str] = None
    ai_confidence: Optional[float] = 0.92

class ObservationUpdate(BaseModel):
    status: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    recommended_capa: Optional[str] = None
    risk_level: Optional[str] = None
    severity_score: Optional[int] = None

class ObservationResponse(ObservationBase):
    id: str
    site_id: Optional[str] = None
    status: str
    ai_confidence: float
    created_at: datetime
    updated_at: datetime
    corrective_actions: List[CorrectiveActionResponse] = []

    class Config:
        from_attributes = True


class AIAnalysisResult(BaseModel):
    unit_name: str
    department: str
    location_details: str
    observer_name: str
    hazard_category: str
    risk_level: str
    severity_score: int
    title: str
    description: str
    recommended_capa: str
    ai_confidence: float
    detected_objects_or_flags: List[str] = []
    osha_reference: Optional[str] = None


class CopilotQueryRequest(BaseModel):
    prompt: str
    context_filters: Optional[dict] = None

class CopilotQueryResponse(BaseModel):
    query: str
    answer: str
    suggested_actions: List[str] = []
    referenced_observations: List[str] = []
    generated_chart_data: Optional[dict] = None


class DashboardAnalytics(BaseModel):
    total_observations: int
    open_observations: int
    high_risk_observations: int
    resolved_observations: int
    overdue_actions: int
    mean_time_to_resolve_hours: float
    risk_distribution: dict
    hazard_breakdown: List[dict]
    department_risk_matrix: List[dict]
    recent_trend: List[dict]
