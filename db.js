// 🧩 Persistent (in-memory) mock DB for Render
let mockData = [
  { id: 1, title: "Mock SOP", description: "Running on mock DB 🧠" },
];

module.exports = {
  query: async (sql, params) => {
    console.log("⚙️ Mock DB query:", sql, params);

    // Select all SOPs
    if (sql.startsWith("SELECT")) {
      return { rows: mockData };
    }

    // Insert SOP
    if (sql.startsWith("INSERT")) {
      const newSop = {
        id: mockData.length + 1,
        title: params[0],
        description: params[1],
      };
      mockData.unshift(newSop);
      return { rows: [newSop] };
    }

    // Update SOP
    if (sql.startsWith("UPDATE")) {
      const id = params[2];
      const updated = mockData.find((s) => s.id == id);
      if (updated) {
        updated.title = params[0];
        updated.description = params[1];
      }
      return { rows: updated ? [updated] : [] };
    }

    // Delete SOP
    if (sql.startsWith("DELETE")) {
      const id = params[0];
      mockData = mockData.filter((s) => s.id != id);
      return { rows: [] };
    }

    // Default fallback
    return { rows: [] };
  },
};
