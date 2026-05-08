import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../api/client'

const DELIVERABLE_OPTIONS = [
  { value: 'teaser',    label: 'Teaser (PDF — Gamma quality)',   desc: 'Sector-specific HTML → PDF via Chromium' },
  { value: 'one_pager', label: 'One Pager (PDF)',                desc: 'Dense single-page overview' },
  { value: 'pitchdeck', label: 'Pitch Deck (PPTX)',              desc: 'Editable PowerPoint via master template' },
]

const TEMPLATE_OPTIONS = [
  { value: '', label: 'Auto-select (recommended)' },
  { value: 'Premium_Tagged_Template.pptx', label: 'Premium Dark Template' },
  { value: 'Generalized_LLM_Teaser_Template.pptx', label: 'LLM Teaser Template' },
  { value: 'Generalized_LLM_Pitch_Deck_Template.pptx', label: 'LLM Pitch Deck Template' },
]

export default function Generate() {
  const location = useLocation()
  const prefill = location.state || {}

  const [companies, setCompanies] = useState([])
  const [profilePath, setProfilePath] = useState(prefill.profilePath || '')
  const [deliverable, setDeliverable] = useState('teaser')
  const [template, setTemplate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.companies().then(d => setCompanies(d.companies || []))
  }, [])

  async function handleGenerate() {
    if (!profilePath) { setError('Please select a company profile.'); return }
    setLoading(true); setResult(null); setError(null)
    try {
      const payload = {
        company_profile_path: profilePath,
        deliverable_type: deliverable,
        use_llm: true,
        export_formats: deliverable === 'pitchdeck' ? ['pptx'] : ['pdf'],
        master_template_path: template
          ? `C:\\Engines\\content_engine\\master_templates\\${template}`
          : null,
      }
      const res = await api.generate(payload)
      if (res.success) setResult(res)
      else setError(res.error || 'Generation failed.')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-hdr">
        <h2>Generate Document</h2>
        <p>Select a company and document type to generate an AI-written investment document</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left: Form */}
        <div className="card">
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18 }}>Configuration</h3>

          <div className="form-group">
            <label>Company Profile</label>
            <select value={profilePath} onChange={e => setProfilePath(e.target.value)}>
              <option value="">— Select a company —</option>
              {companies.map(c => (
                <option key={c.id} value={c.path}>
                  {c.is_fake ? '[TEST] ' : ''}{c.name} {c.sector ? `— ${c.sector}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Document Type</label>
            {DELIVERABLE_OPTIONS.map(opt => (
              <label key={opt.value} style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '10px 12px', border: `1px solid ${deliverable === opt.value ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8, cursor: 'pointer', marginBottom: 8, background: deliverable === opt.value ? 'var(--accent-l)' : 'var(--white)',
                fontWeight: 400 }}>
                <input type="radio" name="deliverable" value={opt.value}
                  checked={deliverable === opt.value} onChange={() => setDeliverable(opt.value)}
                  style={{ marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)' }}>{opt.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{opt.desc}</div>
                </div>
              </label>
            ))}
          </div>

          {deliverable === 'pitchdeck' && (
            <div className="form-group">
              <label>Master Template (PPTX)</label>
              <select value={template} onChange={e => setTemplate(e.target.value)}>
                {TEMPLATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          )}

          <button className="btn primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
            onClick={handleGenerate} disabled={loading}>
            {loading ? <><div className="spinner"></div> Generating...</> : '✨ Generate Now'}
          </button>
        </div>

        {/* Right: Result */}
        <div>
          {error && <div className="alert error">{error}</div>}
          {loading && (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <div className="spinner" style={{ margin: '0 auto 16px', width: 32, height: 32, borderWidth: 3 }}></div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Generating your document...</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                The LLM is writing banker-quality content.<br/>This takes 15–30 seconds.
              </div>
            </div>
          )}
          {result && (
            <div className="card">
              <div className="alert success" style={{ marginBottom: 16 }}>
                Document generated successfully!
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{result.company}</h3>
              {result.quality != null && (
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>Data Quality: </span>
                  <span style={{ fontWeight: 700, color: result.quality > 70 ? 'var(--green)' : 'var(--gold)' }}>
                    {result.quality}%
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Object.entries(result.outputs).map(([type, path]) => {
                  const filename = path.split('\\').pop().split('/').pop()
                  return (
                    <a key={type} href={api.downloadUrl(filename)} target="_blank" rel="noreferrer"
                      className="btn success" style={{ justifyContent: 'center' }}>
                      ⬇ Download {type.toUpperCase()} — {filename}
                    </a>
                  )
                })}
              </div>
              {result.warnings?.length > 0 && (
                <div style={{ marginTop: 14, padding: 12, background: 'var(--bg)', borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6 }}>Warnings:</div>
                  {result.warnings.map((w, i) => <div key={i} style={{ fontSize: 11.5, color: 'var(--muted)' }}>{w}</div>)}
                </div>
              )}
            </div>
          )}
          {!loading && !result && !error && (
            <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
              <div style={{ fontWeight: 600 }}>Ready to generate</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Select a company and click Generate Now</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
