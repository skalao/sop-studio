// db.js — fully functional mock DB for Render
let mockData = [
  { id: 1, title: "Mock SOP", description: "Running on mock DB 🧠" },
];

module.exports = {
  query: async (sql, params) => {
    console.log("⚙️ Mock DB Query:", sql, params);

    // SELECT ALL
    if (sql.startsWith("SELECT")) {
      return { rows: mockData };
    }

    // INSERT
    if (sql.startsWith("INSERT")) {
      const newSop = {
        id: mockData.length ? mockData[mockData.length - 1].id + 1 : 1,
        title: params[0],
        description: params[1],
      };
      mockData.push(newSop);
      return { rows: [newSop] };
    }

    // UPDATE
    if (sql.startsWith("UPDATE")) {
      const id = params[2];
      const found = mockData.find((s) => s.id == id);
      if (found) {
        found.title = params[0];
        found.description = params[1];
        return { rows: [found] };
      }
      return { rows: [] };
    }

    // DELETE
    if (sql.startsWith("DELETE")) {
      const id = params[0];
      const index = mockData.findIndex((s) => s.id == id);
      if (index !== -1) {
        const deleted = mockData.splice(index, 1);
        console.log("🗑️ Deleted mock SOP:", deleted[0]);
        return { rows: deleted };
      }
      return { rows: [] };
    }

    return { rows: [] };
  },
};
