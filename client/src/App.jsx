import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RideProvider } from './context/RideContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Booking from './pages/Booking'
import Tracking from './pages/Tracking'
import History from './pages/History'
import Profile from './pages/Profile'
import Offers from './pages/Offers'
import Refreshments from './pages/Refreshments'
import Payment from './pages/Payment'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RideProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected — inside Layout shell */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/refreshments" element={<Refreshments />} />
              <Route path="/payment" element={<Payment />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </RideProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
