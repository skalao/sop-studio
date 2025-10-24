require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSOP(rawText) {
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
    throw err;
  }
}

module.exports = { generateSOP };
