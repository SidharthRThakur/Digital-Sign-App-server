const path = require("path");
const Document = require("../Models/Document");

// 📤 Upload PDF
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const newDoc = new Document({
      name: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.user?.id,
    });

    await newDoc.save();
    res
      .status(201)
      .json({ success: true, message: "File uploaded", document: newDoc });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

// 📄 Get one PDF by ID
exports.getDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, document: doc });
  } catch (error) {
    console.error("Get Document Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch document" });
  }
};

// 📄 Get all PDFs uploaded by user
exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ uploadedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, documents: docs });
  } catch (error) {
    console.error("Fetch docs error:", error);
    res
      .status(500)
      .json({ success: false, message: "Could not fetch documents" });
  }
};
