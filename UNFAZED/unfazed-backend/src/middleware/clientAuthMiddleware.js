const jwt = require("jsonwebtoken");
const Client = require("../models/Client");

const clientAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Client authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "client") {
      return res.status(403).json({
        success: false,
        message: "Client access only.",
      });
    }

    const client = await Client.findById(decoded.id);

    if (!client) {
      return res.status(401).json({
        success: false,
        message: "Client account not found.",
      });
    }

    if (!client.isPortalActive) {
      return res.status(403).json({
        success: false,
        message: "Client portal is not activated.",
      });
    }

    if (client.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Client account is inactive.",
      });
    }

    req.client = client;

    next();
  } catch (error) {
    console.error("Client authentication error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired client token.",
    });
  }
};

module.exports = clientAuthMiddleware;