const SessionNote = require("../models/SessionNote");
const Client = require("../models/Client");
const Session = require("../models/Session");

// Create a clinical note
const createNote = async (req, res) => {
  try {
    const {
      clientId,
      sessionId,
      title,
      content,
      visibility,
    } = req.body;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client is required.",
      });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note title is required.",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note content is required.",
      });
    }

    // Check client belongs to therapist
    const client = await Client.findOne({
      _id: clientId,
      therapist: req.therapist._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    // Check session belongs to therapist/client if provided
    if (sessionId) {
      const session = await Session.findOne({
        _id: sessionId,
        therapist: req.therapist._id,
        client: clientId,
      });

      if (!session) {
        return res.status(404).json({
          success: false,
          message: "Session not found.",
        });
      }
    }

    const note = await SessionNote.create({
      therapist: req.therapist._id,
      client: clientId,
      session: sessionId || null,
      title: title.trim(),
      content: content.trim(),
      visibility:
        visibility === "shared" ? "shared" : "private",
    });

    const populatedNote = await SessionNote.findById(note._id)
      .populate("client", "name email phone")
      .populate(
        "session",
        "date startTime endTime duration status"
      );

    res.status(201).json({
      success: true,
      message: "Clinical note created successfully.",
      note: populatedNote,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create clinical note.",
    });
  }
};

// Get all notes for therapist
const getNotes = async (req, res) => {
  try {
    const { clientId } = req.query;

    const filter = {
      therapist: req.therapist._id,
    };

    if (clientId) {
      filter.client = clientId;
    }

    const notes = await SessionNote.find(filter)
      .populate("client", "name email phone")
      .populate(
        "session",
        "date startTime endTime duration status"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load clinical notes.",
    });
  }
};

// Get one note
const getNoteById = async (req, res) => {
  try {
    const note = await SessionNote.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    })
      .populate("client", "name email phone")
      .populate(
        "session",
        "date startTime endTime duration status"
      );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Clinical note not found.",
      });
    }

    res.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load clinical note.",
    });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const {
      title,
      content,
      visibility,
      sessionId,
    } = req.body;

    const note = await SessionNote.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Clinical note not found.",
      });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Note title cannot be empty.",
        });
      }

      note.title = title.trim();
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message: "Note content cannot be empty.",
        });
      }

      note.content = content.trim();
    }

    if (visibility !== undefined) {
      if (!["private", "shared"].includes(visibility)) {
        return res.status(400).json({
          success: false,
          message: "Invalid note visibility.",
        });
      }

      note.visibility = visibility;
    }

    if (sessionId !== undefined) {
      if (sessionId === "") {
        note.session = null;
      } else {
        const session = await Session.findOne({
          _id: sessionId,
          therapist: req.therapist._id,
          client: note.client,
        });

        if (!session) {
          return res.status(404).json({
            success: false,
            message: "Session not found.",
          });
        }

        note.session = sessionId;
      }
    }

    await note.save();

    const updatedNote = await SessionNote.findById(note._id)
      .populate("client", "name email phone")
      .populate(
        "session",
        "date startTime endTime duration status"
      );

    res.json({
      success: true,
      message: "Clinical note updated successfully.",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update clinical note.",
    });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await SessionNote.findOneAndDelete({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Clinical note not found.",
      });
    }

    res.json({
      success: true,
      message: "Clinical note deleted successfully.",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete clinical note.",
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};