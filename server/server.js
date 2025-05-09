const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const toursRoutes = require("./routes/toursRoutes");
const setUserRoutes = require("./routes/userRoutes");
const tourDatesRoutes = require("./routes/tourDatesRoutes");
const walletRoutes = require("./routes/walletRoutes");
const participantsRoutes = require("./routes/participantsRoutes");
const config = require("./config/config");

dotenv.config();

const app = express();
const PORT = config.PORT || process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" })); // Middleware for JSON body parsing
app.use(bodyParser.json({ limit: "10mb" })); // Middleware for JSON body parsing

app.use("/api/tours", toursRoutes);
app.use("/api/tour-dates", tourDatesRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/participants", participantsRoutes);
setUserRoutes(app); // Register user CRUD routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
