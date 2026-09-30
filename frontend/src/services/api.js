const API_BASE = '/api/v1';

export const api = {
  // Observations
  async getObservations(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.risk_level) params.append('risk_level', filters.risk_level);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    
    const res = await fetch(`${API_BASE}/observations/?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch observations');
    return res.json();
  },

  async getObservation(id) {
    const res = await fetch(`${API_BASE}/observations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch observation');
    return res.json();
  },

  async createObservation(data) {
    const res = await fetch(`${API_BASE}/observations/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create observation');
    return res.json();
  },

  async updateObservation(id, data) {
    const res = await fetch(`${API_BASE}/observations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update observation');
    return res.json();
  },

  // AI Multimodal Ingestion Analyzers
  async analyzeText(text, observer = 'Vikram Sharma (Safety Lead)') {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('observer', observer);
    const res = await fetch(`${API_BASE}/observations/analyze/text`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to analyze text with AI');
    return res.json();
  },

  async analyzeImage(file, observer = 'Elena Rostova (EHS Auditor)') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('observer', observer);
    const res = await fetch(`${API_BASE}/observations/analyze/image`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to inspect image with AI');
    return res.json();
  },

  async analyzeVoice(audioFileOrBlob, transcriptText = '', observer = 'Marcus Vance (Shift Supervisor)') {
    const formData = new FormData();
    if (audioFileOrBlob instanceof Blob || audioFileOrBlob instanceof File) {
      formData.append('audio_file', audioFileOrBlob, 'voice_memo.webm');
    }
    if (transcriptText) {
      formData.append('transcript_text', transcriptText);
    }
    formData.append('observer', observer);
    const res = await fetch(`${API_BASE}/observations/analyze/voice`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to process voice memo');
    return res.json();
  },

  async analyzeDocument(file, observer = 'Rajesh Patel (Safety Officer)') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('observer', observer);
    const res = await fetch(`${API_BASE}/observations/analyze/document`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Failed to OCR document');
    return res.json();
  },

  // CAPA
  async getCapas(filters = {}) {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    const res = await fetch(`${API_BASE}/capa/?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch CAPAs');
    return res.json();
  },

  async updateCapa(id, data) {
    const res = await fetch(`${API_BASE}/capa/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update CAPA');
    return res.json();
  },

  // Analytics
  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics/summary`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Copilot
  async queryCopilot(prompt) {
    const res = await fetch(`${API_BASE}/copilot/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Failed to query Copilot');
    return res.json();
  }
};
