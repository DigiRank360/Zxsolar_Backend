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

function validateChat(body) {
  const message = clean(body.message, 2000);
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
  return {
    message,
    history: history.filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string"),
  };
}

module.exports = { validateLead, validateChat };
