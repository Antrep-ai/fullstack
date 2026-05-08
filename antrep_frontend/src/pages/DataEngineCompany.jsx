import { useState } from 'react'
import { api } from '../api/client'

export default function DataEngineCompany() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sebiReg, setSebiReg] = useState('')
  const [pdfPath, setPdfPath] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)
    setResult(null)
    try {
      const res = await api.dataEngineCompany({ name, email, sebi_reg: sebiReg, pdf_path: pdfPath })
      if (!res.success) throw new Error(res.error || 'Failed to profile company')
      setResult(res)
      setStatus('success')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div>
      <div className="page-hdr">
        <h2>Company Profiler</h2>
        <p>Generate comprehensive profiles from the Data Engine</p>
      </div>
      
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Acme Corp" />
          </div>
          <div className="form-group">
            <label>Contact Email (Optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. founder@acme.com" />
          </div>
          <div className="form-group">
            <label>SEBI Registration No (Optional)</label>
            <input value={sebiReg} onChange={e => setSebiReg(e.target.value)} placeholder="e.g. INA000000000" />
          </div>
          <div className="form-group">
            <label>PDF Path (Optional)</label>
            <input value={pdfPath} onChange={e => setPdfPath(e.target.value)} placeholder="e.g. C:/path/to/deck.pdf" />
          </div>
          
          <button type="submit" className="btn primary mt-2" disabled={status === 'loading' || !name}>
            {status === 'loading' ? <><span className="spinner"></span> Scraping (1-3 min)...</> : 'Generate Profile'}
          </button>
        </form>

        {status === 'error' && <div className="alert error mt-4">{error}</div>}
        
        {status === 'success' && result && (
          <div className="alert success mt-4" style={{ overflow: 'hidden' }}>
            <strong>Success!</strong> Profile generated. UID: {result.uid}
            <pre className="mt-2 p-2" style={{ background: 'var(--bg)', borderRadius: '4px', fontSize: '11px', maxHeight: '300px', overflowY: 'auto' }}>
              {result.logs}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
