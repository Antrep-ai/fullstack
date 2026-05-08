import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const services = [
  {
    title: 'Pitch Deck Design',
    desc: 'Unlock personalized pitch deck designs by becoming a member today!',
    link: '#'
  },
  {
    title: 'Business & Financial Modelling',
    desc: (
      <>Unlock access to personalized Business and Financial Models by becoming a member today!</>
    ),
    link: '#',
    highlight: true
  },
  {
    title: 'Investor Connect',
    desc: 'Join our membership to connect with investors and unlock exciting opportunities for growth and collaboration.',
    link: '#'
  },
  {
    title: 'Incubator Connect',
    desc: 'Join our membership to connect with incubators and unlock exciting opportunities for growth and collaboration.',
    link: '#'
  },
  {
    title: 'Connect With VC',
    desc: "Join our membership to connect with VC's and unlock exciting opportunities for growth and collaboration.",
    link: '#'
  },
  {
    title: 'Connect with Mentor',
    desc: 'Join our membership today to get connected with a mentor and unlock valuable opportunities for growth and learning!',
    link: '#'
  }
]

export default function LandingPage() {
  const { user, signOut } = useAuth()

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">⚡</span>
          <span className="navbar-logo-text">ANTREP</span>
        </Link>
        <div className="navbar-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#services">Products</a>
          <a href="#services">Events</a>
          <a href="#services">Community</a>
          <a href="#services">Pricing</a>
          <a href="#services">Spotlight</a>
          <a href="#services">Contact</a>
        </div>
        <div className="navbar-auth">
          {user ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>{user.email}</span>
              <Link to="/dashboard" className="btn primary" style={{ fontSize: 13, padding: '8px 18px' }}>Dashboard</Link>
              <button onClick={signOut} className="btn secondary" style={{ fontSize: 13, padding: '8px 18px' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn secondary" style={{ fontSize: 13, padding: '8px 18px' }}>Login</Link>
              <Link to="/register" className="btn primary" style={{ fontSize: 13, padding: '8px 18px' }}>Signup</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-grid">
          <div className="hero-text">
            <h1>Startup Ecosystem Intelligence</h1>
            <p>
              Welcome to Antrep, bridging startups, incubators, investors, and venture capital firms
              to catalyze innovation and foster strategic partnerships.
            </p>
            {user ? (
              <Link to="/dashboard" className="btn-outline-blue">Go to Dashboard →</Link>
            ) : (
              <Link to="/login" className="btn-outline-blue">Login</Link>
            )}
          </div>
          <div className="hero-img-card">
            <img src="/images/hero_ecosystem.png" alt="Startup Ecosystem" />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="services-section">
        <h2>Services</h2>
        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className="service-card">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <a href={s.link} className="btn secondary" style={{ fontSize: 12.5, padding: '8px 20px' }}>
                Learn More
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ENGINES SECTION */}
      <section style={{ padding: '80px 80px', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0A1F5C' }}>Our AI Engine Suite</h2>
          <p style={{ fontSize: 15, color: '#64748B', marginTop: 10 }}>
            Three powerful engines working together to automate your investment workflow
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, maxWidth: 1000, margin: '0 auto' }}>
          {[
            { icon: '🗄️', title: 'Data Engine', desc: 'Automatically scrape and profile companies and investors with structured AI-generated data.', color: '#EEF2FF' },
            { icon: '🤝', title: 'Matching Engine', desc: 'Intelligent two-way matching between startups and investors using semantic embeddings.', color: '#F0FDF4' },
            { icon: '📄', title: 'Content Engine', desc: 'Generate professional pitch decks, teasers, and financial models using LLM agents.', color: '#FFF7ED' }
          ].map(e => (
            <div key={e.title} style={{ background: e.color, border: '1.5px solid #E2E8F0', borderRadius: 16, padding: '36px 28px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>{e.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A1F5C', marginBottom: 12 }}>{e.title}</h3>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7 }}>{e.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to={user ? '/dashboard' : '/login'} className="btn primary" style={{ padding: '14px 40px', fontSize: 15 }}>
            {user ? 'Go to Dashboard →' : 'Get Started →'}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A1F5C', color: 'rgba(255,255,255,0.6)', padding: '32px 80px', textAlign: 'center', fontSize: 13 }}>
        © 2026 ANTREP — Startup Ecosystem Intelligence Platform. All rights reserved.
      </footer>
    </div>
  )
}
