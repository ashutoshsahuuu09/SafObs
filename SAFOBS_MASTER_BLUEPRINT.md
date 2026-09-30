# SafObs: AI-Powered Industrial Workplace Safety Platform
## Master Product & Engineering Blueprint

---

### Executive Vision & Philosophy
Industrial safety operations suffer from high latency between hazard occurrence, manual observation logging, and actionable remediation. Most incidents occur not because safety rules don't exist, but because **compliance checks are sporadic, manual reporting is tedious, and CCTV video feeds are passively stored without real-time intelligence.**

**SafObs** solves this by establishing a phased closed-loop safety operating system:
1. **Zero-Friction Observation Logging** (OCR, multimodal image/doc processing, voice memos).
2. **Context-Aware Safety Intelligence** (automated risk scoring, root-cause tagging, corrective action generation).
3. **Edge & Cloud Computer Vision** (real-time PPE compliance, restricted zone breaches, multi-camera context).
4. **Autonomous Safety Copilot & Predictive Analytics** (SOP compliance, RAG knowledge retrieval, recurring hazard alerts).

---

## 1. Phased Architecture & Progression Model

```mermaid
flowchart TD
    subgraph DataSources["1. Multimodal Ingestion"]
        CCTV["IP / RTSP CCTV Streams"]
        Docs["Safety Audits / PDF / Paper Forms"]
        Mobile["Voice Memos & Field Photos"]
        Manual["Web / Mobile Form Input"]
    end

    subgraph Processing["2. Processing & Perception Layer"]
        CV["Edge/Cloud Vision Pipeline\n(YOLOv8/v10, DeepSORT, Zone Geometry)"]
        OCR["Multimodal Vision / Document OCR\n(Document Layout Analyzer, Text Extraction)"]
        Whisper["Audio Transcription\n(Voice-to-Text)"]
    end

    subgraph SafetyEngine["3. SafObs Core Safety Engine"]
        Context["Context Aggregator\n(Zone + Worker + SOP + Time)"]
        RiskEngine["Risk Matrix & Severity Classifier\n(OSHA / ISO 45001 Standards)"]
        DuplicateDetector["Similarity & Duplicate Detector (Vector Embeddings)"]
        ActionGenerator["Corrective & Preventive Action (CAPA) Engine"]
    end

    subgraph Platform["4. Enterprise Safety Management"]
        Incidents["Incident & Observation Workflow"]
        Audits["CAPA Assignment & SLA Verification"]
        Analytics["Safety Metrics, Heatmaps & Compliance Trends"]
        Copilot["SafObs AI Copilot (RAG + Safety Knowledge Base)"]
    end

    CCTV --> CV
    Docs --> OCR
    Mobile --> Whisper
    Mobile --> OCR
    Manual --> Context

    CV --> Context
    OCR --> Context
    Whisper --> Context

    Context --> RiskEngine
    Context --> DuplicateDetector
    RiskEngine --> ActionGenerator
    ActionGenerator --> Incidents
    DuplicateDetector --> Incidents

    Incidents --> Audits
    Audits --> Analytics
    Analytics --> Copilot
    Incidents --> Copilot
```

---

## 2. Phase-by-Phase Roadmap & Milestones

| Phase | Core Objective | Key Deliverables | Go/No-Go Gate Criteria |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Problem & Market Validation | • ICP & User Personas<br>• Discovery Interview Scripts<br>• Privacy & Surveillance Playbook<br>• Initial Pilot Requirement Matrix | 10+ EHS/Plant Manager interviews confirming manual reporting friction & willingness to pilot |
| **Phase 1** | Safety Observation MVP (No CV yet) | • Multimodal Input (Image, Doc, PDF, Voice, Text)<br>• LLM/OCR Auto-Extraction & Severity Scoring<br>• Observation & CAPA Workflow<br>• Executive Safety Dashboard | Safety officers log complete observations in < 60s with > 85% OCR/LLM field accuracy |
| **Phase 2** | AI Safety Intelligence & Copilot | • Deduplication & Similarity Search<br>• Natural Language Query Engine<br>• Company Safety SOP RAG<br>• Automated Weekly/Monthly Safety Reports | Copilot accurately synthesizes risk trends and auto-generates EHS compliance reports |
| **Phase 3** | Real-Time CCTV MVP (Edge/RTSP) | • RTSP Stream Worker Pipeline<br>• Helmet & Safety Vest Detection<br>• Virtual Restricted Zone Polygon Breaches<br>• Live Alert Feeds & Snapshots | Real-time alerts generated in < 1.5s latency with < 5% false positive rate on pilot camera |
| **Phase 4** | Advanced Vision & Context Engine | • Safety shoes, gloves, eye protection<br>• Heavy equipment proximity / fall risks<br>• Spatial-Temporal Context (Zone + Equipment + Duration)<br>• False-positive suppression | Multi-camera tracking and accurate context events (e.g. "No vest inside active forklift zone") |
| **Phase 5** | Enterprise Safety Platform | • Multi-plant, Multi-zone Tenant Hierarchy<br>• Full Incident Investigation & Root-Cause Analysis (5 Whys, Fishbone)<br>• Verification audits, OSHA/ISO compliance reporting | Enterprise pilot handling multi-facility deployments with role-based governance |
| **Phase 6** | Autonomous Copilot & Predictive Insights | • Anomaly detection across shifts<br>• Leading indicator forecasting (risk spikes)<br>• Interactive EHS voice/chat assistant | Proactive hazard mitigation recommendations accepted and implemented by EHS teams |

