const crypto = require("crypto");

const Payment = require("../models/Payment");
const Client = require("../models/Client");
const Session = require("../models/Session");

// Create test/mock payment
const createPaymentOrder = async (req, res) => {
  try {
    const therapistId = req.therapist._id;

    const {
      clientId,
      sessionId,
      amount,
      description,
    } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client is required.",
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required.",
      });
    }

    const client = await Client.findOne({
      _id: clientId,
      therapist: therapistId,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    let session = null;

    if (sessionId) {
      session = await Session.findOne({
        _id: sessionId,
        therapist: therapistId,
        client: clientId,
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found.",
        });
      }
    }

    // Generate a test payment/order ID
    const testOrderId = `test_order_${Date.now()}`;

    const payment = await Payment.create({
      therapist: therapistId,
      client: clientId,
      session: sessionId || null,
      amount: Number(amount),
      currency: "INR",
      paymentMethod: "other",
      status: "pending",
      razorpayOrderId: testOrderId,
      description:
        description || "Unfazed therapy session payment",
    });

    res.status(201).json({
      success: true,
      message: "Test payment order created successfully.",
      testMode: true,

      payment: {
        _id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        orderId: testOrderId,
      },

      order: {
        id: testOrderId,
        amount: payment.amount * 100,
        currency: "INR",
      },
    });
  } catch (error) {
    console.error("Create test payment error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to create payment order.",
    });
  }
};


// Complete test payment
const verifyPayment = async (req, res) => {
  try {
    const therapistId = req.therapist._id;

    const {
      paymentId,
      success,
    } = req.body;

    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required.",
      });
    }

    const payment = await Payment.findOne({
      _id: paymentId,
      therapist: therapistId,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (success === false) {
      payment.status = "failed";
      await payment.save();

      return res.json({
        success: true,
        message: "Test payment marked as failed.",
        payment,
      });
    }

    // Generate test payment ID
    const testPaymentId = `test_payment_${Date.now()}`;

    payment.status = "paid";
    payment.razorpayPaymentId = testPaymentId;
    payment.razorpaySignature = crypto
      .createHash("sha256")
      .update(`${payment.razorpayOrderId}|${testPaymentId}`)
      .digest("hex");
    payment.paidAt = new Date();

    await payment.save();

    res.json({
      success: true,
      message: "Test payment completed successfully.",
      testMode: true,
      payment,
    });
  } catch (error) {
    console.error("Verify test payment error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to complete payment.",
    });
  }
};


// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      therapist: req.therapist._id,
    })
      .populate("client", "name email phone")
      .populate(
        "session",
        "date startTime endTime status"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    console.error("Get payments error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch payments.",
    });
  }
};


// Get one payment
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    })
      .populate("client", "name email phone")
      .populate("session");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Get payment error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch payment.",
    });
  }
};


module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPayments,
  getPaymentById,
};