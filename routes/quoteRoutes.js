const express = require("express");
const { submitQuote } = require("../controllers/quoteController");

const router = express.Router();
router.post("/", submitQuote);

module.exports = router;
