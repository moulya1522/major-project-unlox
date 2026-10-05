const express = require("express");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  res.json({
    success: true,
    therapist: req.therapist,
  });
});

module.exports = router;