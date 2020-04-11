const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, `../../../../${process.env.TEMP_PROFILE_DEST}`));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
    const extName = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${uniqueSuffix + extName}`);
  }
});

module.exports = {
  checkAndCreateDir: (req, res, next) => {
    const directory = path.join(__dirname, `../../../../${process.env.TEMP_PROFILE_DEST}`);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, {
        recursive: true,
        mode: process.env.TEMP_PROFILE_DIR_MODE
      });
    }
    next();
  },
  upload: () => multer({ storage })
};
