from datetime import datetime, timedelta
import random
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import Site, Observation, CorrectiveAction

SAMPLE_SITES = [
    {"name": "Plant 01 - Detroit Automotive Complex", "code": "DET-01", "location": "Detroit, MI", "industry": "Automotive Assembly"},
    {"name": "Plant 02 - Ohio Battery & Gigacell", "code": "OH-02", "location": "Columbus, OH", "industry": "Energy & Chemicals"},
    {"name": "Site 03 - Houston Fabrication Yard", "code": "HOU-03", "location": "Houston, TX", "industry": "Heavy Fabrication"}
]

SAMPLE_OBSERVATIONS = [
    {
        "unit_name": "Plant 01 - Detroit Automotive Complex",
        "department": "Fabrication & Welding",
        "location_details": "Zone B - Robotic Welding Cell #4",
        "observer_name": "Vikram Sharma (EHS Lead)",
        "source_type": "IMAGE",
        "hazard_category": "Fire & Explosion Safety",
        "risk_level": "HIGH",
        "severity_score": 8,
        "title": "Blocked Portable Fire Extinguisher & Flammable Storage",
        "description": "Found 3 loaded wooden pallets stacked directly in front of Type ABC 10kg dry powder fire extinguisher, eliminating required 36-inch clearance. Adjacent storage of acetone cans.",
        "recommended_capa": "Relocate pallets to marked storage bay. Paint safety clearance red box on floor and verify nozzle gauge.",
        "status": "ACTION_ASSIGNED",
        "ai_confidence": 0.96,
        "created_days_ago": 2,
        "capa": {
            "title": "Clear Fire Extinguisher Zone & Repaint Floor Markings",
            "action_description": "Immediately clear all pallet obstructions and apply OSHA safety floor hazard tape around Station 4.",
            "assigned_to": "David Miller (Floor Supervisor)",
            "priority": "P1",
            "days_to_due": 1,
            "status": "IN_PROGRESS"
        }
    },
    {
        "unit_name": "Plant 01 - Detroit Automotive Complex",
        "department": "Heavy Press & Stamping Bay",
        "location_details": "Hydraulic Stamping Press #12",
        "observer_name": "Elena Rostova (Senior Safety Inspector)",
        "source_type": "VOICE",
        "hazard_category": "Chemical & Hazardous Material",
        "risk_level": "CRITICAL",
        "severity_score": 9,
        "title": "High-Pressure Hydraulic Fluid Leak on Main Walkway",
        "description": "Active hydraulic fluid seepage from high-pressure line fitting over main operator transit path. Slip risk and potential line rupture under 3,000 PSI operating pressure.",
        "recommended_capa": "Depressurize line, isolate machine with LOTO, deploy chemical absorbent boom, replace high-pressure O-ring fitting.",
        "status": "ACTION_ASSIGNED",
        "ai_confidence": 0.94,
        "created_days_ago": 1,
        "capa": {
            "title": "Lockout Press #12 & Replace Hydraulic Seal",
            "action_description": "Execute LOTO, replace damaged hydraulic fitting, inspect surrounding lines for fatigue, clean floor with industrial degreaser.",
            "assigned_to": "Carlos Mendez (Lead Maintenance Tech)",
            "priority": "P1",
            "days_to_due": 0,
            "status": "IN_PROGRESS"
        }
    },
    {
        "unit_name": "Plant 01 - Detroit Automotive Complex",
        "department": "Logistics & Staging Dock",
        "location_details": "Loading Dock Bay 3",
        "observer_name": "Marcus Vance (Logistics Safety Lead)",
        "source_type": "IMAGE",
        "hazard_category": "PPE Non-Compliance",
        "risk_level": "MEDIUM",
        "severity_score": 6,
        "title": "Subcontractor Unloading Cargo Without High-Visibility Vest",
        "description": "Third-party freight driver observed in active forklift traffic lane without Class 2 high-visibility safety vest and protective toe cap footwear.",
        "recommended_capa": "Issue temporary high-vis vest and steel-toe overshoes. Add mandatory PPE check at security gate check-in.",
        "status": "RESOLVED",
        "ai_confidence": 0.97,
        "created_days_ago": 4,
        "capa": {
            "title": "Provide Gatehouse PPE Kits & Contractor Briefing",
            "action_description": "Equip security gate with contractor PPE loaner kits and mandate gate sign-off.",
            "assigned_to": "Sarah Jenkins (Site Logistics Manager)",
            "priority": "P2",
            "days_to_due": -1,
            "status": "CLOSED",
            "resolution_notes": "Gatekeeper equipped with 20 spare reflective vests and contractor badges."
        }
    },
    {
        "unit_name": "Plant 01 - Detroit Automotive Complex",
        "department": "Paint Shop & Finishing",
        "location_details": "Booth #2 Ventilation Stack",
        "observer_name": "Rajesh Patel (Safety Officer)",
        "source_type": "PDF",
        "hazard_category": "Working at Height & Fall Hazard",
        "risk_level": "CRITICAL",
        "severity_score": 9,
        "title": "Missing Mid-Rail Guardrail on Elevated Maintenance Catwalk",
        "description": "Scaffolding audit scan revealed missing 21-inch mid-rail and toe-board on 18-ft elevated filter replacement platform.",
        "recommended_capa": "Install certified OSHA mid-rail and toe-board immediately. Restrict catwalk access with physical lockout chain.",
        "status": "OPEN",
        "ai_confidence": 0.95,
        "created_days_ago": 0,
        "capa": {
            "title": "Erect Scaffolding Guardrail System",
            "action_description": "Install aluminum mid-rail and 4-inch toe-board per OSHA 1926.451 standards.",
            "assigned_to": "Tom Bradley (Facilities Foreman)",
            "priority": "P1",
            "days_to_due": 1,
            "status": "PENDING"
        }
    },
    {
        "unit_name": "Plant 01 - Detroit Automotive Complex",
        "department": "Assembly Line 02",
        "location_details": "Torque Station 7 Overhang",
        "observer_name": "Aisha Al-Mansoor (Quality & Safety)",
        "source_type": "MANUAL",
        "hazard_category": "Electrical & LOTO",
        "risk_level": "HIGH",
        "severity_score": 7,
        "title": "Exposed Wire Core on 240V Overhead Tool Drop",
        "description": "Repeated mechanical flexing of tool suspension cable caused outer insulation sheath to split, exposing live conductor core near operator grip area.",
        "recommended_capa": "De-energize circuit breaker, replace tool balancer cord with heavy-duty flex-rated cable, install strain relief boot.",
        "status": "ACTION_ASSIGNED",
        "ai_confidence": 0.93,
        "created_days_ago": 3,
        "capa": {
            "title": "Replace Overhead Drop Cable & Strain Relief",
            "action_description": "Install ruggedized coil cable and conduct 500V insulation resistance check.",
            "assigned_to": "Keith Reynolds (Electrician)",
            "priority": "P2",
            "days_to_due": 2,
            "status": "IN_PROGRESS"
        }
    },
    {
        "unit_name": "Plant 01 - Detroit Automotive Complex",
        "department": "Maintenance & Tooling",
        "location_details": "CNC Milling Area Tool Crib",
        "observer_name": "Vikram Sharma (EHS Lead)",
        "source_type": "VOICE",
        "hazard_category": "Housekeeping & Physical Hazards",
        "risk_level": "LOW",
        "severity_score": 4,
        "title": "Metal Swarf & Oil Film on Pedestrian Walkway",
        "description": "Accumulation of sharp aluminum chips and light coolant overspray outside CNC Cell #7 creating slip hazard and footwear contamination.",
        "recommended_capa": "Deploy chip vacuum and replace containment splash curtain. Re-align coolant deflector nozzle.",
        "status": "RESOLVED",
        "ai_confidence": 0.91,
        "created_days_ago": 5,
        "capa": {
            "title": "Clean CNC Aisle & Install Splash Deflector",
            "action_description": "Vacuum swarf, degrease walkway, fit rubber chip shield onto CNC door.",
            "assigned_to": "Zack Lee (CNC Operator)",
            "priority": "P3",
            "days_to_due": -3,
            "status": "CLOSED",
            "resolution_notes": "Walkway cleaned and rubber splash curtain mounted."
        }
    }
]

