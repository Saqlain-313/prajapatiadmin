const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 4096 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;
