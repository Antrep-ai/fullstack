import React, { useState, useEffect } from 'react'
import { api } from '../api/client'

export default function MatchDashboard() {
  const [status, setStatus] = useState('idle') // sync, match, error
  const [error, setError] = useState(null)
  const [logs, setLogs] = useState(null)
  const [results, setResults] = useState([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [expandedRow, setExpandedRow] = useState(null)
  
  // Specific Match States
  const [specificStartup, setSpecificStartup] = useState('')
  const [specificInvestor, setSpecificInvestor] = useState('')
  const [specificMatchResult, setSpecificMatchResult] = useState(null)
  const [specificStatus, setSpecificStatus] = useState('idle')

  const fetchResults = async () => {
    setLoadingResults(true)
    try {
      const res = await api.matchingEngineResults()
      setResults(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingResults(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const handleSync = async () => {
    setStatus('sync')
    setError(null)
    setLogs(null)
    try {
      const res = await api.matchingEngineSync()
      if (!res.success) throw new Error(res.error || 'Failed to sync')
      setLogs(res.logs)
      setStatus('idle')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const handleRunMatch = async () => {
    setStatus('match')
    setError(null)
    setLogs(null)
    try {
      const res = await api.matchingEngineRun()
      if (!res.success) throw new Error(res.error || 'Failed to run matcher')
      setLogs(res.logs)
      setStatus('idle')
      fetchResults()
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  const handleSpecificMatch = async (e) => {
    e.preventDefault()
    setSpecificStatus('loading')
    setError(null)
    setSpecificMatchResult(null)
    try {
      const res = await api.matchingEngineScoreSpecific({
        startup_name: specificStartup,
        investor_name: specificInvestor
      })
      if (!res.success) throw new Error(res.error || 'Failed to score match')
      setSpecificMatchResult(res.match)
      setSpecificStatus('idle')
    } catch (err) {
      setError(err.message)
      setSpecificStatus('error')
    }
  }

  return (
    <div>
      <div className="page-hdr">
        <h2>Match Dashboard</h2>
        <p>Trigger two-way matching and view best investor matches for companies</p>
      </div>

      <div className="card-grid cols-2 mb-4">
        <div className="card">
          <h3 className="mb-2" style={{ fontSize: '16px' }}>1. Sync Profiles</h3>
          <p className="mb-4" style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Convert the generated JSON profiles from the Data Engine into CSV files required by the Matching Engine.
          </p>
          <button className="btn secondary" onClick={handleSync} disabled={status !== 'idle'}>
            {status === 'sync' ? <><span className="spinner"></span> Syncing...</> : 'Sync to CSV'}
          </button>
        </div>
        <div className="card">
          <h3 className="mb-2" style={{ fontSize: '16px' }}>2. Run Matcher</h3>
          <p className="mb-4" style={{ fontSize: '13px', color: 'var(--muted)' }}>
            Execute the two-way semantic matching process. This computes the similarities and generates LLM justifications.
          </p>
          <button className="btn primary" onClick={handleRunMatch} disabled={status !== 'idle'}>
            {status === 'match' ? <><span className="spinner"></span> Matching...</> : 'Run Matching Engine'}
          </button>
        </div>
      </div>

      {status === 'error' && <div className="alert error mb-4">{error}</div>}
      
      {logs && (
        <div className="card mb-4">
          <h4>Execution Logs</h4>
          <pre className="mt-2 p-2" style={{ background: 'var(--bg)', borderRadius: '4px', fontSize: '11px', maxHeight: '150px', overflowY: 'auto' }}>
            {logs}
          </pre>
        </div>
      )}

      <div className="card mb-4">
        <h3 className="mb-2" style={{ fontSize: '16px' }}>3. Specific 1-to-1 Match</h3>
        <p className="mb-4" style={{ fontSize: '13px', color: 'var(--muted)' }}>
          Score a specific Company against a specific Investor without running the full database match.
        </p>
        <form onSubmit={handleSpecificMatch} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Company Name</label>
            <input required value={specificStartup} onChange={e => setSpecificStartup(e.target.value)} placeholder="e.g. Apex" />
          </div>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label>Investor Name</label>
            <input required value={specificInvestor} onChange={e => setSpecificInvestor(e.target.value)} placeholder="e.g. Sequoia" />
          </div>
          <button type="submit" className="btn primary" disabled={specificStatus === 'loading' || !specificStartup || !specificInvestor}>
            {specificStatus === 'loading' ? <><span className="spinner"></span> Scoring...</> : 'Score Match'}
          </button>
        </form>

        {specificStatus === 'error' && <div className="alert error mt-4">{error}</div>}
        
        {specificMatchResult && (
          <div className="mt-4 p-2" style={{ background: 'var(--bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '14px' }}>Match Score: {specificMatchResult.startup} ↔ {specificMatchResult.investor}</h4>
              <span className={`badge ${specificMatchResult.final_score >= 80 ? 'green' : specificMatchResult.final_score >= 50 ? 'gold' : 'gray'}`}>
                {specificMatchResult.final_score} / 100
              </span>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
              <div style={{ flex: 1 }}>
                <h5 style={{ marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>LLM Justification</h5>
                <p style={{ fontSize: '13px', lineHeight: 1.5 }}>{specificMatchResult.justification}</p>
              </div>
              <div style={{ width: '200px' }}>
                <h5 style={{ marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Score Breakdown</h5>
                <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Rule Score:</span> <strong>{specificMatchResult.rule_score}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Semantic Score:</span> <strong>{specificMatchResult.semantic_score}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="mb-4" style={{ fontSize: '16px' }}>Database Matching Results</h3>
        {loadingResults ? (
          <div>Loading results...</div>
        ) : results.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: '13px' }}>No matches found. Run the matcher to generate results.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Best Investor Match</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map((match, idx) => (
                  <React.Fragment key={idx}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}>
                      <td><strong>{match.company_name || match.startup_name}</strong></td>
                      <td>{match.investor_name}</td>
                      <td>
                        <span className={`badge ${match.final_score >= 80 ? 'green' : match.final_score >= 50 ? 'gold' : 'gray'}`}>
                          {Math.round(match.final_score)}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px' }}>{expandedRow === idx ? '▼ Less' : '▶ More'}</span>
                      </td>
                    </tr>
                    {expandedRow === idx && (
                      <tr style={{ background: 'var(--bg)' }}>
                        <td colSpan="4" style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '24px' }}>
                            <div style={{ flex: 1 }}>
                              <h5 style={{ marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>LLM Justification</h5>
                              <p style={{ fontSize: '13px', lineHeight: 1.5 }}>{match.justification}</p>
                            </div>
                            <div style={{ width: '250px' }}>
                              <h5 style={{ marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', color: 'var(--muted)' }}>Score Breakdown</h5>
                              <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Semantic Match:</span> <strong>{Math.round(match.semantic_score)}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                  <span>Rule Match:</span> <strong>{Math.round(match.rule_score)}</strong>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
