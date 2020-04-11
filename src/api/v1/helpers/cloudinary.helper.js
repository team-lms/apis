const cloudinary = require('cloudinary').v2;
const fs = require('fs');

module.exports = {
  upload: async ({ filePath, tags }) => {
    cloudinary.config({
      cloud_name: process.env.CL_CLOUD_NAME,
      api_key: process.env.CL_API_KEY,
      api_secret: process.env.CL_API_SECRET
    });
    const cloudinaryResonse = await cloudinary.uploader.upload(filePath, { tags });
    (async () => fs.unlinkSync(filePath))();
    return cloudinaryResonse;
  }
};
