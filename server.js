// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST route to get a quote
app.post("/generate-quote", async (req, res) => {
  const { mood } = req.body;

  if (!mood) {
    return res.status(400).json({ error: "Mood is required" });
  }

  const prompt = `Give me one short, meaningful, original quote for someone who is feeling "${mood}" with appropriate emojis. Only return the quote itself, no explanation or author.`;

  try {
    const result = await model.generateContent([prompt]);
    const quote = result.response.text().trim();
    res.json({ quote });
  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    res.status(500).json({ error: "Failed to generate quote" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Gemini server running at http://localhost:${PORT}`);
});
