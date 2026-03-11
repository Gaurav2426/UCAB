import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { useRide } from '../context/RideContext'
import { MapPin, Clock, Users, ChevronRight, Zap } from 'lucide-react'
import './Booking.css'

const pickupIcon = L.divIcon({
  className: 'booking-marker',
  html: '<div class="bm-dot green-dot">📍</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

const dropoffIcon = L.divIcon({
  className: 'booking-marker',
  html: '<div class="bm-dot red-dot">🏁</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
})

export default function Booking() {
  const location = useLocation()
  const navigate = useNavigate()
  const { getEstimates, bookRide } = useRide()
  const [estimates, setEstimates] = useState([])
  const [selected, setSelected] = useState(null)
  const [booking, setBooking] = useState(false)

  const { pickup, dropoff, pickupLat, pickupLng, dropLat, dropLng } = location.state || {}

  useEffect(() => {
    if (pickupLat && dropLat) {
      getEstimates(pickupLat, pickupLng, dropLat, dropLng).then((data) => {
        setEstimates(data)
        if (data.length) setSelected(data[0].type)
      })
    }
  }, [pickupLat, pickupLng, dropLat, dropLng])

  const selectedCab = estimates.find((e) => e.type === selected)

  const handleBook = async () => {
    if (!selectedCab) return
    setBooking(true)
    try {
      const ride = await bookRide({
        pickup: { address: pickup, lat: pickupLat, lng: pickupLng },
        dropoff: { address: dropoff, lat: dropLat, lng: dropLng },
        cabType: selectedCab.type,
        fare: selectedCab.fare,
        distance: selectedCab.distance,
        duration: selectedCab.duration,
      })
      navigate('/tracking', { state: { ride } })
    } catch (err) {
      alert(err.message)
      setBooking(false)
    }
  }

  if (!pickupLat) {
    navigate('/')
    return null
  }

  const routePath = [
    [pickupLat, pickupLng],
    [pickupLat + (dropLat - pickupLat) * 0.3, pickupLng + (dropLng - pickupLng) * 0.5 + 0.003],
    [pickupLat + (dropLat - pickupLat) * 0.7, pickupLng + (dropLng - pickupLng) * 0.6 - 0.002],
    [dropLat, dropLng],
  ]

  return (
    <div className="booking-page">
      {/* Route map */}
      <div className="booking-map">
        <MapContainer
          bounds={[
            [pickupLat, pickupLng],
            [dropLat, dropLng],
          ]}
          boundsOptions={{ padding: [60, 60] }}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          <Marker position={[pickupLat, pickupLng]} icon={pickupIcon} />
          <Marker position={[dropLat, dropLng]} icon={dropoffIcon} />
          <Polyline
            positions={routePath}
            pathOptions={{ color: '#6366f1', weight: 4, opacity: 0.8, dashArray: '10 6' }}
          />
        </MapContainer>
      </div>

      {/* Route summary */}
      <div className="booking-panel animate-slide-up">
        <div className="route-summary">
          <div className="route-point">
            <div className="loc-dot green" />
            <span>{pickup || 'Current Location'}</span>
          </div>
          <div className="route-line-v" />
          <div className="route-point">
            <div className="loc-dot red" />
            <span>{dropoff}</span>
          </div>
        </div>

        {/* Cab options */}
        <h3 className="panel-title">Choose your ride</h3>
        <div className="cab-list">
          {estimates.map((cab) => (
            <div
              key={cab.type}
              className={`cab-card glass ${selected === cab.type ? 'selected' : ''}`}
              onClick={() => setSelected(cab.type)}
            >
              <div className="cab-card-icon">{cab.icon}</div>
              <div className="cab-card-info">
                <div className="cab-card-name">
                  {cab.name}
                  {cab.type === 'economy' && <span className="popular-tag">Popular</span>}
                </div>
                <div className="cab-card-meta">
                  <Users size={14} /> {cab.capacity} • <Clock size={14} /> {cab.eta} min
                </div>
              </div>
              <div className="cab-card-fare">
                <span className="fare-amount">₹{cab.fare}</span>
                <span className="fare-dist">{cab.distance} km</span>
              </div>
            </div>
          ))}
        </div>

        {/* Book button */}
        {selectedCab && (
          <button className="btn btn-primary btn-full book-btn" onClick={handleBook} disabled={booking}>
            {booking ? (
              'Finding driver…'
            ) : (
              <>
                Book {selectedCab.name} — ₹{selectedCab.fare}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
