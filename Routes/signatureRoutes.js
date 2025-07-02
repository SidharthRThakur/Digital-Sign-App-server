const express = require("express");
const router = express.Router();
const {
  saveSignature,
  getSignaturesByDocument,
  finalizeSignatures,
  exportFinalizedPDF,
} = require("../Controllers/signatureController");

const authMiddleware = require("../Middlewares/authMiddleware");

// ✅ Save a new signature
router.post("/", authMiddleware, saveSignature);

// ✅ Get all signatures
router.get("/", authMiddleware, getSignaturesByDocument);

// ✅ Finalize signatures for a document
router.post("/finalize", authMiddleware, finalizeSignatures);

// ✅ Export final signed PDF (auth via token in query)
router.get("/export/:documentId", exportFinalizedPDF);

module.exports = router;
