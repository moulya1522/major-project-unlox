const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
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

    sessions: {
      type: Number,
      enum: [3, 6, 12],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

packageSchema.index({
  therapist: 1,
  sessions: 1,
});

module.exports = mongoose.model("Package", packageSchema);