const express = require("express");

const {
  createPaymentOrder,
  verifyPayment,
  getPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create Razorpay order
router.post("/create-order", createPaymentOrder);

// Verify Razorpay payment
router.post("/verify", verifyPayment);

// Get all payments
router.get("/", getPayments);

// Get one payment
router.get("/:id", getPaymentById);

module.exports = router;