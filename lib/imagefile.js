const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file và tên file
const uploadDir = path.join(__dirname, "../../frontend/public/images");
if (!require("fs").existsSync(uploadDir)) {
  require("fs").mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // thư mục lưu file
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Xóa ảnh dùng fs.unklink(file.path)

const upload = multer({ storage: storage });
module.exports = upload;