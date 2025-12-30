import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/", (req, res) => {
  const { user_id, course_id } = req.body;

  const sql = `
    INSERT INTO enrollments (user_id, course_id)
    VALUES (?, ?)
  `;

  db.query(sql, [user_id, course_id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Enrollment failed" });
    }
    res.json({ message: "Enrolled successfully" });
  });
});

export default router;
