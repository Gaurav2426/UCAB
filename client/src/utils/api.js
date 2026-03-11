// In development, Vite proxy forwards /api to localhost:5000
// In production, we need the full Render URL
const API_BASE = import.meta.env.VITE_API_URL || ''

export default API_BASE
