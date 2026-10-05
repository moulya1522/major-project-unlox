const express = require("express");

const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  deleteSession,
  bookClientSession,
  getClientSessions,
} = require("../controllers/sessionController");

const authMiddleware = require("../middleware/authMiddleware");
const clientAuthMiddleware = require("../middleware/clientAuthMiddleware");

const router = express.Router();

// ==========================================
// CLIENT PORTAL ROUTES
// ==========================================

// Client books a session
router.post(
  "/client/book",
  clientAuthMiddleware,
  bookClientSession
);

// Client views their sessions
router.get(
  "/client/my-sessions",
  clientAuthMiddleware,
  getClientSessions
);

// ==========================================
// THERAPIST ROUTES
// ==========================================

router.use(authMiddleware);

// Create session
router.post("/", createSession);

// Get all therapist sessions
router.get("/", getSessions);

// Get one session
router.get("/:id", getSessionById);

// Update session
router.put("/:id", updateSession);

// Delete session
router.delete("/:id", deleteSession);

module.exports = router;