import { useState } from 'react'
import { ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './Refreshments.css'

const ITEMS = [
  { id: 1, name: 'Water Bottle', price: 20, emoji: '💧', category: 'Drinks' },
  { id: 2, name: 'Cold Coffee', price: 60, emoji: '☕', category: 'Drinks' },
  { id: 3, name: 'Fresh Juice', price: 80, emoji: '🧃', category: 'Drinks' },
  { id: 4, name: 'Energy Drink', price: 99, emoji: '⚡', category: 'Drinks' },
  { id: 5, name: 'Chips Pack', price: 30, emoji: '🍿', category: 'Snacks' },
  { id: 6, name: 'Granola Bar', price: 45, emoji: '🍫', category: 'Snacks' },
  { id: 7, name: 'Sandwich', price: 90, emoji: '🥪', category: 'Snacks' },
  { id: 8, name: 'Cookies', price: 40, emoji: '🍪', category: 'Snacks' },
  { id: 9, name: 'Face Mask', price: 15, emoji: '😷', category: 'Essentials' },
  { id: 10, name: 'Hand Sanitizer', price: 30, emoji: '🧴', category: 'Essentials' },
]

export default function Refreshments() {
  const navigate = useNavigate()
  const [cart, setCart] = useState({})

  const addItem = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  const removeItem = (id) =>
    setCart((prev) => {
      const next = { ...prev }
      if (next[id] > 1) next[id]--
      else delete next[id]
      return next
    })

  const totalItems = Object.values(cart).reduce((s, v) => s + v, 0)
  const totalPrice = Object.entries(cart).reduce((s, [id, qty]) => {
    const item = ITEMS.find((i) => i.id === Number(id))
    return s + (item?.price || 0) * qty
  }, 0)

  const categories = [...new Set(ITEMS.map((i) => i.category))]

  return (
    <div className="refreshments-page">
      <header className="page-header">
        <h1>Refreshments</h1>
        <p>Order during your ride</p>
      </header>

      {categories.map((cat) => (
        <div key={cat} className="ref-section">
          <h3 className="ref-section-title">{cat}</h3>
          <div className="ref-grid">
            {ITEMS.filter((i) => i.category === cat).map((item, i) => (
              <div key={item.id} className="ref-card glass animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="ref-emoji">{item.emoji}</div>
                <div className="ref-name">{item.name}</div>
                <div className="ref-price">₹{item.price}</div>
                <div className="ref-actions">
                  {cart[item.id] ? (
                    <div className="qty-control">
                      <button onClick={() => removeItem(item.id)}><Minus size={14} /></button>
                      <span>{cart[item.id]}</span>
                      <button onClick={() => addItem(item.id)}><Plus size={14} /></button>
                    </div>
                  ) : (
                    <button className="add-btn" onClick={() => addItem(item.id)}>
                      <Plus size={14} /> Add
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {totalItems > 0 && (
        <div className="cart-bar glass animate-slide-up">
          <div className="cart-info">
            <ShoppingCart size={20} />
            <span>{totalItems} item{totalItems > 1 ? 's' : ''}</span>
          </div>
          <div className="cart-total">₹{totalPrice}</div>
          <button className="btn btn-primary cart-checkout">Add to Ride</button>
        </div>
      )}
    </div>
  )
}
