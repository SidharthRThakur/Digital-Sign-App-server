// server/Models/Signature.js

const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    x: {
      type: Number,
      required: true,
      min: 0,
    },
    y: {
      type: Number,
      required: true,
      min: 0,
    },
    width: {
      type: Number,
      default: 100,
    },
    height: {
      type: Number,
      default: 40,
    },
    page: {
      type: Number,
      required: true,
      min: 0,
    },
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    finalized: {
      type: Boolean,
      default: false, // ✅ Added for backend export filtering
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Signature", signatureSchema);
