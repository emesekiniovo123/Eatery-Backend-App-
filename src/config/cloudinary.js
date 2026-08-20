const { v2: cloudinary } = require("cloudinary");

// Configure lazily so dotenv has always loaded before this runs
const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  });
  return cloudinary;
};

module.exports = getCloudinary();