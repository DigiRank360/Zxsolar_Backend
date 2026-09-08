const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    city: { type: String, trim: true, maxlength: 100 },
    pinCode: { type: String, trim: true, maxlength: 20 },
    message: { type: String, trim: true, maxlength: 2000 },
    emailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", contactRequestSchema);
