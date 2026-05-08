import { useState } from 'react'
import { api } from '../api/client'

export default function DataEngineInvestor() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sebiReg, setSebiReg] = useState('')
  const [status, setStatus] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setError(null)
    setResult(null)
    try {
      const res = await api.dataEngineInvestor({ name, email, sebi_reg: sebiReg })
      if (!res.success) throw new Error(res.error || 'Failed to profile investor')
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
        <h2>Investor Profiler</h2>
        <p>Generate comprehensive investor profiles from the Data Engine</p>
      </div>
      
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Investor Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sequoia Capital" />
          </div>
          <div className="form-group">
            <label>Contact Email (Optional)</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="e.g. partner@sequoia.com" />
          </div>
          <div className="form-group">
            <label>SEBI Registration No (Optional)</label>
            <input value={sebiReg} onChange={e => setSebiReg(e.target.value)} placeholder="e.g. INA000000000" />
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
