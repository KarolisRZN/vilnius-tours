const pool = require("../config/db");

// Get all tours
exports.getAllTours = async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM tours";
    let params = [];
    if (category) {
      query += " WHERE category = $1";
      params.push(category);
    }
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tour by ID
exports.getTourById = async (req, res) => {
  try {
    const tourRes = await pool.query("SELECT * FROM tours WHERE id = $1", [
      req.params.id,
    ]);
    if (tourRes.rows.length === 0)
      return res.status(404).json({ message: "Tour not found" });
    const tour = tourRes.rows[0];

    // Fetch available dates for this tour
    const datesRes = await pool.query(
      "SELECT id, date, time FROM tour_dates WHERE tour_id = $1 ORDER BY date, time",
      [tour.id]
    );
    tour.dates = datesRes.rows;

    res.json(tour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new tour
exports.createTour = async (req, res) => {
  const { title, description, category, price, duration, group_price, image } =
    req.body;
  const created_by = req.user.id;

  // Validate required fields
  if (!title || !description || !category || price == null || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tours (title, description, category, price, duration, created_by, group_price, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        title,
        description,
        category,
        price,
        duration,
        created_by,
        group_price,
        image,
      ]
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
  const { title, description, price, image } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tours SET title = $1, description = $2, price = $3, image = $4 WHERE id = $5 RETURNING *",
      [title, description, price, image, id]
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

// Add a date with time to a tour
exports.addTourDate = async (req, res) => {
  const { tourId } = req.params;
  const { date, time } = req.body;
  if (!date) return res.status(400).json({ error: "Date is required" });
  try {
    const result = await pool.query(
      "INSERT INTO tour_dates (tour_id, date, time) VALUES ($1, $2, $3) RETURNING *",
      [tourId, date, time]
    );
    res.status(201).json({ message: "Date added", date: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Edit a tour date
exports.updateTourDate = async (req, res) => {
  const { dateId } = req.params;
  const { date, time } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tour_dates SET date = $1, time = $2 WHERE id = $3 RETURNING *",
      [date, time, dateId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Date not found" });
    }
    res.json({ message: "Date updated", date: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get dates for a tour
exports.getTourDates = async (req, res) => {
  const { tourId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM tour_dates WHERE tour_id = $1 ORDER BY date",
      [tourId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
