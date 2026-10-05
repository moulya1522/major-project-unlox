const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      enum: [30, 45, 60, 90],
      required: true,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
        "no-show",
      ],
      default: "scheduled",
    },

    meetingType: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },

    meetingLink: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

sessionSchema.index({
  therapist: 1,
  date: 1,
  startTime: 1,
});

sessionSchema.index({
  client: 1,
  date: 1,
});

module.exports = mongoose.model("Session", sessionSchema);