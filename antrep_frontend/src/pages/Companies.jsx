import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

const SECTOR_COLORS = {
  'Financial Services': 'blue', 'NBFC': 'blue',
  'Renewables': 'green', 'Manufacturing': 'gold',
  'Technology': 'blue', 'Healthcare': 'green',
}

export default function Companies() {
  const [companies, setCompanies] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.companies().then(d => { setCompanies(d.companies || []); setLoading(false) })
  }, [])

  const filtered = companies.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.sector?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="page-hdr">
        <h2>Companies</h2>
        <p>All company profiles from the Data Engine</p>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input placeholder="Search by name or sector..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <button className="btn primary" onClick={() => navigate('/generate')}>
          ✨ Generate Document
        </button>
      </div>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--muted)' }}>
          <div className="spinner"></div> Loading companies...
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr>
                <th>Company</th><th>Sector</th><th>Type</th><th>Data Quality</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.id.slice(0, 8)}...</div>
                    </td>
                    <td>
                      <span className={`badge ${SECTOR_COLORS[c.sector] || 'gray'}`}>
                        {c.sector || '—'}
                      </span>
                    </td>
                    <td>
                      {c.is_fake
                        ? <span className="badge gold">Test Profile</span>
                        : <span className="badge green">Real Company</span>}
                    </td>
                    <td>
                      {c.data_quality?.auto_scraped != null
                        ? <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                            {c.data_quality.auto_scraped} fields scraped
                            {c.data_quality.banker_input_needed &&
                              <span className="badge red" style={{ marginLeft: 6 }}>Needs Input</span>}
                          </span>
                        : <span style={{ color: 'var(--muted)', fontSize: 12 }}>—</span>}
                    </td>
                    <td>
                      <button className="btn primary" style={{ padding: '6px 14px', fontSize: 12 }}
                        onClick={() => navigate('/generate', { state: { profilePath: c.path, companyName: c.name } })}>
                        Generate
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>
                    No companies found
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
