import re
import os
import random
from typing import Optional, Dict, Any
from app.models.schemas import AIAnalysisResult

HAZARD_PATTERNS = [
    {
        "keywords": ["fire", "extinguisher", "blocked", "sprinkler", "flammable", "combustible"],
        "category": "Fire & Explosion Safety",
        "default_risk": "HIGH",
        "severity": 8,
        "osha": "OSHA 1910.157 - Portable fire extinguishers must be kept accessible.",
        "capa_template": "Clear 36-inch clearance around all fire extinguishers immediately. Install high-visibility floor tape markings and brief shift supervisor."
    },
    {
        "keywords": ["helmet", "hard hat", "vest", "ppe", "goggles", "gloves", "earplug", "mask", "shoes"],
        "category": "PPE Non-Compliance",
        "default_risk": "MEDIUM",
        "severity": 6,
        "osha": "OSHA 1910.132 - General requirements for personal protective equipment.",
        "capa_template": "Issue immediate PPE replacement from safety locker. Log tool-box talk with subcontractor team before next shift entry."
    },
    {
        "keywords": ["spill", "oil", "chemical", "leak", "slippery", "drum", "acid", "containment"],
        "category": "Chemical & Hazardous Material",
        "default_risk": "CRITICAL",
        "severity": 9,
        "osha": "OSHA 1910.1200 - Hazard Communication & Spill Response.",
        "capa_template": "Deploy chemical spill absorbent kit immediately. Inspect primary gasket seal and log containment bund drain inspection."
    },
    {
        "keywords": ["scaffold", "ladder", "height", "fall", "harness", "guardrail", "elevated", "roof"],
        "category": "Working at Height & Fall Hazard",
        "default_risk": "CRITICAL",
        "severity": 9,
        "osha": "OSHA 1926.501 - Duty to have fall protection above 4 feet.",
        "capa_template": "Tag out scaffold section immediately. Install standard toe-board and mid-rail guardrails, verify double-lanyard harness anchor points."
    },
    {
        "keywords": ["wire", "electrical", "panel", "spark", "cable", "lockout", "tagout", "loto", "breaker"],
        "category": "Electrical & LOTO",
        "default_risk": "HIGH",
        "severity": 8,
        "osha": "OSHA 1910.147 - Control of hazardous energy (Lockout/Tagout).",
        "capa_template": "Apply LOTO lock to isolation switchboard. Replace frayed conduit cable and conduct insulation resistance test before re-energizing."
    },
    {
        "keywords": ["forklift", "pedestrian", "crane", "machine", "guard", "pinch", "roller", "conveyor", "aisle"],
        "category": "Machinery & Equipment Safety",
        "default_risk": "HIGH",
        "severity": 7,
        "osha": "OSHA 1910.212 - General requirements for machine guarding.",
        "capa_template": "Reinstall interlock safety mesh guard. Establish illuminated pedestrian walkway boundary and inspect optical safety curtain."
    },
    {
        "keywords": ["trip", "slip", "clutter", "pallet", "housekeeping", "storage", "blocked walkway"],
        "category": "Housekeeping & Physical Hazards",
        "default_risk": "MEDIUM",
        "severity": 5,
        "osha": "OSHA 1910.22 - Walking-working surfaces standard.",
        "capa_template": "Remove protruding wooden pallets from main traffic line. Restock inventory into designated rack bays."
    }
]

DEPARTMENTS = [
    "Fabrication & Welding",
    "Assembly Line 02",
    "Chemical Storage & Mixing",
    "Logistics & Staging Dock",
    "Heavy Press & Stamping Bay",
    "Maintenance & Tooling",
    "Paint Shop & Finishing"
]

LOCATIONS = [
    "Zone B - North Corridor Station 4",
    "Dock 3 Overhead Crane Area",
    "Press Cell #12 Sub-Assembly",
    "Chemical Drum Storage Bay #4",
    "Paint Booth Filtration Exhaust Aisle",
    "High-Bay Rack Corridor 7",
    "Main Assembly Line Station 14"
]

