const BASE = '/api'

export const api = {
  status:      () => fetch(`${BASE}/status`).then(r => r.json()),
  companies:   () => fetch(`${BASE}/companies`).then(r => r.json()),
  company:     (id) => fetch(`${BASE}/companies/${id}`).then(r => r.json()),
  outputs:     () => fetch(`${BASE}/outputs`).then(r => r.json()),
  matchInvestors: (id) => fetch(`${BASE}/investors/match/${id}`).then(r => r.json()),
  generate: (payload) => fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json()),
  downloadUrl: (filename) => `${BASE}/download/${encodeURIComponent(filename)}`,

  // New Endpoints
  dataEngineCompany: (payload) => fetch(`${BASE}/data_engine/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json()),
  
  dataEngineInvestor: (payload) => fetch(`${BASE}/data_engine/investor`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json()),

  matchingEngineSync: () => fetch(`${BASE}/matching_engine/sync`, { method: 'POST' }).then(r => r.json()),
  
  matchingEngineRun: () => fetch(`${BASE}/matching_engine/run`, { method: 'POST' }).then(r => r.json()),
  
  matchingEngineResults: () => fetch(`${BASE}/matching_engine/results`).then(r => r.json()),
  
  customGenerate: (payload) => fetch(`${BASE}/content_engine/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json()),
  
  matchingEngineScoreSpecific: (payload) => fetch(`${BASE}/matching_engine/score_specific`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(r => r.json()),
}
