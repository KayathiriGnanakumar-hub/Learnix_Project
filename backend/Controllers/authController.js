import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

/* =========================
   REGISTER
========================= */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        console.error("Database error during registration:", err);
        return res.status(500).json({ message: "Database connection failed. Please try again later." });
      }

      res.json({ message: "User registered successfully" });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = (req, res) => {
  const { email, password } = req.body;
  // Prefer admin table first (admins may not be in users table)
  const adminSql = "SELECT * FROM admins WHERE email = ? LIMIT 1";

  db.query(adminSql, [email], async (aErr, aRes) => {
    if (aErr) {
      console.error("Admin lookup error:", aErr);
      return res.status(500).json({ message: "Server error" });
    }

    if (aRes && aRes.length > 0) {
      const admin = aRes[0];
      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: admin.id, email: admin.email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.json({
        message: "Login successful",
        token,
        user: { id: admin.id, name: admin.name, email: admin.email, isAdmin: true },
      });
    }

    // Fallback to users table
    const userSql = "SELECT * FROM users WHERE email = ? LIMIT 1";
    db.query(userSql, [email], async (uErr, uRes) => {
      if (uErr) {
        console.error("User lookup error:", uErr);
        return res.status(500).json({ message: "Server error" });
      }

      if (!uRes || uRes.length === 0) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = uRes[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({
        id: user.id,
        email: user.email,
        role: "user",
        tokenVersion: user.token_version || 1
      }, process.env.JWT_SECRET, { expiresIn: "1d" });

      return res.json({
        message: "Login successful",
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: false },
      });
    });
  });
};
