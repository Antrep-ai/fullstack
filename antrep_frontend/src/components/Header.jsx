import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '??'
  const role = user?.user_metadata?.role || 'USER'

  return (
    <header className="app-header">
      {user ? (
        <div className="user-profile">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-email">{user.email}</div>
          </div>
          <span className="user-role-tag">{role}</span>
          <button onClick={handleSignOut} className="logout-btn" title="Sign Out">
            ✕ Sign Out
          </button>
        </div>
      ) : (
        <div className="auth-buttons">
          <Link to="/login" className="btn secondary" style={{ fontSize: 13, padding: '7px 16px' }}>Login</Link>
          <Link to="/register" className="btn primary" style={{ fontSize: 13, padding: '7px 16px' }}>Register</Link>
        </div>
      )}
    </header>
  )
}
