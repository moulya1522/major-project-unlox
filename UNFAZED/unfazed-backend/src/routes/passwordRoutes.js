const express = require("express");

const {
  changeTherapistPassword,
} = require("../controllers/passwordController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/change-password",
  authMiddleware,
  changeTherapistPassword
);

module.exports = router;