const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    therapist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Therapist",
      required: true,
    },

    type: {
      type: String,
      enum: ["weekly", "override", "blocked"],
      required: true,
    },

    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },

    date: {
      type: Date,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    sessionDuration: {
      type: Number,
      enum: [30, 45, 60, 90],
      default: 60,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.index({
  therapist: 1,
  type: 1,
  dayOfWeek: 1,
});

availabilitySchema.index({
  therapist: 1,
  date: 1,
});

module.exports = mongoose.model("Availability", availabilitySchema);