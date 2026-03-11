const express = require("express");
const router = express.Router();

// Fare rates per km by cab type
const RATES = {
  economy: { base: 30, perKm: 9, perMin: 1.5 },
  comfort: { base: 50, perKm: 13, perMin: 2 },
  premium: { base: 80, perKm: 18, perMin: 3 },
  xl: { base: 70, perKm: 15, perMin: 2.5 },
};

const CAB_TYPES = [
  { type: "economy", name: "Economy", capacity: 4, icon: "🚗" },
  { type: "comfort", name: "Comfort", capacity: 4, icon: "🚙" },
  { type: "premium", name: "Premium", capacity: 4, icon: "🏎️" },
  { type: "xl", name: "XL", capacity: 6, icon: "🚐" },
];

// Haversine distance in km
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/cabs/nearby?lat=&lng=
router.get("/nearby", (req, res) => {
  const { lat, lng } = req.query;
  const baseLat = parseFloat(lat) || 28.6139;
  const baseLng = parseFloat(lng) || 77.209;

  const cabs = [];
  for (let i = 0; i < 8; i++) {
    const offsetLat = (Math.random() - 0.5) * 0.02;
    const offsetLng = (Math.random() - 0.5) * 0.02;
    const cabType = CAB_TYPES[Math.floor(Math.random() * CAB_TYPES.length)];
    const dist = haversine(baseLat, baseLng, baseLat + offsetLat, baseLng + offsetLng);
    const eta = Math.max(2, Math.round(dist * 3 + Math.random() * 4));

    cabs.push({
      id: `cab_${i}`,
      lat: baseLat + offsetLat,
      lng: baseLng + offsetLng,
      type: cabType.type,
      name: cabType.name,
      icon: cabType.icon,
      eta,
      rating: (4 + Math.random()).toFixed(1),
    });
  }
  res.json(cabs);
});

// GET /api/cabs/estimate?pickupLat=&pickupLng=&dropLat=&dropLng=
router.get("/estimate", (req, res) => {
  const { pickupLat, pickupLng, dropLat, dropLng } = req.query;
  const dist = haversine(
    parseFloat(pickupLat),
    parseFloat(pickupLng),
    parseFloat(dropLat),
    parseFloat(dropLng)
  );

  // Road distance ~1.4x straight-line distance
  const roadDist = Math.round(dist * 1.4 * 10) / 10;
  const duration = Math.max(5, Math.round(roadDist * 2.5 + Math.random() * 5));

  const estimates = CAB_TYPES.map((cab) => {
    const rate = RATES[cab.type];
    const fare = Math.round(rate.base + rate.perKm * roadDist + rate.perMin * duration);
    const eta = Math.max(2, Math.round(3 + Math.random() * 8));
    return {
      ...cab,
      fare,
      eta,
      distance: roadDist,
      duration,
    };
  });

  res.json(estimates);
});

module.exports = router;
