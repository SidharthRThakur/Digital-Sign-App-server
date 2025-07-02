const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
// This code defines a Mongoose schema for a Document model in a Node.js application.
// The schema includes fields for the document's name, file path, the user who uploaded it,
// and the creation date. The `uploadedBy` field references the User model, establishing a relationship
// between the Document and User models.
