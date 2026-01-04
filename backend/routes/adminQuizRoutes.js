import express from "express";
import db from "../config/db.js";

const router = express.Router();

/* GET ALL QUIZZES BY VIDEO */
router.get("/video/:videoId", (req, res) => {
  const { videoId } = req.params;

  const sql = `
    SELECT * FROM quizzes
    WHERE video_id = ?
    ORDER BY id ASC
  `;

  db.query(sql, [videoId], (err, result) => {
    if (err) {
      console.error("❌ Quiz fetch error:", err);
      return res.status(500).json({ message: "Quiz fetch error" });
    }

    res.json(result || []);
  });
});

/* GET SINGLE QUIZ BY ID (Fallback) */
router.get("/:videoId", (req, res) => {
  const { videoId } = req.params;

  const sql = `
    SELECT * FROM quizzes
    WHERE video_id = ?
    LIMIT 1
  `;

  db.query(sql, [videoId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Quiz fetch error" });
    }

    res.json(result[0]);
  });
});

export default router;
