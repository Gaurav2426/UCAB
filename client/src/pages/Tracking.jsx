import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useRide } from '../context/RideContext'
import { Phone, MessageSquare, X, Star, Clock, Navigation } from 'lucide-react'
import './Tracking.css'

const cabMovingIcon = L.divIcon({
  className: 'tracking-cab-marker',
  html: '<div class="tracking-cab">🚗</div>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
})

const destIcon = L.divIcon({
  className: 'tracking-dest-marker',
  html: '<div class="tracking-dest">🏁</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

function AnimateMap({ position }) {
  const map = useMap()
  useEffect(() => {
    map.panTo(position, { animate: true, duration: 1 })
  }, [position, map])
  return null
}

export default function Tracking() {
  const location = useLocation()
  const navigate = useNavigate()
  const { completeRide } = useRide()
  const ride = location.state?.ride

  const [cabPos, setCabPos] = useState(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('arriving') // arriving | in-progress | completed

  useEffect(() => {
    if (!ride) return

    const startLat = ride.pickup.lat + (Math.random() - 0.5) * 0.01
    const startLng = ride.pickup.lng + (Math.random() - 0.5) * 0.01
    setCabPos([startLat, startLng])

    // Phase 1: Cab arrives to pickup (0-40% progress)
    // Phase 2: Cab travels to destination (40-100% progress)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1.5
      })
    }, 500)

    return () => clearInterval(interval)
  }, [ride])

  useEffect(() => {
    if (!ride) return

    if (progress < 40) {
      const t = progress / 40
      const startLat = ride.pickup.lat + 0.008
      const startLng = ride.pickup.lng - 0.005
      setCabPos([
        startLat + (ride.pickup.lat - startLat) * t,
        startLng + (ride.pickup.lng - startLng) * t,
      ])
      setStatus('arriving')
    } else if (progress < 100) {
      const t = (progress - 40) / 60
      setCabPos([
        ride.pickup.lat + (ride.dropoff.lat - ride.pickup.lat) * t,
        ride.pickup.lng + (ride.dropoff.lng - ride.pickup.lng) * t,
      ])
      setStatus('in-progress')
    } else {
      setCabPos([ride.dropoff.lat, ride.dropoff.lng])
      setStatus('completed')
    }
  }, [progress, ride])

  const handleComplete = async () => {
    if (ride?._id) {
      try {
        await completeRide(ride._id)
      } catch {}
    }
    navigate('/history')
  }

  if (!ride) {
    navigate('/')
    return null
  }

  const etaMin = status === 'arriving'
    ? Math.max(1, Math.round(ride.duration * 0.2 * (1 - progress / 40)))
    : Math.max(1, Math.round(ride.duration * (1 - (progress - 40) / 60)))

  return (
    <div className="tracking-page">
      {/* Map */}
      <div className="tracking-map">
        <MapContainer
          center={cabPos || [ride.pickup.lat, ride.pickup.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          {cabPos && (
            <>
              <AnimateMap position={cabPos} />
              <Marker position={cabPos} icon={cabMovingIcon} />
            </>
          )}
          <Marker position={[ride.dropoff.lat, ride.dropoff.lng]} icon={destIcon} />
          {cabPos && (
            <Polyline
              positions={[cabPos, [ride.dropoff.lat, ride.dropoff.lng]]}
              pathOptions={{ color: '#6366f1', weight: 3, dashArray: '8 6' }}
            />
          )}
        </MapContainer>
      </div>

      {/* Status panel */}
      <div className="tracking-panel animate-slide-up">
        <div className="tracking-status-bar">
          <div className={`status-badge ${status}`}>
            {status === 'arriving' && '🚗 Driver arriving'}
            {status === 'in-progress' && '🛣️ On the way'}
            {status === 'completed' && '✅ Arrived!'}
          </div>
          {status !== 'completed' && (
            <div className="eta-display">
              <Clock size={14} />
              <span>{etaMin} min</span>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="tracking-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Driver info */}
        <div className="driver-card glass">
          <div className="driver-avatar">{ride.driverName?.[0] || 'D'}</div>
          <div className="driver-info">
            <h4>{ride.driverName}</h4>
            <p>
              {ride.vehicleModel} • {ride.vehicleNumber}
            </p>
            <div className="driver-rating">
              <Star size={14} fill="var(--yellow)" stroke="var(--yellow)" />
              <span>{ride.driverRating}</span>
            </div>
          </div>
          <div className="driver-actions">
            <button className="action-btn">
              <Phone size={18} />
            </button>
            <button className="action-btn">
              <MessageSquare size={18} />
            </button>
          </div>
        </div>

        {/* Ride details */}
        <div className="ride-details-row">
          <div className="detail-item">
            <Navigation size={16} />
            <span>{ride.distance} km</span>
          </div>
          <div className="detail-item">
            <Clock size={16} />
            <span>{ride.duration} min</span>
          </div>
          <div className="detail-item fare-highlight">
            ₹{ride.fare}
          </div>
        </div>

        {status === 'completed' ? (
          <button className="btn btn-primary btn-full" onClick={handleComplete}>
            Done — View History
          </button>
        ) : (
          <button className="btn btn-danger btn-full" onClick={() => navigate('/')}>
            <X size={16} /> Cancel Ride
          </button>
        )}
      </div>
    </div>
  )
}
