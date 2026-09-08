const { Resend } = require("resend");

function getClient() {
  const required = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "NOTIFY_EMAIL"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Email service is not configured. Missing: ${missing.join(", ")}`);
  }

  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function leadHtml(title, data) {
  const rows = Object.entries(data)
    .filter(([, value]) => value)
    .map(([key, value]) => `<tr><td style="padding:8px 12px;font-weight:700;text-transform:capitalize">${escapeHtml(key)}</td><td style="padding:8px 12px">${escapeHtml(value)}</td></tr>`)
    .join("");

  return `<div style="font-family:Arial,sans-serif;color:#17251d"><h2>${title}</h2><table style="border-collapse:collapse">${rows}</table></div>`;
}

async function sendLeadEmail(title, data) {
  const resend = getClient();
  const { data: email, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: [process.env.NOTIFY_EMAIL],
    replyTo: data.email || undefined,
    subject: `${title} - ${data.name}`,
    html: leadHtml(title, data),
  });

  if (error) throw new Error(error.message || "Resend email failed.");
  return email;
}

module.exports = { sendLeadEmail };
