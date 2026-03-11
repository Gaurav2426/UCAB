import { createContext, useContext, useState, useEffect } from 'react'
import API_BASE from '../utils/api'

const AuthContext = createContext(null)

const API = `${API_BASE}/api/auth`

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('ucab_token'))
  const [loading, setLoading] = useState(true)

  // On mount, verify stored token
  useEffect(() => {
    if (token) {
      fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('ucab_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')
    localStorage.setItem('ucab_token', data.token)
    setToken(data.token)
    setUser({ _id: data._id, name: data.name, email: data.email, phone: data.phone })
    return data
  }

  const register = async (name, email, phone, password) => {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed')
    localStorage.setItem('ucab_token', data.token)
    setToken(data.token)
    setUser({ _id: data._id, name: data.name, email: data.email, phone: data.phone })
    return data
  }

  const logout = () => {
    localStorage.removeItem('ucab_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
