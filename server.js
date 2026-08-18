require("dotenv").config();

const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const multer = require("multer");
const cloudinary = require("./config/cloudinary");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());


// Multer stores the uploaded file temporarily in memory
const upload = multer({ storage: multer.memoryStorage() });

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

//Call the async function 
connectDB();



// Routes
app.get("/", (req, res) => {
  res.send("Welcome to online eatery server app");
});


app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "online-eatery",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error(error);

          return res.status(500).json({
            success: false,
            message: "Image upload failed",
          });
        }

        res.status(200).json({
          success: true,
          message: "Image uploaded successfully",
          image: result.secure_url,
        });
      }
    );

    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

