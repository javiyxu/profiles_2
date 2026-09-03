const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const pool = mysql.createPool({
  host: process.env.DB_HOST || "sql.freedb.tech",
  user: process.env.DB_USER || "u_EvoWmY",
  password: process.env.DB_PASSWORD || "KFBhQjUU69Ih",
  database: process.env.DB_NAME || "freedb_uSTQk3lU",
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
});

//REPORT
app.get("/api/profiles", (req, res) => {
  pool.query("SELECT * FROM profiles", (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

//SEARCH
app.get("/api/profiles/:id", (req, res) => {
  const id = req.params.id;
  pool.query(
    "SELECT * FROM profiles WHERE id = ?", [id], (err, rows, fields) => {
      if (err) throw err;
      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(400).json({ msg: `${id} id not found!` });
      }
    },
  );
});

//UPDATE
app.put("/api/profiles", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const role = req.body.role;
  const id = req.body.id;
  pool.query(
    "UPDATE profiles SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, id],
    (err, rows, fields) => {
      if (err) throw err;
      res.json({ msg: `Successfully updated` });
    },
  );
});

//DELETE
app.delete("/api/profiles", (req, res) => {
  const id = req.body.id;
  pool.query("DELETE FROM profiles WHERE id = ?", [id], (err, rows, fields) => {
    if (err) throw err;
    res.json({ msg: `Successfully deleted` });
  });
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
  });
}

module.exports = app;
