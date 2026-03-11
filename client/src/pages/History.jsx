import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRide } from '../context/RideContext'
import { Clock, MapPin, ArrowRight, RefreshCw, Car } from 'lucide-react'
import './History.css'

const STATUS_MAP = {
  completed: { label: 'Completed', cls: 'badge-green' },
  cancelled: { label: 'Cancelled', cls: 'badge-red' },
  confirmed: { label: 'Confirmed', cls: 'badge-yellow' },
  'in-progress': { label: 'In Progress', cls: 'badge-yellow' },
  requested: { label: 'Requested', cls: 'badge-yellow' },
}

export default function History() {
  const { fetchHistory } = useRide()
  const navigate = useNavigate()
  const [rides, setRides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
      .then(setRides)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="history-page">
      <header className="page-header">
        <h1>Your Rides</h1>
        <p>{rides.length} trip{rides.length !== 1 ? 's' : ''}</p>
      </header>

      {loading ? (
        <div className="loading-center">
          <div className="loading-spinner" />
        </div>
      ) : rides.length === 0 ? (
        <div className="empty-state animate-fade">
          <Car size={48} />
          <h3>No rides yet</h3>
          <p>Book your first ride to see it here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Book a Ride
          </button>
        </div>
      ) : (
        <div className="rides-list">
          {rides.map((ride, i) => {
            const st = STATUS_MAP[ride.status] || STATUS_MAP.completed
            return (
              <div key={ride._id} className="ride-card glass animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="ride-card-top">
                  <span className="ride-date">{formatDate(ride.createdAt)}</span>
                  <span className={`badge ${st.cls}`}>{st.label}</span>
                </div>

                <div className="ride-route">
                  <div className="route-point">
                    <div className="loc-dot green" />
                    <span>{ride.pickup?.address}</span>
                  </div>
                  <div className="route-arrow"><ArrowRight size={14} /></div>
                  <div className="route-point">
                    <div className="loc-dot red" />
                    <span>{ride.dropoff?.address}</span>
                  </div>
                </div>

                <div className="ride-card-bottom">
                  <span className="ride-fare">₹{ride.fare}</span>
                  <span className="ride-meta">{ride.distance} km • {ride.duration} min</span>
                  <span className="ride-cab-type">{ride.cabType}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
