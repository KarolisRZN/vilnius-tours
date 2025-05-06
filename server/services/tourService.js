const pool = require('../config/db');

// get all tours
const fetchAllTours = async () => {
  const result = await pool.query('SELECT * FROM tours');
  return result.rows;
};

module.exports = {
  fetchAllTours,
};