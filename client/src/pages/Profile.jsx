import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, LogOut, CreditCard, Shield, Bell, ChevronRight } from 'lucide-react'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: <CreditCard size={20} />, label: 'Payment', desc: 'Manage payment options', link: '/payment' },
    { icon: <Bell size={20} />, label: 'Notifications', desc: 'Ride alerts & updates', link: null },
    { icon: <Shield size={20} />, label: 'Safety', desc: 'Emergency contacts & SOS', link: null },
  ]

  return (
    <div className="profile-page">
      <header className="page-header">
        <h1>Profile</h1>
      </header>

      {/* User card */}
      <div className="profile-card glass animate-slide-up">
        <div className="profile-avatar">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h2>{user?.name}</h2>
          <div className="profile-detail">
            <Mail size={14} /> <span>{user?.email}</span>
          </div>
          {user?.phone && (
            <div className="profile-detail">
              <Phone size={14} /> <span>{user?.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="profile-menu">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className="menu-item glass"
            onClick={() => item.link && navigate(item.link)}
            style={{ cursor: item.link ? 'pointer' : 'default' }}
          >
            <div className="menu-icon">{item.icon}</div>
            <div className="menu-text">
              <span className="menu-label">{item.label}</span>
              <span className="menu-desc">{item.desc}</span>
            </div>
            {item.link && <ChevronRight size={18} className="menu-chevron" />}
          </div>
        ))}
      </div>

      <button className="btn btn-danger btn-full logout-btn" onClick={handleLogout}>
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  )
}
