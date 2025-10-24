// 🔮 Temporary mock database for Render testing (no Postgres needed)
module.exports = {
  query: async (sql, params) => {
    console.log("⚙️ Mock DB query called:", sql, params);

    // Select all
    if (sql.startsWith("SELECT")) {
      return { rows: [{ id: 1, title: "Mock SOP", description: "Running on mock DB 🧠" }] };
    }

    // Insert
    if (sql.startsWith("INSERT")) {
      return { rows: [{ id: Date.now(), title: params[0], description: params[1] }] };
    }

    // Update
    if (sql.startsWith("UPDATE")) {
      return { rows: [{ id: params[2], title: params[0], description: params[1] }] };
    }

    // Delete
    if (sql.startsWith("DELETE")) {
      return { rows: [] };
    }

    // Fallback
    return { rows: [] };
  },
};
