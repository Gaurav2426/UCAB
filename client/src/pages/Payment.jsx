import { CreditCard, Shield, Smartphone } from 'lucide-react'
import './Payment.css'

const PAYMENT_METHODS = [
  { type: 'card', name: 'Visa ending in 4242', icon: <CreditCard size={24} />, active: true },
  { type: 'upi', name: 'UPI — user@paytm', icon: <Smartphone size={24} />, active: false },
  { type: 'card', name: 'Mastercard ending in 8888', icon: <CreditCard size={24} />, active: false },
]

export default function Payment() {
  return (
    <div className="payment-page">
      <header className="page-header">
        <h1>Payment</h1>
        <p>Your saved payment methods</p>
      </header>

      <div className="payment-methods">
        {PAYMENT_METHODS.map((pm, i) => (
          <div key={i} className={`payment-card glass animate-slide-up ${pm.active ? 'active' : ''}`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="pm-icon">{pm.icon}</div>
            <div className="pm-info">
              <span className="pm-name">{pm.name}</span>
              {pm.active && <span className="badge badge-green">Default</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="payment-security glass">
        <Shield size={20} />
        <div>
          <strong>Payments are secure</strong>
          <p>All transactions are encrypted and processed securely.</p>
        </div>
      </div>
    </div>
  )
}
