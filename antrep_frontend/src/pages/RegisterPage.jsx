import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const roles = [
  { id: 'STARTUP', label: 'Startup', img: '/images/startup_illustration_1778152541273.png' },
  { id: 'INVESTOR', label: 'Investor', img: '/images/investor_illustration_1778152553839.png' },
  { id: 'INCUBATOR', label: 'Incubator', img: '/images/incubator_illustration_1778152567807.png' },
  { id: 'VC', label: 'Venture Capital', img: '/images/vc_illustration_1778152582616.png' }
]

/* ---------- Role-specific field configs ---------- */
const roleFields = {
  STARTUP: {
    title: 'Startup',
    fields: [
      { name: 'startupName', placeholder: 'Name of Startup', type: 'text', required: true },
      { name: 'founderName', placeholder: 'Founder Name', type: 'text', required: true },
      { name: 'coFounderName', placeholder: 'Co-Founder Name', type: 'text' },
      { name: 'mobile', placeholder: 'Mobile Number', type: 'tel', required: true },
      { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
      { name: 'password', placeholder: 'Password (min 6 chars)', type: 'password', required: true },
      { name: 'username', placeholder: 'Username', type: 'text', required: true },
      { name: 'startupStage', placeholder: 'Startup Stage', type: 'select', required: true,
        options: ['Idea Stage', 'MVP Stage', 'Early Revenue', 'Growth Stage', 'Funded', 'Scaling'] },
      { name: 'foundedDate', placeholder: 'Founded Date', type: 'date' },
      { name: 'totalRevenue', placeholder: 'Total Revenue', type: 'text' },
      { name: 'fundsRaised', placeholder: 'Funds Raised', type: 'text' },
      { name: 'address', placeholder: 'Address', type: 'text' },
      { name: 'country', placeholder: 'Choose a Country', type: 'select',
        options: ['India', 'USA', 'UK', 'Singapore', 'UAE', 'Other'] }
    ]
  },
  INVESTOR: {
    title: 'Investor',
    fields: [
      { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
      { name: 'password', placeholder: 'Password (min 6 chars)', type: 'password', required: true },
      { name: 'mobile', placeholder: 'Mobile Number', type: 'tel', required: true },
      { name: 'firstName', placeholder: 'First Name', type: 'text', required: true },
      { name: 'lastName', placeholder: 'Last Name', type: 'text', required: true },
      { name: 'username', placeholder: 'Username', type: 'text', required: true },
      { name: 'numberOfInvestmentsRange', placeholder: 'Number of Investments', type: 'select',
        options: ['1 to 5', '6 to 10', '11 to 50', '51 to 100', '100+'] },
      { name: 'country', placeholder: 'Choose a Country', type: 'select',
        options: ['India', 'USA', 'UK', 'Singapore', 'UAE', 'Other'] }
    ]
  },
  INCUBATOR: {
    title: 'Incubator',
    fields: [
      { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
      { name: 'password', placeholder: 'Password (min 6 chars)', type: 'password', required: true },
      { name: 'firstName', placeholder: 'First Name', type: 'text', required: true },
      { name: 'lastName', placeholder: 'Last Name', type: 'text', required: true },
      { name: 'mobile', placeholder: 'Mobile Number', type: 'tel' },
      { name: 'username', placeholder: 'Username', type: 'text', required: true },
      { name: 'placeOfIncubator', placeholder: 'Place / City of Incubator', type: 'text', required: true },
      { name: 'startupsIncubatedCount', placeholder: 'Number of Startups Incubated', type: 'text' },
      { name: 'country', placeholder: 'Choose a Country', type: 'select',
        options: ['India', 'USA', 'UK', 'Singapore', 'UAE', 'Other'] }
    ]
  },
  VC: {
    title: 'Venture Capital',
    fields: [
      { name: 'email', placeholder: 'Email Address', type: 'email', required: true },
      { name: 'password', placeholder: 'Password (min 6 chars)', type: 'password', required: true },
      { name: 'firstName', placeholder: 'First Name', type: 'text', required: true },
      { name: 'lastName', placeholder: 'Last Name', type: 'text', required: true },
      { name: 'mobile', placeholder: 'Mobile Number', type: 'tel' },
      { name: 'username', placeholder: 'Username', type: 'text', required: true },
      { name: 'numberOfInvestmentsRange', placeholder: 'Number of Investments', type: 'select',
        options: ['1 to 5', '6 to 10', '11 to 50', '51 to 100', '100+'] },
      { name: 'country', placeholder: 'Country / HQ', type: 'select',
        options: ['India', 'USA', 'UK', 'Singapore', 'UAE', 'Other'] }
    ]
  }
}

function RenderField({ field, value, onChange }) {
  if (field.type === 'select') {
    return (
      <select name={field.name} value={value} onChange={onChange} required={field.required}>
        <option value="">{field.placeholder}</option>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    )
  }
  return (
    <input
      type={field.type}
      name={field.name}
      placeholder={field.placeholder}
      value={value}
      onChange={onChange}
      required={field.required}
      minLength={field.type === 'password' ? 6 : undefined}
    />
  )
}

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { email, password, ...meta } = formData
    const { error: err, data } = await signUp({
      email,
      password,
      options: {
        data: { role: selectedRole, ...meta }
      }
    })
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      if (data?.session) {
        navigate('/dashboard')
      } else {
        setSuccess(true)
      }
    }
  }

  /* --- Role selection screen --- */
  if (!selectedRole) {
    return (
      <div>
        <nav className="navbar">
          <Link to="/" className="navbar-logo">
            <span className="navbar-logo-icon">⚡</span>
            <span className="navbar-logo-text">ANTREP</span>
          </Link>
          <div className="navbar-auth">
            <Link to="/login" className="btn secondary" style={{ fontSize: 13, padding: '8px 18px' }}>Login</Link>
          </div>
        </nav>

        <div className="role-select-page">
          <div className="role-select-header">
            <h1>Welcome to Antrep</h1>
            <p>Please register to access your account</p>
          </div>
          <div className="role-cards-row">
            {roles.map(role => (
              <div
                key={role.id}
                className="role-card"
                onClick={() => { setSelectedRole(role.id); setFormData({}) }}
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

  /* --- Role form screen --- */
  const config = roleFields[selectedRole]

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div className="card" style={{ maxWidth: 440, textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0A1F5C' }}>Check your email!</h2>
          <p style={{ color: '#64748B', marginTop: 12, lineHeight: 1.7 }}>
            We sent a confirmation link to <strong>{formData.email}</strong>. Click the link to verify your account and then log in.
          </p>
          <Link to="/login" className="btn primary" style={{ marginTop: 28, display: 'inline-block' }}>Go to Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="register-split">
      {/* LEFT */}
      <div className="register-left">
        <h2>Welcome!</h2>
        <p>Please register to access your account</p>
      </div>

      {/* RIGHT */}
      <div className="register-right">
        <h2>Register</h2>
        <h3>{config.title}</h3>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          {config.fields.map(field => (
            <RenderField
              key={field.name}
              field={field}
              value={formData[field.name] || ''}
              onChange={handleChange}
            />
          ))}
          <button type="submit" className="btn primary" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#64748B' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1338BE', fontWeight: 600 }}>Login</Link>
        </p>
        <button
          onClick={() => setSelectedRole(null)}
          style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}
        >
          ← Back to role selection
        </button>
      </div>
    </div>
  )
}
