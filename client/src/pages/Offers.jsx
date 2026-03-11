import { useState } from 'react'
import { Tag, Copy, Check, Clock, Percent, Gift } from 'lucide-react'
import './Offers.css'

const OFFERS = [
  {
    id: 1,
    code: 'FIRST50',
    title: '50% Off First Ride',
    desc: 'New user? Get 50% off your first ride with Ucab.',
    discount: '50%',
    maxSave: 150,
    validTill: '2026-04-30',
    color: '#6366f1',
    icon: <Gift size={24} />,
  },
  {
    id: 2,
    code: 'WEEKEND20',
    title: '20% Weekend Discount',
    desc: 'Enjoy weekends with 20% off on all rides. Valid Sat & Sun only.',
    discount: '20%',
    maxSave: 100,
    validTill: '2026-03-31',
    color: '#8b5cf6',
    icon: <Percent size={24} />,
  },
  {
    id: 3,
    code: 'AIRPORT100',
    title: '₹100 Off Airport Rides',
    desc: 'Flat ₹100 off on rides to or from any airport.',
    discount: '₹100',
    maxSave: 100,
    validTill: '2026-05-15',
    color: '#ec4899',
    icon: <Tag size={24} />,
  },
  {
    id: 4,
    code: 'FRIEND10',
    title: 'Refer & Earn',
    desc: 'Refer a friend and both get ₹50 off your next ride.',
    discount: '₹50',
    maxSave: 50,
    validTill: '2026-06-30',
    color: '#14b8a6',
    icon: <Gift size={24} />,
  },
]

export default function Offers() {
  const [copiedId, setCopiedId] = useState(null)

  const copyCode = (id, code) => {
    navigator.clipboard?.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const daysLeft = (date) => {
    const diff = new Date(date) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="offers-page">
      <header className="page-header">
        <h1>Offers & Promos</h1>
        <p>Save on every ride</p>
      </header>

      {/* Donation banner */}
      <div className="donation-banner glass animate-slide-up">
        <div className="donation-emoji">💚</div>
        <div className="donation-text">
          <strong>Round Up for Good</strong>
          <p>Round up your fare to donate to children's education charities.</p>
        </div>
        <button className="btn btn-secondary donation-btn">Enable</button>
      </div>

      <div className="offers-grid">
        {OFFERS.map((offer, i) => (
          <div
            key={offer.id}
            className="offer-card animate-slide-up"
            style={{ animationDelay: `${i * 0.08}s`, '--offer-color': offer.color }}
          >
            <div className="offer-header">
              <div className="offer-icon" style={{ background: offer.color }}>{offer.icon}</div>
              <div className="offer-discount">{offer.discount}</div>
            </div>
            <h3>{offer.title}</h3>
            <p>{offer.desc}</p>
            <div className="offer-footer">
              <div className="offer-validity">
                <Clock size={13} />
                <span>{daysLeft(offer.validTill)} days left</span>
              </div>
              <button
                className="copy-btn"
                onClick={() => copyCode(offer.id, offer.code)}
              >
                {copiedId === offer.id ? (
                  <><Check size={14} /> Copied</>
                ) : (
                  <><Copy size={14} /> {offer.code}</>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
