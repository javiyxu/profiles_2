const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pool = mysql.createPool({
  host:"sql.freedb.tech",
  user:"u_EvoWmY",
  password:"KFBhQjUU69Ih",
  database: "freedb_uSTQk3lU",
  connectionLimit: 5,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

pool.getConnection((err, conn) => {
  if (err) {
    console.error("Database Connection Error: " + err.message);
    return;
  }
  console.log("Connected to MySQL database successfully.");
  conn.release();
});

// ---- READ: Get all profiles ----
app.get("/api/profiles", (req, res) => {
  pool.query("SELECT * FROM profiles ORDER BY id ASC", (err, rows) => {
    if (err) {
      console.error("Read Error:", err.message);
      return res.status(500).json({ error: "Internal server error reading profiles." });
    }
    res.status(200).json(rows);
  });
});

// ---- UPDATE: Edit an existing profile ----
app.put("/api/profiles/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: "name, email, and role are all required." });
  }

  pool.query(
    "UPDATE profiles SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
    (err, result) => {
      if (err) {
        console.error("Update Error:", err.message);
        return res.status(500).json({ error: "Internal server error updating profile." });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Profile not found." });
      }
      res.status(200).json({ msg: "Successfully updated!" });
    }
  );
});

// ---- DELETE: Remove a profile ----
app.delete("/api/profiles/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM profiles WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Delete Error:", err.message);
      return res.status(500).json({ error: "Internal server error deleting profile." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Profile not found." });
    }
    res.status(200).json({ msg: "Successfully deleted!" });
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running and listening locally on port ${PORT}`);
  });
}

module.exports = app;