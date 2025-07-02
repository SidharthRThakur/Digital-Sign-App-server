const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  uploadDocument,
  getDocument,
  getAllDocuments,
} = require("../controllers/docController");

const authMiddleware = require("../Middlewares/authMiddleware");

// File Upload Config (Multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 📤 Upload PDF
router.post("/upload", authMiddleware, upload.single("pdf"), uploadDocument);

// 📄 Get PDF by ID
router.get("/:id", authMiddleware, getDocument);

// 📄 Get all uploaded PDFs by logged-in user
router.get("/", authMiddleware, getAllDocuments);

module.exports = router;
