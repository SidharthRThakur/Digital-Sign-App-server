// server/Controllers/signatureController.js

const Signature = require("../Models/Signature");
const Document = require("../Models/Document");
const { PDFDocument, rgb } = require("pdf-lib"); // ✅ Fixed import
const fs = require("fs");
const path = require("path");

// ✅ Save a new signature
exports.saveSignature = async (req, res) => {
  try {
    const { x, y, width, height, page, documentId } = req.body;
    const userId = req.user?.id;

    if (!documentId || !userId) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const newSignature = new Signature({
      x,
      y,
      width,
      height,
      page,
      documentId,
      userId,
    });

    await newSignature.save();
    res.status(201).json({ success: true, signature: newSignature });
  } catch (err) {
    console.error("Signature Save Error:", err);
    res.status(500).json({ message: "Failed to save signature" });
  }
};

// ✅ Get all signatures for a document
exports.getSignaturesByDocument = async (req, res) => {
  try {
    const documentId = req.query.documentId;

    if (!documentId) {
      return res.status(400).json({ message: "Missing documentId" });
    }

    const signatures = await Signature.find({ documentId });
    res.json({ success: true, signatures });
  } catch (err) {
    console.error("Signature Fetch Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load signatures" });
  }
};

// ✅ Finalize all signatures for a document
exports.finalizeSignatures = async (req, res) => {
  try {
    const { documentId } = req.body;

    if (!documentId) {
      return res.status(400).json({ message: "Missing documentId" });
    }

    await Signature.updateMany({ documentId }, { $set: { finalized: true } });

    res.json({ success: true, message: "Signatures finalized" });
  } catch (err) {
    console.error("Finalize Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to finalize signatures" });
  }
};

// ✅ Export PDF with finalized signatures applied
exports.exportFinalizedPDF = async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({ message: "Missing documentId" });
    }

    const doc = await Document.findById(documentId);
    const signatures = await Signature.find({ documentId, finalized: true });

    if (!doc || signatures.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Document or signatures not found" });
    }

    const existingPdfBytes = fs.readFileSync(doc.filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const redColor = rgb(1, 0, 0); // ✅ FIXED here

    signatures.forEach((sig) => {
      const page = pdfDoc.getPage(sig.page);
      page.drawRectangle({
        x: sig.x,
        y: sig.y,
        width: sig.width,
        height: sig.height,
        color: redColor,
      });
    });

    const modifiedPdfBytes = await pdfDoc.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=signed_document.pdf",
    });

    res.send(modifiedPdfBytes);
  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ success: false, message: "Failed to export PDF" });
  }
};
