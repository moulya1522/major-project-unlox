const Session = require("../models/Session");
const Client = require("../models/Client");
const Availability = require("../models/Availability");

// ===============================
// CREATE SESSION
// Therapist creates a session
// ===============================

const createSession = async (req, res) => {
  try {
    const {
      client,
      date,
      startTime,
      endTime,
      duration,
      type,
      notes,
      status,
    } = req.body;

    if (!client || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Client, date, start time and end time are required.",
      });
    }

    const clientData = await Client.findOne({
      _id: client,
      therapist: req.therapist._id,
    });

    if (!clientData) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    const existingSession = await Session.findOne({
      therapist: req.therapist._id,
      date,
      startTime,
      status: {
        $nin: ["cancelled", "completed"],
      },
    });

    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    const session = await Session.create({
      therapist: req.therapist._id,
      client: clientData._id,
      date,
      startTime,
      endTime,
      duration,
      type: type || "online",
      notes,
      status: status || "scheduled",
    });

    const populatedSession = await Session.findById(session._id)
      .populate("client", "name email phone")
      .populate("therapist", "name email");

    res.status(201).json({
      success: true,
      message: "Session created successfully.",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Create session error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create session.",
    });
  }
};

// ===============================
// GET THERAPIST SESSIONS
// ===============================

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      therapist: req.therapist._id,
    })
      .populate("client", "name email phone")
      .sort({
        date: 1,
        startTime: 1,
      });

    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sessions.",
    });
  }
};

// ===============================
// GET ONE SESSION
// ===============================

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    })
      .populate("client", "name email phone")
      .populate("therapist", "name email");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Get session error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch session.",
    });
  }
};

// ===============================
// UPDATE SESSION
// ===============================

const updateSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    const {
      date,
      startTime,
      endTime,
      duration,
      type,
      notes,
      status,
    } = req.body;

    if (date !== undefined) {
      session.date = date;
    }

    if (startTime !== undefined) {
      session.startTime = startTime;
    }

    if (endTime !== undefined) {
      session.endTime = endTime;
    }

    if (duration !== undefined) {
      session.duration = duration;
    }

    if (type !== undefined) {
      session.type = type;
    }

    if (notes !== undefined) {
      session.notes = notes;
    }

    if (status !== undefined) {
      session.status = status;
    }

    await session.save();

    const updatedSession = await Session.findById(session._id)
      .populate("client", "name email phone")
      .populate("therapist", "name email");

    res.json({
      success: true,
      message: "Session updated successfully.",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Update session error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update session.",
    });
  }
};

// ===============================
// DELETE SESSION
// ===============================

const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOneAndDelete({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found.",
      });
    }

    res.json({
      success: true,
      message: "Session deleted successfully.",
    });
  } catch (error) {
    console.error("Delete session error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete session.",
    });
  }
};

// ===============================
// CLIENT BOOKS SESSION
// ===============================

const bookClientSession = async (req, res) => {
  try {
    const {
      therapistId,
      date,
      startTime,
      endTime,
      duration,
      type,
      notes,
    } = req.body;

    if (!therapistId || !date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message:
          "Therapist, date, start time and end time are required.",
      });
    }

    const client = await Client.findById(req.client._id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    if (client.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Client account is inactive.",
      });
    }

    // Make sure the requested therapist is the client's therapist
    if (String(client.therapist) !== String(therapistId)) {
      return res.status(403).json({
        success: false,
        message: "You can only book with your assigned therapist.",
      });
    }

    // Prevent double booking
    const existingSession = await Session.findOne({
      therapist: therapistId,
      date,
      startTime,
      status: {
        $nin: ["cancelled", "completed"],
      },
    });

    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked.",
      });
    }

    const session = await Session.create({
      therapist: therapistId,
      client: client._id,
      date,
      startTime,
      endTime,
      duration: duration || 60,
      type: type || "online",
      notes: notes || "",
      status: "scheduled",
    });

    const populatedSession = await Session.findById(session._id)
      .populate("therapist", "name email slug")
      .populate("client", "name email phone");

    res.status(201).json({
      success: true,
      message: "Session booked successfully.",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Client booking error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to book session.",
    });
  }
};

// ===============================
// GET CLIENT SESSIONS
// ===============================

const getClientSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      client: req.client._id,
    })
      .populate("therapist", "name email slug")
      .sort({
        date: -1,
        startTime: -1,
      });

    res.json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get client sessions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch client sessions.",
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  bookClientSession,
  getClientSessions,
};