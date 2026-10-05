const { sendLeadEmail } = require("../services/mailService");
const { validateReferral } = require("../utils/validation");
const ReferralRequest = require("../models/ReferralRequest");

async function submitReferral(req, res) {
  const { data, errors } = validateReferral(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ message: "Please check the submitted referral details.", errors });
  }

  try {
    const referral = await ReferralRequest.create(data);
    let emailStatus = "failed";

    try {
      await sendLeadEmail("New Refer & Earn Submission", data);
      emailStatus = "sent";
    } catch (emailError) {
      console.error("Referral email error:", emailError.message);
    }

    await ReferralRequest.findByIdAndUpdate(referral._id, { emailStatus });
    return res.status(201).json({ message: "Thank you. Your referral was received and our team will verify the details." });
  } catch (error) {
    console.error("Referral save error:", error.message);
    return res.status(503).json({ message: "We could not save your referral right now. Please try again." });
  }
}

module.exports = { submitReferral };