const cloudinary = require('cloudinary').v2;

module.exports = {
  upload: ({ filePath, tags }) => {
    cloudinary.config({
      cloud_name: process.env.CL_CLOUD_NAME,
      api_key: process.env.CL_API_KEY,
      api_secret: process.env.CL_API_SECRET
    });
    return cloudinary.uploader.upload(filePath, { tags });
  }
};
