const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoff: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    cabType: {
      type: String,
      enum: ["economy", "comfort", "premium", "xl"],
      default: "economy",
    },
    fare: {
      type: Number,
      required: true,
    },
    distance: {
      type: Number, // in km
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "confirmed", "in-progress", "completed", "cancelled"],
      default: "requested",
    },
    driverName: {
      type: String,
      default: "",
    },
    driverRating: {
      type: Number,
      default: 4.5,
    },
    vehicleNumber: {
      type: String,
      default: "",
    },
    vehicleModel: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ride", rideSchema);
