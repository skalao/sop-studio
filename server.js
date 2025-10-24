require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// 🧠 Optional AI import (safe if API key missing)
let generateSOP = null;
try {
  if (process.env.OPENAI_API_KEY) {
    ({ generateSOP } = require("./ai"));
    console.log("🧠 AI module loaded successfully.");
  } else {
    console.log("⚠️ OPENAI_API_KEY not found — AI features disabled.");
  }
} catch (err) {
  console.log("⚠️ Failed to load AI module:", err.message);
}

// === Middleware ===
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// === Routes ===

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend running fine and CORS open.");
});

// Fetch all SOPs
app.get("/sop", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sops ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching SOPs:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Add new SOP
app.post("/sop", async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      "INSERT INTO sops (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting SOP:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Update SOP
app.put("/sop/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE sops SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "SOP not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error updating SOP:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete SOP
app.delete("/sop/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM sops WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "SOP not found" });
    }
    res.json({ message: "🗑️ SOP deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting SOP:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// AI route (won’t break if AI unavailable)
app.post("/ai/sop", async (req, res) => {
  try {
    const { text } = req.body;
    if (!generateSOP) {
      return res.status(503).json({ error: "AI not connected" });
    }
    const result = await generateSOP(text);
    res.json({ sop: result });
  } catch (err) {
    console.error("❌ AI generation failed:", err.message);
    res.status(500).json({ error: "AI unavailable" });
  }
});

// === Server start ===
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server live on port ${PORT}`);
});
