const Availability = require("../models/Availability");

// Create availability
const createAvailability = async (req, res) => {
  try {
    const {
      type,
      dayOfWeek,
      date,
      startTime,
      endTime,
      sessionDuration,
      timezone,
      isAvailable,
      note,
    } = req.body;

    if (!type || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Type, start time and end time are required.",
      });
    }

    if (!["weekly", "override", "blocked"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid availability type.",
      });
    }

    if (type === "weekly" && (dayOfWeek === undefined || dayOfWeek === null)) {
      return res.status(400).json({
        success: false,
        message: "Day of week is required for weekly availability.",
      });
    }

    if ((type === "override" || type === "blocked") && !date) {
      return res.status(400).json({
        success: false,
        message: "Date is required for override or blocked availability.",
      });
    }

    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time.",
      });
    }

    const availability = await Availability.create({
      therapist: req.therapist._id,
      type,
      dayOfWeek:
        type === "weekly" ? Number(dayOfWeek) : undefined,
      date:
        type !== "weekly" ? new Date(date) : undefined,
      startTime,
      endTime,
      sessionDuration: Number(sessionDuration) || 60,
      timezone: timezone || "Asia/Kolkata",
      isAvailable: type === "blocked" ? false : isAvailable !== false,
      note,
    });

    res.status(201).json({
      success: true,
      message: "Availability created successfully.",
      availability,
    });
  } catch (error) {
    console.error("Create availability error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create availability.",
    });
  }
};

// Get therapist availability
const getAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({
      therapist: req.therapist._id,
    }).sort({
      type: 1,
      dayOfWeek: 1,
      date: 1,
      startTime: 1,
    });

    res.json({
      success: true,
      count: availability.length,
      availability,
    });
  } catch (error) {
    console.error("Get availability error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch availability.",
    });
  }
};

// Get one availability
const getAvailabilityById = async (req, res) => {
  try {
    const availability = await Availability.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found.",
      });
    }

    res.json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("Get availability error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch availability.",
    });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found.",
      });
    }

    const {
      type,
      dayOfWeek,
      date,
      startTime,
      endTime,
      sessionDuration,
      timezone,
      isAvailable,
      note,
    } = req.body;

    if (type !== undefined) {
      if (!["weekly", "override", "blocked"].includes(type)) {
        return res.status(400).json({
          success: false,
          message: "Invalid availability type.",
        });
      }

      availability.type = type;
    }

    if (dayOfWeek !== undefined) {
      availability.dayOfWeek = Number(dayOfWeek);
    }

    if (date !== undefined) {
      availability.date = date ? new Date(date) : null;
    }

    if (startTime !== undefined) {
      availability.startTime = startTime;
    }

    if (endTime !== undefined) {
      availability.endTime = endTime;
    }

    if (sessionDuration !== undefined) {
      const duration = Number(sessionDuration);

      if (![30, 45, 60, 90].includes(duration)) {
        return res.status(400).json({
          success: false,
          message: "Session duration must be 30, 45, 60 or 90 minutes.",
        });
      }

      availability.sessionDuration = duration;
    }

    if (timezone !== undefined) {
      availability.timezone = timezone;
    }

    if (isAvailable !== undefined) {
      availability.isAvailable = Boolean(isAvailable);
    }

    if (note !== undefined) {
      availability.note = note;
    }

    if (availability.startTime >= availability.endTime) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time.",
      });
    }

    if (availability.type === "blocked") {
      availability.isAvailable = false;
    }

    await availability.save();

    res.json({
      success: true,
      message: "Availability updated successfully.",
      availability,
    });
  } catch (error) {
    console.error("Update availability error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update availability.",
    });
  }
};

// Delete availability
const deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findOneAndDelete({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found.",
      });
    }

    res.json({
      success: true,
      message: "Availability deleted successfully.",
    });
  } catch (error) {
    console.error("Delete availability error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete availability.",
    });
  }
};

module.exports = {
  createAvailability,
  getAvailability,
  getAvailabilityById,
  updateAvailability,
  deleteAvailability,
};