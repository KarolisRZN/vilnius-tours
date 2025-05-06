const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const tourRoutes = require("./routes/toursRoutes");
const setUserRoutes = require("./routes/userRoutes");
const config = require("./config/config");

dotenv.config();

const app = express();
const PORT = config.PORT || process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json()); // Middleware for JSON body parsing

app.use("/api/tours", tourRoutes);
setUserRoutes(app); // Register user CRUD routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
