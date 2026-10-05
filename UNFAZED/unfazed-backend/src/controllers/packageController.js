const Package = require("../models/Package");

// Create package
const createPackage = async (req, res) => {
  try {
    const therapistId = req.therapist._id;

    const {
      name,
      sessions,
      price,
      description,
    } = req.body;

    if (!name || !sessions || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, sessions and price are required.",
      });
    }

    if (![3, 6, 12].includes(Number(sessions))) {
      return res.status(400).json({
        success: false,
        message: "Sessions must be 3, 6 or 12.",
      });
    }

    if (Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative.",
      });
    }

    const packageData = await Package.create({
      therapist: therapistId,
      name: name.trim(),
      sessions: Number(sessions),
      price: Number(price),
      description: description?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "Package created successfully.",
      package: packageData,
    });
  } catch (error) {
    console.error("Create package error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to create package.",
    });
  }
};


// Get all packages
const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({
      therapist: req.therapist._id,
    }).sort({ sessions: 1 });

    res.json({
      success: true,
      count: packages.length,
      packages,
    });
  } catch (error) {
    console.error("Get packages error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch packages.",
    });
  }
};


// Get one package
const getPackageById = async (req, res) => {
  try {
    const packageData = await Package.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    res.json({
      success: true,
      package: packageData,
    });
  } catch (error) {
    console.error("Get package error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch package.",
    });
  }
};


// Update package
const updatePackage = async (req, res) => {
  try {
    const packageData = await Package.findOne({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    const {
      name,
      sessions,
      price,
      description,
      isActive,
    } = req.body;

    if (sessions !== undefined) {
      if (![3, 6, 12].includes(Number(sessions))) {
        return res.status(400).json({
          success: false,
          message: "Sessions must be 3, 6 or 12.",
        });
      }

      packageData.sessions = Number(sessions);
    }

    if (name !== undefined) {
      packageData.name = name.trim();
    }

    if (price !== undefined) {
      if (Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative.",
        });
      }

      packageData.price = Number(price);
    }

    if (description !== undefined) {
      packageData.description = description.trim();
    }

    if (isActive !== undefined) {
      packageData.isActive = Boolean(isActive);
    }

    await packageData.save();

    res.json({
      success: true,
      message: "Package updated successfully.",
      package: packageData,
    });
  } catch (error) {
    console.error("Update package error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to update package.",
    });
  }
};


// Delete package
const deletePackage = async (req, res) => {
  try {
    const packageData = await Package.findOneAndDelete({
      _id: req.params.id,
      therapist: req.therapist._id,
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    res.json({
      success: true,
      message: "Package deleted successfully.",
    });
  } catch (error) {
    console.error("Delete package error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Unable to delete package.",
    });
  }
};


module.exports = {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};