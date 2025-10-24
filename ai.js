require("dotenv").config();

let OpenAI = null;
let openai = null;

try {
  if (process.env.OPENAI_API_KEY) {
    OpenAI = require("openai");
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    console.log("🧠 OpenAI client loaded successfully.");
  } else {
    console.log("⚠️ No OPENAI_API_KEY found — AI features disabled.");
  }
} catch (err) {
  console.error("❌ Failed to initialize OpenAI:", err.message);
}

async function generateSOP(rawText) {
  // If AI is disabled, return fallback response
  if (!openai) {
    console.log("⚠️ AI not available — returning placeholder.");
    return `AI is currently disabled. You entered: "${rawText}"`;
  }

  try {
    const prompt = `
    Turn this messy workflow into a clear step-by-step SOP:
    "${rawText}"
    Format as:
    1. Step name - explanation
    2. Step name - explanation
    `;

    console.log("🧠 Sending prompt to OpenAI...");
    console.log("🔑 Using API key:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "❌ Missing!");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    console.log("✅ AI responded successfully!");
    return response.choices[0].message.content;
  } catch (err) {
    console.error("❌ AI ERROR DETAILS:");
    console.error(err.response ? err.response.data : err.message || err);
    return "⚠️ AI unavailable — please try again later.";
  }
}

module.exports = { generateSOP };
