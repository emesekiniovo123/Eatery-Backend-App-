const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Successfully connected to MongoDB Atlas!");

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (err) {
    console.error("❌ Connection failed");
    console.error(err);
  }
}

testConnection();
