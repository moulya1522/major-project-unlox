const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("⚠️ MONGO_URI is not configured yet.");
      console.log("⚠️ Backend will continue running without MongoDB.");
      return false;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🗄️ MongoDB connected: ${conn.connection.host}`);

    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);

    return false;
  }
};

module.exports = connectDB;