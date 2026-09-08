const { sendLeadEmail } = require("../services/mailService");
const { validateLead } = require("../utils/validation");
const QuoteRequest = require("../models/QuoteRequest");

async function submitQuote(req, res) {
  const { data, errors } = validateLead(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Please check the submitted quote details.", errors });

  if (!data.phone || !data.city || !data.propertyType || !data.monthlyBill) {
    return res.status(400).json({ message: "Phone, city, property type and monthly electricity bill are required." });
  }

  try {
    const quoteRequest = await QuoteRequest.create({ ...data, agreeTerms: Boolean(req.body.agreeTerms) });
    let emailStatus = "failed";

    try {
      await sendLeadEmail("New Solar Quote Request", data);
      emailStatus = "sent";
    } catch (emailError) {
      console.error("Quote email error:", emailError.message);
    }

    await QuoteRequest.findByIdAndUpdate(quoteRequest._id, { emailStatus });
    return res.status(201).json({ message: "Your quote request was received. Our expert will contact you shortly." });
  } catch (error) {
    console.error("Quote save error:", error.message);
    return res.status(503).json({ message: "We could not save your quote request right now. Please try again." });
  }
}

module.exports = { submitQuote };
