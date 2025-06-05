const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");
const crypto = require("crypto");
require('dotenv').config();

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET
});

// Helper function to generate random string
const generateRandomName = (bytes = 16) => {
  return crypto.randomBytes(bytes).toString('hex');
};

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Get file extension
    const fileExtension = localFilePath.split('.').pop();
    
    // Generate random name with original extension
    const publicId = `file_${generateRandomName()}_${Date.now()}.${fileExtension}`;
    
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      public_id: publicId, // Set custom public ID
      overwrite: false, // Prevent overwriting existing files
      unique_filename: true // Ensure unique filenames
    });
    
    fs.unlinkSync(localFilePath); // Delete from local
    return response;
    
  } catch (error) {
    // Clean up local file if it exists
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
  }
};

module.exports = { uploadOnCloudinary };