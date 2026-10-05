const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, maxLength = 500) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validateLead(body) {
  const data = {
    name: clean(body.name, 100),
    email: clean(body.email, 160).toLowerCase(),
    phone: clean(body.phone, 40),
    city: clean(body.city, 100),
    pinCode: clean(body.pinCode, 20),
    propertyType: clean(body.propertyType, 80),
    monthlyBill: clean(body.monthlyBill, 80),
    message: clean(body.message, 2000),
  };

  const errors = {};
  if (!data.name) errors.name = "Name is required.";
  if (data.email && !emailPattern.test(data.email)) errors.email = "Enter a valid email address.";
  if (data.phone && data.phone.replace(/\D/g, "").length < 10) errors.phone = "Enter a valid phone number.";

  return { data, errors };
}

function validateReferral(body) {
  const data = {
    referrerName: clean(body.referrerName, 100),
    referrerPhone: clean(body.referrerPhone, 20),
    referrerEmail: clean(body.referrerEmail, 160).toLowerCase(),
    friendName: clean(body.friendName, 100),
    friendPhone: clean(body.friendPhone, 20),
    friendEmail: clean(body.friendEmail, 160).toLowerCase(),
    city: clean(body.city, 100),
    pinCode: clean(body.pinCode, 6),
    serviceType: clean(body.serviceType, 80),
    monthlyBill: clean(body.monthlyBill, 40),
    consent: body.consent === true,
  };

  const errors = {};
  for (const field of ["referrerName", "referrerPhone", "referrerEmail", "friendName", "friendPhone", "friendEmail", "city", "pinCode", "serviceType", "monthlyBill"]) {
    if (!data[field]) errors[field] = "This field is required.";
  }
  if (data.referrerPhone && !/^[6-9][0-9]{9}$/.test(data.referrerPhone)) errors.referrerPhone = "Enter a valid 10-digit mobile number.";
  if (data.friendPhone && !/^[6-9][0-9]{9}$/.test(data.friendPhone)) errors.friendPhone = "Enter a valid 10-digit mobile number.";
  if (data.referrerEmail && !emailPattern.test(data.referrerEmail)) errors.referrerEmail = "Enter a valid email address.";
  if (data.friendEmail && !emailPattern.test(data.friendEmail)) errors.friendEmail = "Enter a valid email address.";
  if (data.pinCode && !/^[0-9]{6}$/.test(data.pinCode)) errors.pinCode = "Enter a valid 6-digit pincode.";
  if (data.serviceType && !["Residential rooftop solar", "Housing society solar", "Commercial or industrial solar"].includes(data.serviceType)) errors.serviceType = "Select a valid service type.";
  if (data.monthlyBill && !["₹0 - ₹3,000", "₹3,000 - ₹5,000", "₹5,000 - ₹8,000", "₹8,000 - ₹12,000", "₹12,000+"].includes(data.monthlyBill)) errors.monthlyBill = "Select a valid monthly bill range.";
  if (!data.consent) errors.consent = "Consent is required before submitting a referral.";

  return { data, errors };
}

function validateChat(body) {
  const message = clean(body.message, 2000);
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  return {
    message,
    history: history.filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string"),
  };
}

module.exports = { validateLead, validateReferral, validateChat };
