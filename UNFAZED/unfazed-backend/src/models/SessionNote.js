const mongoose = require("mongoose");

const sessionNoteSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    visibility: {
      type: String,
      enum: ["private", "shared"],
      default: "private",
    },
  },
  {
    timestamps: true,
  }
);

sessionNoteSchema.index({
  therapist: 1,
  client: 1,
});

sessionNoteSchema.index({
  session: 1,
});

module.exports = mongoose.model("SessionNote", sessionNoteSchema);