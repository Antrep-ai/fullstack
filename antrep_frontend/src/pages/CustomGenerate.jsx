import { useState } from 'react'
import { api } from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function CustomGenerate() {
  const [companyName, setCompanyName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('pitchdeck')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const nav = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('generating')
    setError(null)
    try {
      const res = await api.customGenerate({
        company_name: companyName,
        description,
        deliverable_type: type
      })
      if (!res.success) throw new Error(res.error || 'Generation failed')
      setStatus('success')
      setTimeout(() => nav('/outputs'), 1000)
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  return (
    <div>
      <div className="page-hdr">
        <h2>Custom Pitchdeck Generation</h2>
        <p>Bypass the Data Engine. Enter a custom company description and instantly generate a pitch deck.</p>
      </div>

      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. NovaTech" />
          </div>
          
          <div className="form-group">
            <label>Description / Business Model *</label>
            <textarea 
              required 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              rows={8}
              style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13.5px', fontFamily: 'var(--font)', resize: 'vertical' }}
              placeholder="Provide a detailed description of the company, its products, target market, traction, and competitive advantage..."
            />
          </div>

          <div className="form-group">
            <label>Format</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="pitchdeck">Pitchdeck (PPTX)</option>
              <option value="teaser">Teaser (PDF)</option>
              <option value="one_pager">One Pager (PDF)</option>
            </select>
          </div>

          <button type="submit" className="btn primary mt-4" disabled={status === 'generating' || !companyName || !description}>
            {status === 'generating' ? <><span className="spinner"></span> Generating (1-2 min)...</> : 'Generate Content'}
          </button>
        </form>

        {status === 'error' && <div className="alert error mt-4">{error}</div>}
        {status === 'success' && <div className="alert success mt-4">Success! Redirecting to outputs...</div>}
      </div>
    </div>
  )
}
