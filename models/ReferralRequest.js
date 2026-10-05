const mongoose = require("mongoose");

const referralRequestSchema = new mongoose.Schema(
  {
    referrerName: { type: String, required: true, trim: true, maxlength: 100 },
    referrerPhone: { type: String, required: true, trim: true, maxlength: 20 },
    referrerEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    friendName: { type: String, required: true, trim: true, maxlength: 100 },
    friendPhone: { type: String, required: true, trim: true, maxlength: 20 },
    friendEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    pinCode: { type: String, required: true, trim: true, match: /^[0-9]{6}$/ },
    serviceType: { type: String, required: true, enum: ["Residential rooftop solar", "Housing society solar", "Commercial or industrial solar"] },
    monthlyBill: { type: String, required: true, enum: ["₹0 - ₹3,000", "₹3,000 - ₹5,000", "₹5,000 - ₹8,000", "₹8,000 - ₹12,000", "₹12,000+"] },
    consent: { type: Boolean, required: true, default: false },
    emailStatus: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReferralRequest", referralRequestSchema);