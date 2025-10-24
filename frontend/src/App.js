import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// 🌍 Use environment variable for backend URL (fallback for localhost)
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:3000";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("sopstudio:dark");
    return saved ? JSON.parse(saved) : false;
  });

  const [sops, setSops] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingSop, setEditingSop] = useState(null);

  useEffect(() => {
    localStorage.setItem("sopstudio:dark", JSON.stringify(darkMode));
  }, [darkMode]);

  // === Fetch SOPs ===
  const fetchSops = async () => {
    try {
      const res = await fetch(`${API}/sop`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setSops(data);
      } else {
        console.warn("⚠️ Unexpected data:", data);
        setSops([]);
      }
    } catch (err) {
      console.error("❌ Error fetching SOPs:", err);
      toast.error("Could not load SOPs");
      setSops([]);
    }
  };

  // === Add / Update SOP ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingSop ? "PUT" : "POST";
      const url = editingSop
        ? `${API}/sop/${editingSop.id}`
        : `${API}/sop`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error("Server error");

      setTitle("");
      setDescription("");
      setEditingSop(null);
      await fetchSops();
      toast.success(editingSop ? "SOP updated!" : "SOP added!");
    } catch (err) {
      console.error("❌ Error saving SOP:", err);
      toast.error("Something went wrong!");
    }
  };

  // === Delete SOP ===
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this SOP?")) return;
    try {
      const res = await fetch(`${API}/sop/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSops((prev) => prev.filter((s) => s.id !== id));
      toast.success("SOP deleted!");
    } catch (err) {
      console.error("❌ Error deleting SOP:", err);
      toast.error("Could not delete SOP");
    }
  };

  const handleEdit = (sop) => {
    setEditingSop(sop);
    setTitle(sop.title);
    setDescription(sop.description);
  };

  useEffect(() => {
    fetchSops();
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""} min-h-screen`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-8">
        {/* Title Bar */}
        <div className="w-full max-w-md flex items-center justify-between mb-8">
          <motion.h1
            className="text-4xl font-bold text-blue-600 dark:text-blue-300"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SOP Studio 🧠
          </motion.h1>

          <Button
            variant="secondary"
            onClick={() => setDarkMode((v) => !v)}
            className="text-sm"
            title="Toggle dark mode"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </Button>
        </div>

        <Toaster position="top-center" />

        {/* Input Form */}
        <Card className="w-full max-w-md mb-8 bg-white dark:bg-gray-800">
          <CardContent className="space-y-4 p-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button type="submit">
                  {editingSop ? "Update SOP" : "Add SOP"}
                </Button>
                {editingSop && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingSop(null);
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* SOP List */}
        <div className="w-full max-w-md space-y-4">
          <AnimatePresence>
            {Array.isArray(sops) && sops.length > 0 ? (
              sops.map((sop) => (
                <motion.div
                  key={sop.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="flex justify-between items-start p-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {sop.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {sop.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 text-sm">
                        <Button variant="link" onClick={() => handleEdit(sop)}>
                          Edit
                        </Button>
                        <Button
                          variant="link"
                          className="text-red-500"
                          onClick={() => handleDelete(sop.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-300">
                No SOPs available 📝
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;
