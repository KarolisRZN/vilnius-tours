const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");
const pool = require("../config/db");

// Get wallet balance
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query("SELECT wallet FROM users WHERE id = $1", [
    userId,
  ]);
  res.json({ amount: result.rows[0]?.wallet || 0 });
});

// Add money to wallet
router.post("/add", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Invalid amount" });
  const result = await pool.query(
    "UPDATE users SET wallet = wallet + $1 WHERE id = $2 RETURNING wallet",
    [amount, userId]
  );
  res.json({ amount: result.rows[0].wallet });
});

// Get wallet balance for the authenticated user
router.get("/me/wallet", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query("SELECT wallet FROM users WHERE id = $1", [
    userId,
  ]);
  if (result.rows.length === 0)
    return res.status(404).json({ message: "Not found" });
  res.json({ wallet: result.rows[0].wallet });
});

module.exports = router;
