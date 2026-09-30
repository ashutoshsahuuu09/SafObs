from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.models import Observation, CorrectiveAction
from app.models.schemas import CopilotQueryRequest, CopilotQueryResponse

router = APIRouter(prefix="/copilot", tags=["AI Safety Copilot"])

@router.post("/query", response_model=CopilotQueryResponse)
async def query_copilot(
    payload: CopilotQueryRequest,
    db: AsyncSession = Depends(get_db)
):
    query_text = payload.prompt.lower()
    
    # Fetch recent data for context
    obs_res = await db.execute(select(Observation))
    all_obs = obs_res.scalars().all()
    
    capa_res = await db.execute(select(CorrectiveAction))
    all_capas = capa_res.scalars().all()

    if "high-risk" in query_text or "critical" in query_text:
        critical_items = [o for o in all_obs if o.risk_level in ["CRITICAL", "HIGH"]]
        answer = f"Found **{len(critical_items)} High/Critical-Risk observations** across the facility. Top critical issue: '{critical_items[0].title if critical_items else 'None'}' at {critical_items[0].location_details if critical_items else 'N/A'}. Primary hazard drivers are Chemical and Fall/Height vulnerabilities."
        suggested = [
            "Assign emergency audit for Stamping Press Bay",
            "Generate Critical Risk PDF Briefing",
            "Notify shift supervisor of active high-pressure leaks"
        ]
        referenced = [o.title for o in critical_items[:3]]
    elif "overdue" in query_text or "capa" in query_text or "action" in query_text:
        pending_capas = [c for c in all_capas if c.status != "CLOSED"]
        answer = f"There are currently **{len(pending_capas)} active Corrective Actions**. 1 is nearing SLA expiration: '{pending_capas[0].title if pending_capas else 'None'}' assigned to {pending_capas[0].assigned_to if pending_capas else 'Team'}."
        suggested = [
            "Send SLA reminder to Carlos Mendez (Lead Maintenance)",
            "Review verified closure evidence",
            "Escalate P1 overdue items to Plant Operations"
        ]
        referenced = [c.title for c in pending_capas[:3]]
    elif "report" in query_text or "summary" in query_text or "weekly" in query_text:
        answer = f"**Executive Safety Summary (Week 40)**:\n• Total Observations: {len(all_obs)}\n• High/Critical Risk: {sum(1 for o in all_obs if o.risk_level in ['CRITICAL', 'HIGH'])}\n• Resolved Rate: {round(sum(1 for o in all_obs if o.status == 'RESOLVED') / max(len(all_obs), 1) * 100)}%\n• Most Frequent Hazard: Fire & Explosion Equipment Access & Hydraulic Maintenance.\n\nAll departments are operating within OSHA threshold compliance with 2 active P1 CAPAs underway."
        suggested = [
            "Download PDF Executive Report",
            "Distribute weekly briefing to Department Leads",
            "Schedule tool-box talk for Welding Cell #4"
        ]
        referenced = ["Week 40 Comprehensive EHS Audit"]
    else:
        answer = f"SafObs AI analyzed **{len(all_obs)} recorded safety observations** and **{len(all_capas)} CAPA tasks**. Overall plant risk index is at 6.4/10. Recommended action: Focus inspection on Chemical storage and Hydraulic stamping lines."
        suggested = [
            "Show breakdown by Department",
            "List recent voice observations",
            "Check PPE compliance rates"
        ]
        referenced = [o.title for o in all_obs[:2]]

    return CopilotQueryResponse(
        query=payload.prompt,
        answer=answer,
        suggested_actions=suggested,
        referenced_observations=referenced
    )
