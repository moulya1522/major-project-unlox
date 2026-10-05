const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Therapist = require("../models/Therapist");
const generateSlug = require("../utils/generateSlug");

const createToken = (therapistId) => {
  return jwt.sign(
    {
      id: therapistId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// REGISTER
const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      bio,
      specializations,
      languages,
      phone,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingTherapist = await Therapist.findOne({
      email: normalizedEmail,
    });

    if (existingTherapist) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    let slug = generateSlug(name);

    const existingSlug = await Therapist.findOne({ slug });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    const therapist = await Therapist.create({
      name,
      email: normalizedEmail,
      password_hash,
      slug,
      bio: bio || "",
      specializations: Array.isArray(specializations)
        ? specializations
        : [],
      languages: Array.isArray(languages) ? languages : [],
      phone: phone || "",
    });

    const token = createToken(therapist._id);

    res.status(201).json({
      success: true,
      message: "Therapist account created successfully.",
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        bio: therapist.bio,
        specializations: therapist.specializations,
        languages: therapist.languages,
        phone: therapist.phone,
        subscriptionTier: therapist.subscriptionTier,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create therapist account.",
      error: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const therapist = await Therapist.findOne({
      email: normalizedEmail,
    });

    if (!therapist) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      therapist.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!therapist.isActive) {
      return res.status(403).json({
        success: false,
        message: "This account is currently inactive.",
      });
    }

    const token = createToken(therapist._id);

    res.json({
      success: true,
      message: "Login successful.",
      token,
      therapist: {
        id: therapist._id,
        name: therapist.name,
        email: therapist.email,
        slug: therapist.slug,
        bio: therapist.bio,
        specializations: therapist.specializations,
        languages: therapist.languages,
        phone: therapist.phone,
        subscriptionTier: therapist.subscriptionTier,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to login.",
      error: error.message,
    });
  }
};

// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 6 characters.",
      });
    }

    const therapist = await Therapist.findById(req.therapist._id);

    if (!therapist) {
      return res.status(404).json({
        success: false,
        message: "Therapist account not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      therapist.password_hash
    );

    // IMPORTANT:
    // Return 400 instead of 401 so the frontend does NOT
    // automatically remove the therapist login token.
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      therapist.password_hash
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password.",
      });
    }

    therapist.password_hash = await bcrypt.hash(newPassword, 10);

    await therapist.save();

    res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to change password.",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  changePassword,
};