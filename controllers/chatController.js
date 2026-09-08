const { generateReply } = require("../services/aiService");
const { validateChat } = require("../utils/validation");
const ChatConversation = require("../models/ChatConversation");
const { randomUUID } = require("node:crypto");

async function chat(req, res) {
  const { message, history } = validateChat(req.body);
  if (!message) return res.status(400).json({ message: "A message is required." });

  try {
    const reply = await generateReply(message, history);
    const sessionId = req.body.sessionId || req.get("x-session-id") || randomUUID();
    await ChatConversation.findOneAndUpdate(
      { sessionId },
      { $push: { messages: [{ role: "user", content: message }, { role: "assistant", content: reply }] } },
      { upsert: true, new: true }
    );
    return res.json({ reply, sessionId });
  } catch (error) {
    console.error("Chatbot error:", error.message);
    return res.status(503).json({ message: "The assistant is temporarily unavailable. Please contact ZXSOLAR directly." });
  }
}

module.exports = { chat };
