const pool = require("../config/db");

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tours ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error getting tours:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get tour by ID
exports.getTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM tours WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error getting tour:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new tour
exports.createTour = async (req, res) => {
  const { title, description, category, price, duration, group_price } =
    req.body;
  const created_by = req.user.id; // Get admin ID from JWT

  // Validate required fields
  if (!title || !description || !category || price == null || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tours (title, description, category, price, duration, created_by, group_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, description, category, price, duration, created_by, group_price]
    );

    res.status(201).json({ message: "Tour created", tour: result.rows[0] });
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a tour
exports.updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tours SET title = $1, description = $2, price = $3 WHERE id = $4 RETURNING *",
      [title, description, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.status(200).json({ message: "Tour updated", tour: result.rows[0] });
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a tour
exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM tours WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tour not found" });
    }
    res.status(200).json({ message: "Tour deleted" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
