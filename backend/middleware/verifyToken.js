import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn("⚠️ No authorization header provided");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    console.warn("⚠️ No token in authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("🔐 Verifying token with secret:", process.env.JWT_SECRET?.substring(0, 10) + "...");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({ message: "Invalid token: " + err.message });
    }

    console.log("✅ Token verified. Decoded token:", decoded);

    // Check if token version is valid (for session invalidation)
    if (decoded.role === "user" && decoded.tokenVersion !== undefined) {
      const sql = "SELECT token_version FROM users WHERE id = ? LIMIT 1";
      db.query(sql, [decoded.id], (dbErr, results) => {
        if (dbErr) {
          console.error("❌ Database error checking token version:", dbErr);
          return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
          console.warn("⚠️ User not found for token version check");
          return res.status(401).json({ message: "Invalid token" });
        }

        const currentVersion = results[0].token_version;
        if (decoded.tokenVersion !== currentVersion) {
          console.warn("⚠️ Token version mismatch - session invalidated");
          return res.status(401).json({ message: "Session expired. Please login again." });
        }

        req.user = decoded;
        next();
      });
    } else {
      // For admin tokens or legacy tokens without version
      req.user = decoded;
      next();
    }
  });
};
