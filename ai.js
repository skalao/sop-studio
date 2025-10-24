// ai.js — Safe version (won’t crash if OPENAI_API_KEY missing)

let generateSOP = async (text) => {
  console.log("⚠️ AI not available — returning placeholder.");
  return `AI is disabled. You entered: "${text}"`;
};

// Only load OpenAI if API key exists
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  generateSOP = async (text) => {
    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an SOP generator." },
          { role: "user", content: text },
        ],
      });
      return response.choices[0].message.content;
    } catch (err) {
      console.error("❌ AI generation failed:", err.message);
      return "AI error — unable to generate SOP.";
    }
  };
}

module.exports = { generateSOP };
