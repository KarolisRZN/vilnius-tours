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
const usersRoutes = require("./routes/userRoutes");
const reviewsRoutes = require("./routes/reviewsRoutes");
const config = require("./config/config");

dotenv.config();

const app = express();
const PORT = config.PORT || process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" })); 

app.use("/api/tours", toursRoutes);
app.use("/api/tour-dates", tourDatesRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/participants", participantsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/reviews", reviewsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
