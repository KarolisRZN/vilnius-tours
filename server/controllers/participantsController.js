const pool = require("../config/db");

exports.createParticipant = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tour_id, date_id } = req.body;

    // Always insert a valid status
    await pool.query(
      "INSERT INTO participants (user_id, tour_id, date_id, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, tour_id, date_id, "Pending"]
    );

    res.status(201).json({ message: "Booking submitted!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ["Pending", "Accepted", "Declined", "Completed"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const result = await pool.query(
      "UPDATE participants SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
