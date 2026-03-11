const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const ridesRoutes = require("./rides");
const cabsRoutes = require("./cabs");

// Health check
router.get("/", (req, res) => {
  res.json({ status: "ok", message: "Ucab API is running" });
});

// Mount sub-routers
router.use("/auth", authRoutes);
router.use("/rides", ridesRoutes);
router.use("/cabs", cabsRoutes);

module.exports = router;
