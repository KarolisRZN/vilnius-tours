const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");
const pool = require("../config/db");

// Add a review (only if user has a booking with status Completed)
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { tour_id, rating, comment } = req.body;

  // Check if user has a completed booking for this tour
  const bookingRes = await pool.query(
    "SELECT * FROM participants WHERE user_id = $1 AND tour_id = $2 AND status = 'Completed'",
    [userId, tour_id]
  );
  if (!bookingRes.rows.length)
    return res
      .status(403)
      .json({ message: "You can only review completed tours" });

  // Check if user already left a review for this tour
  const reviewRes = await pool.query(
    "SELECT * FROM reviews WHERE user_id = $1 AND tour_id = $2",
    [userId, tour_id]
  );
  if (reviewRes.rows.length)
    return res
      .status(400)
      .json({ message: "You already left a review for this tour" });

  // Add the review
  const result = await pool.query(
    "INSERT INTO reviews (user_id, tour_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
    [userId, tour_id, rating, comment]
  );
  res.json(result.rows[0]);
});

// Get all reviews (with user name and tour title)
router.get("/", async (req, res) => {
  const result = await pool.query(
    `SELECT r.*, u.name as user_name, t.title as tour_title
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN tours t ON r.tour_id = t.id
     ORDER BY r.created_at DESC`
  );
  res.json(result.rows);
});

module.exports = router;
