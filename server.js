require("dotenv").config();

const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const contactRoutes = require("./routes/contactRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "32kb" }));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

app.get("/", (req, res) => {
  res.json({ name: "ZXSOLAR API", status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "zxsolar-backend" });
});

app.use("/api", apiLimiter);
app.use("/api/contact", contactRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/chat", chatRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

async function startServer() {
  await connectDB();
  app.listen(port, () => {
    console.log(`ZXSOLAR API is running on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});