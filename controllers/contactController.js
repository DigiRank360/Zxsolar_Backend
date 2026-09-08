const { sendLeadEmail } = require("../services/mailService");
const { validateLead } = require("../utils/validation");
const ContactRequest = require("../models/ContactRequest");

async function submitContact(req, res) {
  const { data, errors } = validateLead(req.body);
  if (Object.keys(errors).length) return res.status(400).json({ message: "Please check the submitted details.", errors });

  try {
    const contactRequest = await ContactRequest.create(data);
    let emailStatus = "failed";

    try {
      await sendLeadEmail("New Contact Request", data);
      emailStatus = "sent";
    } catch (emailError) {
      console.error("Contact email error:", emailError.message);
    }

    await ContactRequest.findByIdAndUpdate(contactRequest._id, { emailStatus });
    return res.status(201).json({ message: "Thank you. Our solar expert will contact you shortly." });
  } catch (error) {
    console.error("Contact save error:", error.message);
    return res.status(503).json({ message: "We could not save your request right now. Please try again." });
  }
}

module.exports = { submitContact };