class AIExtractionService:
    """Industrial Safety AI Multimodal Perception & Extraction Engine"""

    @staticmethod
    def extract_from_text(raw_text: str, observer_hint: str = "Vikram Sharma (Safety Lead)") -> AIAnalysisResult:
        text_lower = raw_text.lower()
        
        matched_rule = HAZARD_PATTERNS[-1]
        for rule in HAZARD_PATTERNS:
            if any(k in text_lower for k in rule["keywords"]):
                matched_rule = rule
                break

        # Match or infer Department
        dept_match = None
        for d in DEPARTMENTS:
            if d.lower() in text_lower or any(word in text_lower for word in d.lower().split() if len(word) > 4):
                dept_match = d
                break
        if not dept_match:
            dept_match = random.choice(DEPARTMENTS)

        # Match or infer Location
        loc_match = None
        for l in LOCATIONS:
            if any(word in text_lower for word in l.lower().split() if len(word) > 4):
                loc_match = l
                break
        if not loc_match:
            loc_match = random.choice(LOCATIONS)

        # Determine severity based on text markers
        severity = matched_rule["severity"]
        risk_level = matched_rule["default_risk"]
        if "critical" in text_lower or "severe" in text_lower or "emergency" in text_lower or "immediate danger" in text_lower:
            risk_level = "CRITICAL"
            severity = max(severity, 9)
        elif "low risk" in text_lower or "minor" in text_lower:
            risk_level = "LOW"
            severity = min(severity, 4)

        # Generate professional title
        title = f"{matched_rule['category']} Violation detected at {dept_match}"
        if len(raw_text.splitlines()) > 0 and len(raw_text.splitlines()[0]) < 80 and len(raw_text.splitlines()[0]) > 10:
            title = raw_text.splitlines()[0].strip()

        flags = [f"Detected: {matched_rule['category']}", f"Risk Tier: {risk_level}"]
        if "helmet" in text_lower or "vest" in text_lower:
            flags.append("PPE Anomaly")
        if "spill" in text_lower or "oil" in text_lower:
            flags.append("Environmental Hazard")
        if "fire" in text_lower or "cable" in text_lower:
            flags.append("Fire / Thermal Vector")

        return AIAnalysisResult(
            unit_name="Plant 01 - Manufacturing Complex",
            department=dept_match,
            location_details=loc_match,
            observer_name=observer_hint,
            hazard_category=matched_rule["category"],
            risk_level=risk_level,
            severity_score=severity,
            title=title,
            description=raw_text.strip(),
            recommended_capa=matched_rule["capa_template"],
            ai_confidence=round(random.uniform(0.91, 0.98), 2),
            detected_objects_or_flags=flags,
            osha_reference=matched_rule["osha"]
        )

    @staticmethod
    def analyze_image_file(filename: str, file_path: str, observer_hint: str = "Elena Rostova (EHS Auditor)") -> AIAnalysisResult:
        """Simulate Computer Vision Multimodal OCR & Feature Extraction on uploaded plant image"""
        fname = filename.lower()
        if "extinguisher" in fname or "fire" in fname or "red" in fname:
            sample_text = "Blocked portable fire extinguisher type ABC behind wooden pallets. Access corridor restricted by 42 inches in Logistics Aisle."
        elif "spill" in fname or "oil" in fname or "chemical" in fname:
            sample_text = "Hydraulic oil leak puddling under high-pressure stamping cylinder. Absence of secondary drip tray or sorbent pads."
        elif "guard" in fname or "machine" in fname or "press" in fname:
            sample_text = "Interlock safety cage door bypassed with zip-tie on Rotary Milling Cell #3. Exposed pinch points."
        elif "height" in fname or "ladder" in fname or "scaffold" in fname:
            sample_text = "Subcontractor working on elevated duct platform at 14 ft height without attached fall arrest harness lifeline."
        elif "wire" in fname or "electric" in fname or "cable" in fname:
            sample_text = "Damaged 480V industrial cable sheath on overhead power drop touching metal conduit rack."
        else:
            sample_text = f"Visual safety inspection anomaly detected from image file {filename}. Unsecured materials and PPE deficiency observed in transit aisle."
            
        result = AIExtractionService.extract_from_text(sample_text, observer_hint=observer_hint)
        return result

    @staticmethod
    def transcribe_and_extract_voice(audio_text_or_filename: str, observer_name: str = "Marcus Vance (Shift Supervisor)") -> AIAnalysisResult:
        """Simulate Whisper audio transcription and instant safety entity extraction"""
        if len(audio_text_or_filename) > 30 and not audio_text_or_filename.endswith(('.wav', '.mp3', '.m4a', '.webm')):
            transcript = audio_text_or_filename
        else:
            transcript = "Audio Memo: This is Marcus at Assembly Line 02. We noticed two operators handling solvent transfer without chemical-resistant nitrile gloves and face shields. Please assign immediate PPE replenishment and caution notice."
        
        result = AIExtractionService.extract_from_text(transcript, observer_hint=observer_name)
        result.description = f"🎙️ [Voice Memo Transcript]: {transcript}"
        return result

    @staticmethod
    def ocr_document(filename: str, observer_name: str = "Rajesh Patel (Safety Officer)") -> AIAnalysisResult:
        """Simulate OCR extraction from safety inspection PDF or scan"""
        doc_text = f"DOCUMENT AUDIT SCAN [{filename}]: Shift Inspection Report: Stamping Press Bay #4. Discovered primary emergency stop button stuck in recessed position. High risk of delayed shutdown in entrapment event. Immediate electrical maintenance dispatch requested."
        result = AIExtractionService.extract_from_text(doc_text, observer_hint=observer_name)
        result.description = f"📄 [Scanned Document OCR]: {doc_text}"
        return result

ai_extractor = AIExtractionService()
