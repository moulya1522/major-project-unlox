const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const therapist = await Therapist.findById(decoded.id).select(
      "-password_hash"
    );

    if (!therapist) {
      return res.status(401).json({
        success: false,
        message: "Therapist account not found.",
      });
    }

    if (!therapist.isActive) {
      return res.status(403).json({
        success: false,
        message: "Therapist account is inactive.",
      });
    }

    req.therapist = therapist;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = protect;