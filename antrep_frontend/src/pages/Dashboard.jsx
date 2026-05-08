import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function Dashboard({ status }) {
  const [companies, setCompanies] = useState([])
  const [outputs, setOutputs] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.companies().then(d => setCompanies(d.companies || []))
    api.outputs().then(d => setOutputs(d.files || []))
  }, [])

  const realCount = companies.filter(c => !c.is_fake).length
  const pdfCount  = outputs.filter(f => f.filename.endsWith('.pdf')).length
  const pptxCount = outputs.filter(f => f.filename.endsWith('.pptx')).length

  return (
    <div>
      <div className="page-hdr">
        <h2>Dashboard</h2>
        <p>ANTREP Content Engine — AI-powered investment document generation</p>
      </div>

      {/* Engine status */}
      {status && (
        <div className={`alert ${status.api === 'ok' ? 'success' : 'error'}`} style={{ marginBottom: 24 }}>
          {status.api === 'ok'
            ? `All systems online — Data Engine connected at ${status.data_engine_dir}`
            : 'API server is unreachable. Start it with: python api_server.py'}
        </div>
      )}

      {/* Stat cards */}
      <div className="card-grid cols-3" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <span className="stat-val">{realCount}</span>
          <span className="stat-lbl">Real Companies</span>
        </div>
        <div className="stat-card">
          <span className="stat-val">{pdfCount}</span>
          <span className="stat-lbl">PDFs Generated</span>
        </div>
        <div className="stat-card">
          <span className="stat-val">{pptxCount}</span>
          <span className="stat-lbl">PPTX Files</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={() => navigate('/generate')}>✨ Generate Document</button>
          <button className="btn secondary" onClick={() => navigate('/companies')}>🏢 Browse Companies</button>
          <button className="btn secondary" onClick={() => navigate('/outputs')}>📄 View Outputs</button>
        </div>
      </div>

      {/* Recent outputs */}
      {outputs.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Recent Outputs</h3>
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>File</th><th>Size</th><th>Action</th>
              </tr></thead>
              <tbody>
                {outputs.slice(0, 5).map(f => (
                  <tr key={f.filename}>
                    <td>{f.filename}</td>
                    <td>{f.size_kb} KB</td>
                    <td>
                      <a href={api.downloadUrl(f.filename)} target="_blank" rel="noreferrer"
                        className="btn secondary" style={{ padding: '5px 12px', fontSize: 12 }}>
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
