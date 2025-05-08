const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");
const pool = require("../config/db");

// User books a tour
router.post("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { tour_id, date_id } = req.body;

  // Get tour price
  const tourRes = await pool.query("SELECT price FROM tours WHERE id = $1", [
    tour_id,
  ]);
  if (tourRes.rows.length === 0)
    return res.status(404).json({ message: "Tour not found" });
  const price = tourRes.rows[0].price;

  // Check wallet
  const walletRes = await pool.query("SELECT wallet FROM users WHERE id = $1", [
    userId,
  ]);
  if (walletRes.rows[0].wallet < price)
    return res.status(400).json({ message: "Insufficient funds" });

  // Deduct money
  await pool.query("UPDATE users SET wallet = wallet - $1 WHERE id = $2", [
    price,
    userId,
  ]);

  // Create participant record
  const partRes = await pool.query(
    "INSERT INTO participants (user_id, tour_id, date_id, status) VALUES ($1, $2, $3, 'Pending') RETURNING *",
    [userId, tour_id, date_id]
  );
  res.json({ status: partRes.rows[0].status });
});

// Get all bookings (admin)
router.get("/", authMiddleware, async (req, res) => {
  // Only allow admin
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const result = await pool.query(
    `SELECT p.*, u.name as user_name, t.title as tour_title, d.date as tour_date
     FROM participants p
     JOIN users u ON p.user_id = u.id
     JOIN tours t ON p.tour_id = t.id
     JOIN tour_dates d ON p.date_id = d.id
     ORDER BY p.status, d.date`
  );
  res.json(result.rows);
});

// Get all bookings for current user
router.get("/my", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { tour_id, date_id } = req.query;
  let query = `SELECT p.*, t.title as tour_title, d.date as tour_date
               FROM participants p
               JOIN tours t ON p.tour_id = t.id
               JOIN tour_dates d ON p.date_id = d.id
               WHERE p.user_id = $1`;
  let params = [userId];
  if (tour_id && date_id) {
    query += " AND p.tour_id = $2 AND p.date_id = $3";
    params.push(tour_id, date_id);
    const result = await pool.query(query, params);
    return res.json(result.rows[0] || {});
  }
  const result = await pool.query(query, params);
  res.json(result.rows);
});

// Update booking status (admin)
router.put("/:id/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const { status } = req.body;
  if (!["Accepted", "Declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  // Get participant and tour price
  const partRes = await pool.query("SELECT * FROM participants WHERE id = $1", [
    req.params.id,
  ]);
  if (!partRes.rows.length)
    return res.status(404).json({ message: "Not found" });
  const participant = partRes.rows[0];
  if (status === "Declined") {
    // Refund
    const tourRes = await pool.query("SELECT price FROM tours WHERE id = $1", [
      participant.tour_id,
    ]);
    const price = tourRes.rows[0].price;
    await pool.query("UPDATE users SET wallet = wallet + $1 WHERE id = $2", [
      price,
      participant.user_id,
    ]);
  }
  await pool.query("UPDATE participants SET status = $1 WHERE id = $2", [
    status,
    req.params.id,
  ]);
  res.json({ message: "Status updated" });
});

module.exports = router;
