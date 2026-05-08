import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { api } from './api/client'
import { useAuth } from './context/AuthContext'
import Header from './components/Header'

// Public pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// App pages
import Dashboard from './pages/Dashboard'
import Companies from './pages/Companies'
import Generate from './pages/Generate'
import Outputs from './pages/Outputs'
import DataEngineCompany from './pages/DataEngineCompany'
import DataEngineInvestor from './pages/DataEngineInvestor'
import MatchDashboard from './pages/MatchDashboard'
import CustomGenerate from './pages/CustomGenerate'

function Sidebar({ status }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>ANTREP</h1>
        <span>Unified Platform</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">⚡</span> Dashboard
        </NavLink>

        <div className="nav-section">🗄️ Stage 1: Data Engine</div>
        <NavLink to="/data-engine/company" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🏢</span> Company Profiler
        </NavLink>
        <NavLink to="/data-engine/investor" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🏦</span> Investor Profiler
        </NavLink>

        <div className="nav-section">🤝 Stage 2: Matching Engine</div>
        <NavLink to="/match-dashboard" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">🎯</span> Match Dashboard
        </NavLink>

        <div className="nav-section">📄 Stage 3: Content Engine</div>
        <NavLink to="/companies" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📑</span> Existing Profiles
        </NavLink>
        <NavLink to="/generate" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">✨</span> Auto Generate
        </NavLink>
        <NavLink to="/custom-generate" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📝</span> Custom Generate
        </NavLink>
        <NavLink to="/outputs" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon">📄</span> Outputs
        </NavLink>
      </nav>
      <div className="sidebar-status">
        <div className="status-line">
          <span className={`status-dot ${status?.api === 'ok' ? 'ok' : 'err'}`}></span>
          API Server
        </div>
        <div className="status-line">
          <span className={`status-dot ${status?.data_engine_ok ? 'ok' : 'err'}`}></span>
          Data Engine
        </div>
        <div className="status-line">
          <span className={`status-dot ${status?.output_ok ? 'ok' : 'err'}`}></span>
          Output Directory
        </div>
      </div>
    </aside>
  )
}

// App dashboard layout (logged-in)
function AppShell({ status }) {
  return (
    <div className="layout">
      <Sidebar status={status} />
      <main className="main-content">
        <Header />
        <div className="page-body">
          <Routes>
            <Route path="/dashboard" element={<Dashboard status={status} />} />
            <Route path="/data-engine/company" element={<DataEngineCompany />} />
            <Route path="/data-engine/investor" element={<DataEngineInvestor />} />
            <Route path="/match-dashboard" element={<MatchDashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/custom-generate" element={<CustomGenerate />} />
            <Route path="/outputs" element={<Outputs />} />
            {/* Redirect old "/" to dashboard when logged in */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const [status, setStatus] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    api.status().then(setStatus).catch(() => setStatus({ api: 'err' }))
  }, [])

  return (
    <Routes>
      {/* Always-public landing page */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth pages — redirect to dashboard if already logged in */}
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
      />

      {/* Protected app routes — redirect to login if not logged in */}
      <Route
        path="/*"
        element={user ? <AppShell status={status} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  )
}
