const bcrypt = require("bcryptjs");
const Therapist = require("../models/Therapist");

const changeTherapistPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
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

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    therapist.password_hash = newPasswordHash;

    await therapist.save();

    console.log(
      `✅ Therapist password changed: ${therapist.email}`
    );

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change therapist password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password.",
    });
  }
};

module.exports = {
  changeTherapistPassword,
};