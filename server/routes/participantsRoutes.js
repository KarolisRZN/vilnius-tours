const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.js");
const pool = require("../config/db");
const participantsController = require("../controllers/participantsController");

// User books a tour
router.post("/", authMiddleware, participantsController.createParticipant);

// Get all bookings (admin)
router.get("/", authMiddleware, async (req, res) => {
  // Only allow admin
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Forbidden" });
  const result = await pool.query(
    `SELECT p.*, u.name as user_name, t.title as tour_title, d.date as tour_date, d.time as tour_time
     FROM participants p
     JOIN users u ON p.user_id = u.id
     JOIN tours t ON p.tour_id = t.id
     JOIN tour_dates d ON p.date_id = d.id
     ORDER BY p.status, d.date`
  );
  res.json(result.rows);
});

// Get all bookings for current user
router.get("/my", authMiddleware, participantsController.getMyBookings);

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

router.patch(
  "/:id/status",
  authMiddleware,
  participantsController.updateStatus
);

// Delete booking by id (admin)
router.delete("/:id", authMiddleware, participantsController.deleteParticipant);

module.exports = router;
