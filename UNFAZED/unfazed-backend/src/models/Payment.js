const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
    },

    paymentMethod: {
      type: String,
      default: "razorpay",
      enum: ["razorpay", "cash", "other"],
    },

    status: {
      type: String,
      enum: ["created", "pending", "paid", "failed", "refunded"],
      default: "created",
    },

    razorpayOrderId: {
      type: String,
      trim: true,
    },

    razorpayPaymentId: {
      type: String,
      trim: true,
    },

    razorpaySignature: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({
  therapist: 1,
  client: 1,
});

paymentSchema.index({
  razorpayOrderId: 1,
});

paymentSchema.index({
  razorpayPaymentId: 1,
});

module.exports = mongoose.model("Payment", paymentSchema);