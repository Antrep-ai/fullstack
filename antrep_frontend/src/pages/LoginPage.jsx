import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  {
    id: 'STARTUP',
    label: 'Startup',
    img: '/images/startup_illustration_1778152541273.png'
  },
  {
    id: 'INVESTOR',
    label: 'Investor',
    img: '/images/investor_illustration_1778152553839.png'
  },
  {
    id: 'INCUBATOR',
    label: 'Incubator',
    img: '/images/incubator_illustration_1778152567807.png'
  },
  {
    id: 'VC',
    label: 'Venture Capital',
    img: '/images/vc_illustration_1778152582616.png'
  }
]

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: err } = await signIn({ email, password })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/dashboard')
    }
  }

  if (selectedRole) {
    return (
      <div className="register-split">
        {/* LEFT */}
        <div className="register-left">
          <h2>Welcome!</h2>
          <p>Please login to access your account</p>
        </div>

        {/* RIGHT */}
        <div className="register-right">
          <h2>Login</h2>
          <h3>{selectedRole}</h3>
          {error && <div className="alert error">{error}</div>}
          <form onSubmit={handleLogin} className="register-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn primary" style={{ marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#1338BE', fontWeight: 600 }}>Register</Link>
          </p>
          <button onClick={() => setSelectedRole(null)} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: 13 }}>
            ← Back to role selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          <span className="navbar-logo-text">ANTREP</span>
        </Link>
        <div className="navbar-auth">
          <Link to="/register" className="btn primary" style={{ fontSize: 13, padding: '8px 18px' }}>Register</Link>
        </div>
      </nav>

      {/* Role selection */}
      <div className="role-select-page">
        <div className="role-select-header">
          <h1>Welcome to Antrep</h1>
          <p>Please login to access your account</p>
        </div>
        <div className="role-cards-row">
          {roles.map(role => (
            <div
              key={role.id}
              className="role-card"
              onClick={() => setSelectedRole(role.label)}
            >
              <div className="role-img-wrap">
                <img src={role.img} alt={role.label} />
              </div>
              <button className="role-btn">{role.label}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
