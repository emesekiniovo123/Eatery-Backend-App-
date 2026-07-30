
require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
const uri = process.env.MONGO_URI;

console.log("Mongo URI:", process.env.MONGO_URI);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas");

    // Optional: Verify the connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping successful");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}

connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to online eatery server app");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

