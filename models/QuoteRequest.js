const mongoose = require("mongoose");

const quoteRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    pinCode: { type: String, trim: true, maxlength: 20 },
    propertyType: { type: String, required: true, trim: true, maxlength: 80 },
    monthlyBill: { type: String, required: true, trim: true, maxlength: 80 },
    agreeTerms: { type: Boolean, default: false },
    emailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuoteRequest", quoteRequestSchema);