---

## 3. Data Model Schema (Phase 1 & Phase 2 Foundation)

```mermaid
erDiagram
    ORGANIZATION ||--o{ SITE : operates
    SITE ||--o{ ZONE : contains
    ZONE ||--o{ CAMERA : equips
    ORGANIZATION ||--o{ USER : employs
    USER ||--o{ OBSERVATION : reports
    ZONE ||--o{ OBSERVATION : locates
    OBSERVATION ||--o{ CORRECTIVE_ACTION : triggers
    OBSERVATION ||--o{ INCIDENT : escalates_to
    INCIDENT ||--o{ CORRECTIVE_ACTION : mandates

    ORGANIZATION {
        uuid id PK
        string name
        string industry_type
        jsonb safety_policies
    }

    SITE {
        uuid id PK
        uuid organization_id FK
        string name
        string location_address
    }

    ZONE {
        uuid id PK
        uuid site_id FK
        string name
        string risk_tier "LOW, MEDIUM, HIGH, RESTRICTED"
        jsonb required_ppe "['helmet', 'vest', 'goggles']"
    }

    OBSERVATION {
        uuid id PK
        uuid zone_id FK
        uuid observer_id FK
        string source_type "IMAGE, PDF, VOICE, MANUAL, CCTV"
        string hazard_category
        string risk_level "CRITICAL, HIGH, MEDIUM, LOW"
        string title
        text description
        string status "OPEN, UNDER_REVIEW, ACTION_ASSIGNED, RESOLVED"
        jsonb ai_extracted_meta
        text raw_input_payload
        timestamp created_at
    }

    CORRECTIVE_ACTION {
        uuid id PK
        uuid observation_id FK
        uuid assigned_to FK
        text action_description
        string priority "P1, P2, P3"
        date due_date
        string status "PENDING, IN_PROGRESS, VERIFIED, CLOSED"
        text proof_of_closure_url
    }
```

---

## 4. Phase 0 Deliverable Package: Discovery & Research Framework

### A. Target Customer Segments
1. **Tier 1 (Immediate Beachhead)**: Heavy Manufacturing & Automotive Assembly (Medium-Large plants, strict safety audits, existing IP cameras, high incident penalty costs).
2. **Tier 2 (Expansion)**: Construction Contractors (Fast-moving environments, dynamic zones, mobile-heavy workflows).
3. **Tier 3 (Enterprise)**: Oil & Gas, Chemicals, Mining (High-risk compliance, hazardous area classifications, strict union/regulatory standards).

### B. Safety Officer Interview Protocol (10 Key Questions)
1. *How many safety observations are logged per week per site, and what percentage of observed hazards actually get reported?*
2. *Walk us through the exact paper/digital path from finding a hazard (e.g. oil spill or missing guardrail) to closing it.*
3. *What are your top 3 most repetitive data-entry bottlenecks in your current EHS software or spreadsheets?*
4. *How do you currently track whether corrective actions were actually executed before an incident occurs?*
5. *How many IP/CCTV cameras are installed in your facility, and who monitors them today?*
6. *What are the biggest barriers to automated camera monitoring (worker privacy, network bandwidth, union concerns, false alarms)?*
7. *How much time do you spend preparing weekly/monthly EHS audit reports for management and regulators?*
8. *What specific PPE or hazard violations cause the most fines or near-misses on your plant floor?*
9. *What is your current budget or spend for EHS software tools per year?*
10. *If a tool could auto-fill safety reports from a photo or voice note in 30 seconds and assign actions automatically, what would stop you from using it tomorrow?*

---

## 5. Phase 1 Engineering Architecture & Tech Stack

- **Frontend**: Next.js 14+ (App Router), TailwindCSS, Lucide Icons, Shadcn UI primitives, Recharts for compliance analytics.
- **Backend API**: Python FastAPI (Async, Pydantic v2, OpenAPI standard).
- **AI / Multimodal Pipeline**:
  - Multimodal Vision LLM & OCR engine for invoice/observation auto-tagging.
  - Whisper API for voice memo transcription.
  - Sentence-Transformers / pgvector for duplicate detection and semantic search.
- **Database & Storage**: PostgreSQL 16 with `pgvector` for incident vector embeddings; S3-compatible object storage (MinIO / AWS S3) for evidence photos, audio clips, and documents.
- **Task Queue**: Celery / Redis or FastAPI BackgroundTasks for async OCR and audio processing.
