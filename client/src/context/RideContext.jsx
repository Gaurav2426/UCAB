import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const RideContext = createContext(null)

export function RideProvider({ children }) {
  const { token } = useAuth()
  const [currentRide, setCurrentRide] = useState(null)
  const [nearbyCabs, setNearbyCabs] = useState([])

  const fetchNearbyCabs = async (lat, lng) => {
    try {
      const res = await fetch(`/api/cabs/nearby?lat=${lat}&lng=${lng}`)
      const data = await res.json()
      setNearbyCabs(data)
      return data
    } catch {
      return []
    }
  }

  const getEstimates = async (pickupLat, pickupLng, dropLat, dropLng) => {
    const res = await fetch(
      `/api/cabs/estimate?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropLat=${dropLat}&dropLng=${dropLng}`
    )
    return res.json()
  }

  const bookRide = async (rideData) => {
    const res = await fetch('/api/rides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rideData),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    setCurrentRide(data)
    return data
  }

  const cancelRide = async (rideId) => {
    const res = await fetch(`/api/rides/${rideId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setCurrentRide(null)
    return data
  }

  const completeRide = async (rideId) => {
    const res = await fetch(`/api/rides/${rideId}/complete`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    setCurrentRide(null)
    return data
  }

  const fetchHistory = async () => {
    const res = await fetch('/api/rides', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.json()
  }

  return (
    <RideContext.Provider
      value={{
        currentRide,
        setCurrentRide,
        nearbyCabs,
        fetchNearbyCabs,
        getEstimates,
        bookRide,
        cancelRide,
        completeRide,
        fetchHistory,
      }}
    >
      {children}
    </RideContext.Provider>
  )
}

export function useRide() {
  const ctx = useContext(RideContext)
  if (!ctx) throw new Error('useRide must be used within RideProvider')
  return ctx
}