async def seed_database(db: AsyncSession):
    # Check if sites already exist
    result = await db.execute(select(Site))
    existing_sites = result.scalars().all()
    if existing_sites:
        return

    # Seed Sites
    site_objects = []
    for s_data in SAMPLE_SITES:
        site = Site(
            name=s_data["name"],
            code=s_data["code"],
            location=s_data["location"],
            industry_type=s_data["industry"]
        )
        db.add(site)
        site_objects.append(site)
    await db.flush()

    primary_site = site_objects[0]

    # Seed Observations
    for obs_data in SAMPLE_OBSERVATIONS:
        created_time = datetime.utcnow() - timedelta(days=obs_data["created_days_ago"], hours=random.randint(1, 10))
        obs = Observation(
            site_id=primary_site.id,
            unit_name=obs_data["unit_name"],
            department=obs_data["department"],
            location_details=obs_data["location_details"],
            observer_name=obs_data["observer_name"],
            source_type=obs_data["source_type"],
            hazard_category=obs_data["hazard_category"],
            risk_level=obs_data["risk_level"],
            severity_score=obs_data["severity_score"],
            title=obs_data["title"],
            description=obs_data["description"],
            recommended_capa=obs_data["recommended_capa"],
            ai_confidence=obs_data["ai_confidence"],
            status=obs_data["status"],
            created_at=created_time,
            updated_at=created_time
        )
        db.add(obs)
        await db.flush()

        if "capa" in obs_data:
            c = obs_data["capa"]
            due = datetime.utcnow() + timedelta(days=c["days_to_due"])
            closed_at = datetime.utcnow() - timedelta(days=1) if c["status"] == "CLOSED" else None
            capa = CorrectiveAction(
                observation_id=obs.id,
                title=c["title"],
                action_description=c["action_description"],
                assigned_to=c["assigned_to"],
                priority=c["priority"],
                due_date=due,
                status=c["status"],
                resolution_notes=c.get("resolution_notes"),
                closed_at=closed_at,
                created_at=created_time
            )
            db.add(capa)

    await db.commit()
