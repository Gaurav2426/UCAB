const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
const { protect } = require("../middleware/auth");

const DRIVER_NAMES = [
  "Rajesh Kumar", "Amit Sharma", "Priya Singh", "Suresh Patel",
  "Vikram Reddy", "Deepak Verma", "Anita Gupta", "Manoj Tiwari",
];
const VEHICLES = [
  { model: "Maruti Swift", number: "DL 4C AB 1234" },
  { model: "Hyundai i20", number: "MH 12 DE 5678" },
  { model: "Toyota Innova", number: "KA 01 MF 9012" },
  { model: "Honda City", number: "TN 09 GH 3456" },
  { model: "Mahindra XUV700", number: "UP 32 JK 7890" },
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// POST /api/rides — create a ride
router.post("/", protect, async (req, res, next) => {
  try {
    const { pickup, dropoff, cabType, fare, distance, duration } = req.body;

    const driver = pickRandom(DRIVER_NAMES);
    const vehicle = pickRandom(VEHICLES);

    const ride = await Ride.create({
      user: req.user._id,
      pickup,
      dropoff,
      cabType,
      fare,
      distance,
      duration,
      status: "confirmed",
      driverName: driver,
      driverRating: (4 + Math.random()).toFixed(1),
      vehicleNumber: vehicle.number,
      vehicleModel: vehicle.model,
    });

    res.status(201).json(ride);
  } catch (err) {
    next(err);
  }
});

// GET /api/rides — list user rides
router.get("/", protect, async (req, res, next) => {
  try {
    const rides = await Ride.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(rides);
  } catch (err) {
    next(err);
  }
});

// GET /api/rides/:id
router.get("/:id", protect, async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      res.status(404);
      throw new Error("Ride not found");
    }
    res.json(ride);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/rides/:id/cancel
router.patch("/:id/cancel", protect, async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      res.status(404);
      throw new Error("Ride not found");
    }
    ride.status = "cancelled";
    await ride.save();
    res.json(ride);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/rides/:id/complete
router.patch("/:id/complete", protect, async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) {
      res.status(404);
      throw new Error("Ride not found");
    }
    ride.status = "completed";
    await ride.save();
    res.json(ride);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
