const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { generateToken } = require("../middleware/auth");

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({ name, email, phone, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401);
      throw new Error("No token");
    }
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "ucab_jwt_secret_dev_key"
    );
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
