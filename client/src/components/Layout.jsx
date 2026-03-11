import { Outlet, NavLink, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, Clock, Tag, User, LogOut } from 'lucide-react'
import './Layout.css'

export default function Layout() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p>Loading Ucab…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="layout">
      <div className="layout-content">
        <Outlet />
      </div>

      <nav className="bottom-nav glass">
        <NavLink to="/" className="nav-item" end>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/history" className="nav-item">
          <Clock size={20} />
          <span>History</span>
        </NavLink>
        <NavLink to="/offers" className="nav-item">
          <Tag size={20} />
          <span>Offers</span>
        </NavLink>
        <NavLink to="/profile" className="nav-item">
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  )
}
