const express = require("express");

const {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  activateClientPortal,
  clientLogin,
  getClientPortalProfile,
} = require("../controllers/clientController");

const authMiddleware = require("../middleware/authMiddleware");
const clientAuthMiddleware = require("../middleware/clientAuthMiddleware");

const router = express.Router();

// ===============================
// CLIENT PORTAL LOGIN
// ===============================

router.post("/portal/login", clientLogin);

// ===============================
// CLIENT PORTAL PROFILE
// ===============================

router.get(
  "/portal/me",
  clientAuthMiddleware,
  getClientPortalProfile
);

// ===============================
// THERAPIST AUTHENTICATION
// ===============================

router.use(authMiddleware);

// ===============================
// THERAPIST CLIENT MANAGEMENT
// ===============================

// Create client
router.post("/", createClient);

// Get all clients
router.get("/", getClients);

// Get single client
router.get("/:id", getClientById);

// Update client
router.put("/:id", updateClient);

// Delete client
router.delete("/:id", deleteClient);

// Activate client portal
router.post("/:id/activate-portal", activateClientPortal);

module.exports = router;