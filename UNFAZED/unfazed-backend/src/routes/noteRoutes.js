const express = require("express");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create clinical note
router.post("/", createNote);

// Get all clinical notes
router.get("/", getNotes);

// Get one clinical note
router.get("/:id", getNoteById);

// Update clinical note
router.put("/:id", updateNote);

// Delete clinical note
router.delete("/:id", deleteNote);

module.exports = router;