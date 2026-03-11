import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useAuth } from '../context/AuthContext'
import { useRide } from '../context/RideContext'
import { Search, MapPin, Navigation, Briefcase, Home as HomeIcon, Plane } from 'lucide-react'
import './Home.css'

// Custom cab marker icon
const cabIcon = (type) =>
  L.divIcon({
    className: 'cab-marker',
    html: `<div class="cab-dot ${type}">🚗</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })

const userIcon = L.divIcon({
  className: 'user-marker',
  html: '<div class="user-dot"><div class="user-pulse"></div></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

// Component to recenter map
function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 14, { animate: true })
  }, [lat, lng, map])
  return null
}

export default function Home() {
  const { user } = useAuth()
  const { nearbyCabs, fetchNearbyCabs } = useRide()
  const navigate = useNavigate()
  const [userPos, setUserPos] = useState({ lat: 28.6139, lng: 77.209 }) // Default: Delhi
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const inputRef = useRef(null)

  // Get user location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => {} // silently fall back to default
    )
  }, [])

  // Fetch nearby cabs
  useEffect(() => {
    fetchNearbyCabs(userPos.lat, userPos.lng)
    const interval = setInterval(() => fetchNearbyCabs(userPos.lat, userPos.lng), 15000)
    return () => clearInterval(interval)
  }, [userPos.lat, userPos.lng])

  const handleSearch = () => {
    setSheetOpen(true)
    setTimeout(() => inputRef.current?.focus(), 200)
  }

  const handleGo = () => {
    if (!dropoff.trim()) return
    navigate('/booking', {
      state: {
        pickup: pickup || 'Current Location',
        dropoff,
        pickupLat: userPos.lat,
        pickupLng: userPos.lng,
        // Simulate a drop-off ~5-10km away
        dropLat: userPos.lat + (Math.random() - 0.3) * 0.06,
        dropLng: userPos.lng + (Math.random() - 0.3) * 0.06,
      },
    })
  }

  const quickDestinations = [
    { icon: <HomeIcon size={16} />, label: 'Home', address: 'Home Address' },
    { icon: <Briefcase size={16} />, label: 'Work', address: 'Office' },
    { icon: <Plane size={16} />, label: 'Airport', address: 'Airport Terminal 3' },
  ]

  return (
    <div className="home-page">
      {/* Map */}
      <div className="home-map">
        <MapContainer
          center={[userPos.lat, userPos.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <RecenterMap lat={userPos.lat} lng={userPos.lng} />

          {/* User Position */}
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>

          {/* Nearby Cabs */}
          {nearbyCabs.map((cab) => (
            <Marker key={cab.id} position={[cab.lat, cab.lng]} icon={cabIcon(cab.type)}>
              <Popup>
                <strong>{cab.name}</strong>
                <br />
                ETA: {cab.eta} min • ⭐ {cab.rating}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Greeting bar */}
      <div className="home-greeting glass animate-slide-down">
        <p className="greeting-text">
          Hello, <strong>{user?.name?.split(' ')[0] || 'there'}</strong> 👋
        </p>
        <div className="cab-count badge badge-green">
          {nearbyCabs.length} cabs nearby
        </div>
      </div>

      {/* Search bar (floating) */}
      <div className="home-search-bar glass animate-slide-up" onClick={handleSearch}>
        <Search size={20} className="search-icon" />
        <span>Where to?</span>
        <Navigation size={18} className="nav-icon" />
      </div>

      {/* Bottom Sheet */}
      {sheetOpen && (
        <div className="sheet-overlay" onClick={() => setSheetOpen(false)}>
          <div className="bottom-sheet glass animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h3>Plan your ride</h3>

            <div className="location-inputs">
              <div className="loc-input-row">
                <div className="loc-dot green" />
                <input
                  placeholder="Pickup location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                />
              </div>
              <div className="loc-divider" />
              <div className="loc-input-row">
                <div className="loc-dot red" />
                <input
                  ref={inputRef}
                  placeholder="Where are you going?"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGo()}
                />
              </div>
            </div>

            <div className="quick-dests">
              {quickDestinations.map((d) => (
                <button
                  key={d.label}
                  className="quick-dest-chip"
                  onClick={() => {
                    setDropoff(d.address)
                    handleGo()
                  }}
                >
                  {d.icon}
                  <span>{d.label}</span>
                </button>
              ))}
            </div>

            <button className="btn btn-primary btn-full" onClick={handleGo}>
              <MapPin size={18} />
              Find Rides
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
