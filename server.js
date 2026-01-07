require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

/* ---------------- DATABASE ---------------- */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "school_db",
});

db.connect((err) => {
  if (err) return console.log(err);
  console.log("MySQL Connected");
});

/* ---------------- REGISTER API ---------------- */
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length > 0) {
        return res.status(409).json({ message: "Username ถูกใช้แล้ว" });
      }

      db.query(
        "INSERT INTO users(username, password) VALUES (?, ?)",
        [username, password],
        (err2) => {
          if (err2) return res.status(500).json(err2);
          res.json({ message: "สมัครสำเร็จ" });
        }
      );
    }
  );
});

/* ---------------- LOGIN API ---------------- */
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (results.length > 0) {
        return res.json({
          token: "abc123token",
          username: results[0].username
        });
      }

      return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านผิด" });
    }
  );
});

/* ---------------- SERVER ---------------- */
app.listen(5000, () => console.log("Server running on port 5000"));
