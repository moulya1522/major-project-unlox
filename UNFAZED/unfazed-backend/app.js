const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./src/routes/authRoutes");
const therapistRoutes = require("./src/routes/therapistRoutes");
const clientRoutes = require("./src/routes/clientRoutes");
const availabilityRoutes = require("./src/routes/availabilityRoutes");
const sessionRoutes = require("./src/routes/sessionRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const packageRoutes = require("./src/routes/packageRoutes");
const passwordRoutes = require("./src/routes/passwordRoutes");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Unfazed API is running successfully 🚀",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend and API are working properly",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/password", passwordRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error.",
  });
});

module.exports = app;