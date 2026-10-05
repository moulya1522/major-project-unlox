const express = require("express");

const {
  createAvailability,
  getAvailability,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
} = require("../controllers/availabilityController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All availability routes require therapist login
router.use(authMiddleware);

// Create availability
router.post("/", createAvailability);

// Get all availability
router.get("/", getAvailability);

// Get one availability
router.get("/:id", getAvailabilityById);

// Update availability
router.put("/:id", updateAvailability);

// Delete availability
router.delete("/:id", deleteAvailability);

module.exports = router;