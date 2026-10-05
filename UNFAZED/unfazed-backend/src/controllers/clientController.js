const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Client = require("../models/Client");

// Create a new client
const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      concern,
      intakeSummary,
      consentGiven,
      status,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required.",
      });
    }

    const normalizedEmail = email
      ? email.toLowerCase().trim()
      : undefined;

    const hasConsent = Boolean(consentGiven);

    const client = await Client.create({
      therapist: req.therapist._id,
      name: name.trim(),
      email: normalizedEmail,
      phone,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      concern,
      intakeSummary,
      consentGiven: hasConsent,
      consentTimestamp: hasConsent ? new Date() : null,
      status: status || "active",
      isPortalActive: false,
      password_hash: null,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully.",
      client,
    });
  } catch (error) {
    console.error("Create client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create client.",
    });
  }
};

// Get all clients of logged-in therapist
const getClients = async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {
      therapist: req.therapist._id,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await Client.find(filter)
      .select("-password_hash")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch clients.",
    });
  }
};

// Get one client
const getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    }).select("-password_hash");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Get client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch client.",
    });
  }
};

// Update client
const updateClient = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      concern,
      intakeSummary,
      consentGiven,
      status,
    } = req.body;

    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Client name cannot be empty.",
        });
      }

      client.name = name.trim();
    }

    if (email !== undefined) {
      client.email = email
        ? email.toLowerCase().trim()
        : "";
    }

    if (phone !== undefined) {
      client.phone = phone;
    }

    if (dateOfBirth !== undefined) {
      client.dateOfBirth = dateOfBirth || null;
    }

    if (gender !== undefined) {
      client.gender = gender;
    }

    if (concern !== undefined) {
      client.concern = concern;
    }

    if (intakeSummary !== undefined) {
      client.intakeSummary = intakeSummary;
    }

    if (status !== undefined) {
      client.status = status;
    }

    if (consentGiven !== undefined) {
      const newConsentValue = Boolean(consentGiven);

      if (newConsentValue && !client.consentGiven) {
        client.consentTimestamp = new Date();
      }

      if (!newConsentValue) {
        client.consentTimestamp = null;
      }

      client.consentGiven = newConsentValue;
    }

    await client.save();

    const safeClient = client.toObject();
    delete safeClient.password_hash;

    res.json({
      success: true,
      message: "Client updated successfully.",
      client: safeClient,
    });
  } catch (error) {
    console.error("Update client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update client.",
    });
  }
};

// Delete client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.json({
      success: true,
      message: "Client deleted successfully.",
    });
  } catch (error) {
    console.error("Delete client error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete client.",
    });
  }
};

// Activate client portal
const activateClientPortal = async (req, res) => {
  try {
    const { password } = req.body;

    const cleanPassword =
      typeof password === "string" ? password.trim() : "";

    if (!cleanPassword || cleanPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Portal password must be at least 6 characters.",
      });
    }

    const client = await Client.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    if (!client.email || !client.email.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Client must have an email address before portal activation.",
      });
    }

    const passwordHash = await bcrypt.hash(cleanPassword, 10);

    client.email = client.email.toLowerCase().trim();
    client.password_hash = passwordHash;
    client.isPortalActive = true;
    client.status = "active";

    await client.save();

    console.log(
      `✅ Client portal activated for: ${client.email}`
    );

    res.json({
      success: true,
      message: "Client portal activated successfully.",
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        isPortalActive: client.isPortalActive,
      },
    });
  } catch (error) {
    console.error("Activate client portal error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to activate client portal.",
    });
  }
};

// Client login
const clientLogin = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.toLowerCase().trim()
        : "";

    const password =
      typeof req.body.password === "string"
        ? req.body.password.trim()
        : "";

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    console.log(`🔐 Client login attempt: ${email}`);

    // Find client by email first
    const client = await Client.findOne({
      email,
    });

    if (!client) {
      console.log("❌ Client email not found.");
      return res.status(401).json({
        success: false,
        message: "Invalid client email or password.",
      });
    }

    if (!client.isPortalActive) {
      console.log("❌ Client portal is not active.");
      return res.status(403).json({
        success: false,
        message:
          "Client portal is not activated. Ask the therapist to activate it.",
      });
    }

    if (!client.password_hash) {
      console.log("❌ Client has no portal password.");
      return res.status(401).json({
        success: false,
        message: "Client portal password has not been set.",
      });
    }

    if (client.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Client account is inactive.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      client.password_hash
    );

    if (!passwordMatch) {
      console.log("❌ Client password does not match.");
      return res.status(401).json({
        success: false,
        message: "Invalid client email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: client._id,
        role: "client",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(`✅ Client login successful: ${client.email}`);

    res.json({
      success: true,
      message: "Client login successful.",
      token,
      client: {
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        therapist: client.therapist,
        isPortalActive: client.isPortalActive,
      },
    });
  } catch (error) {
    console.error("Client login error:", error);

    res.status(500).json({
      success: false,
      message: "Client login failed.",
    });
  }
};

// Get logged-in client's portal profile
const getClientPortalProfile = async (req, res) => {
  try {
    const client = await Client.findById(req.client._id)
      .select("-password_hash")
      .populate("therapist", "name email slug");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client profile not found.",
      });
    }

    res.json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Get client portal profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load client portal.",
    });
  }
};

module.exports = {
  createClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient,
  activateClientPortal,
  clientLogin,
  getClientPortalProfile,
};