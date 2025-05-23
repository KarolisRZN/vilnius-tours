const pool = require("../config/db");

exports.createParticipant = async (req, res) => {
  try {
    const { tour_id, date_id, note } = req.body;
    const user_id = req.user.id;

    // Get tour price
    const tourResult = await pool.query(
      "SELECT price FROM tours WHERE id = $1",
      [tour_id]
    );
    if (tourResult.rowCount === 0)
      return res.status(404).json({ message: "Tour not found" });

    const price = Number(tourResult.rows[0].price);

    // Check user wallet
    const userResult = await pool.query(
      "SELECT wallet FROM users WHERE id = $1",
      [user_id]
    );
    if (userResult.rowCount === 0)
      return res.status(404).json({ message: "User not found" });

    const wallet = Number(userResult.rows[0].wallet);
    if (wallet < price)
      return res.status(400).json({ message: "Insufficient funds" });

    // Deduct price
    await pool.query("UPDATE users SET wallet = wallet - $1 WHERE id = $2", [
      price,
      user_id,
    ]);

    // Create booking with status "Pending"
    const result = await pool.query(
      "INSERT INTO participants (user_id, tour_id, date_id, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, tour_id, date_id, "Pending"]
    );
    res.status(201).json(result.rows[0]);
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
    if (!["Accepted", "Declined", "Completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get participant info
    const participantResult = await pool.query(
      "SELECT * FROM participants WHERE id = $1",
      [id]
    );
    if (participantResult.rowCount === 0)
      return res.status(404).json({ message: "Not found" });

    const participant = participantResult.rows[0];

    // If accepting, deduct tour price from user's wallet
    if (status === "Accepted" && participant.status !== "Accepted") {
      // Get tour price
      const tourResult = await pool.query(
        "SELECT price FROM tours WHERE id = $1",
        [participant.tour_id]
      );
      if (tourResult.rowCount === 0)
        return res.status(404).json({ message: "Tour not found" });

      const price = Number(tourResult.rows[0].price);

      // Check user wallet
      const userResult = await pool.query(
        "SELECT wallet FROM users WHERE id = $1",
        [participant.user_id]
      );
      if (userResult.rowCount === 0)
        return res.status(404).json({ message: "User not found" });

      const wallet = Number(userResult.rows[0].wallet);
      if (wallet < price)
        return res.status(400).json({ message: "Insufficient funds" });

      // Deduct price
      console.log("Deducting", price, "from user", participant.user_id);
      await pool.query("UPDATE users SET wallet = wallet - $1 WHERE id = $2", [
        price,
        participant.user_id,
      ]);
      console.log("Deducted!");
    }

    // Update status
    const result = await pool.query(
      "UPDATE participants SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT p.*, t.title as tour_title, d.date as tour_date, d.time as tour_time
       FROM participants p
       JOIN tours t ON p.tour_id = t.id
       JOIN tour_dates d ON p.date_id = d.id
       WHERE p.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteParticipant = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM participants WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted", participant: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getParticipants = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as user_name, t.title as tour_title, d.date as tour_date, d.time as tour_time
       FROM participants p
       JOIN users u ON p.user_id = u.id
       JOIN tours t ON p.tour_id = t.id
       JOIN tour_dates d ON p.date_id = d.id
       ORDER BY p.status, d.date`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  const result = await pool.query(`
    SELECT p.*, u.name as user_name, t.title as tour_title, d.date as tour_date, d.time as tour_time
    FROM participants p
    JOIN users u ON p.user_id = u.id
    JOIN tours t ON p.tour_id = t.id
    JOIN tour_dates d ON p.date_id = d.id
    ORDER BY p.status, d.date
  `);
  res.json(result.rows);
};
