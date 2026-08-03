const mongoose = require("mongoose");
require("dotenv").config();

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URI:", process.env.MONGO_URI);

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
