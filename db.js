const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

// === Middleware ===
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

// === ROUTES ===

// 🩺 Health Check
app.get("/", (req, res) => {
  res.send("✅ SOP Studio backend is live (mock DB mode)");
});

// 📄 Fetch All SOPs
app.get("/sop", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM sops ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching SOPs:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ➕ Add SOP
app.post("/sop", async (req, res) => {
  try {
    const { title, description } = req.body;
    const result = await pool.query(
      "INSERT INTO sops (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting SOP:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ✏️ Update SOP
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

// 🗑️ Delete SOP
app.delete("/sop/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM sops WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "SOP not found" });
    }

    res.json({ message: "🗑️ SOP deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting SOP:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// === Start Server ===
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SOP Studio backend running on port ${PORT}`);
});
