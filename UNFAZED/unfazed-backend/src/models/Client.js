const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    password_hash: {
      type: String,
      default: null,
    },

    isPortalActive: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      trim: true,
    },

    concern: {
      type: String,
      trim: true,
    },

    intakeSummary: {
      type: String,
      trim: true,
    },

    consentGiven: {
      type: Boolean,
      default: false,
    },

    consentTimestamp: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

clientSchema.index({
  therapist: 1,
  email: 1,
});

module.exports = mongoose.model("Client", clientSchema);