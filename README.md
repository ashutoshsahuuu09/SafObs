# SafObs — AI-Powered Industrial Workplace Safety Platform
> **Phase 1 MVP Production Release**

SafObs is an enterprise-grade AI safety operating system built for discrete manufacturing plants, stamping bays, fabrication yards, and high-risk industrial facilities.

---

## 🚀 Live Application Services

| Service | Technology | Port / URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | React 18 + Vite + TailwindCSS + Recharts | [http://localhost:3000](http://localhost:3000) | 🟢 Active |
| **Backend API** | Python FastAPI + SQLAlchemy (Async) | [http://127.0.0.1:8000](http://127.0.0.1:8000) | 🟢 Active |
| **Interactive API Docs** | Swagger / OpenAPI UI | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | 🟢 Active |

---

## 🛠️ Key Features Implemented in Phase 1

### 1. Multimodal Zero-Friction Observation Ingestion (< 30s vs 25 min manual baseline)
- 📸 **Image Vision Analysis**: Upload plant photos (e.g. blocked extinguishers, chemical drips, damaged conduit) with automated entity, department, and risk level extraction.
- 🎙️ **Voice Memo Recording & Whisper Speech-to-Report**: Record field audio memos with live sound-wave visualizers; transcribes and formats structured safety observations automatically.
- 📄 **Document / Audit Checklist OCR**: Ingest scanned inspection checklists and PDFs into structured fields.
- ✍️ **Guided Quick Entry**: Fast form with smart AI assist and OSHA 1910 standard mapping.

### 2. Closed-Loop Corrective & Preventive Action (CAPA) Workflow
- Automated SLA calculation (Critical = 24h, High = 72h, Medium/Low = 7d).
- Priority badges (`P1-Critical`, `P2-High`, `P3-Standard`).
- Assignee assignment, verification notes, and one-click closure.

### 3. Executive Safety Intelligence & Analytics
- **Hazard Pareto Distribution Chart** (Identifies recurring violation root causes).
- **7-Day Inflow vs. Remediation Trend** (Monitors Mean Time to Remediation - MTTR).
- **Department Risk Matrix & Heatmap** (Highlights departments with high risk concentration).

### 4. Phase 2 Preview: AI Safety Copilot
- Natural language query engine capable of answering questions like:
  - *"Show high-risk observations from this week"*
  - *"Which department has the most open CAPAs?"*
  - *"Generate a weekly safety compliance brief"*

### 5. Phase 3 Preview: Real-Time CCTV Stream Vision Simulation
- Interactive multi-camera monitor with synthetic YOLOv8 bounding boxes for PPE compliance (*Helmet ✓, Vest ✓, Missing Helmet 🔴*) and virtual polygon restricted zone breach detection.

---

## 💻 Running the Project Locally

### Backend:
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 Architecture Structure
```
SafObs/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Observations, CAPA, Analytics, Copilot routes
│   │   ├── core/            # App settings & upload directories
│   │   ├── db/              # Async SQLAlchemy DB session
│   │   ├── models/          # ORM models & Pydantic v2 schemas
│   │   ├── services/        # AI Multimodal Extractor & Seed Generator
│   │   └── main.py          # FastAPI lifespan application entry
│   ├── run.py               # Uvicorn launcher
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # Header, MetricCards, ObservationModal, Feed, CAPA, Analytics, Copilot, CCTV
│   │   ├── services/        # API client
│   │   ├── App.jsx          # Root application orchestrator
│   │   └── index.css        # Tailwind & glassmorphism theme
│   ├── package.json
│   └── vite.config.js
└── SAFOBS_MASTER_BLUEPRINT.md
```
