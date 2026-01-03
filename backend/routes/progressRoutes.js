import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* =========================
   MARK VIDEO COMPLETED
========================= */
router.post("/complete", verifyToken, (req, res) => {
  const userEmail = req.user.email;
  const { videoId } = req.body;

  const sql = `
    INSERT IGNORE INTO video_progress (user_email, video_id, completed)
    VALUES (?, ?, 1)
  `;

  db.query(sql, [userEmail, videoId], (err) => {
    if (err) {
      console.error("Video progress error:", err);
      return res.status(500).json({ message: "Progress update failed" });
    }

    res.json({ message: "Video marked completed" });
  });
});

/* =========================
   GET COURSE PROGRESS
========================= */
router.get("/:courseId", verifyToken, (req, res) => {
  const userEmail = req.user.email;
  const { courseId } = req.params;

  const sql = `
    SELECT
      COUNT(v.id) AS total,
      COUNT(vp.video_id) AS completed
    FROM videos v
    LEFT JOIN video_progress vp
      ON v.id = vp.video_id
      AND vp.user_email = ?
    WHERE v.course_id = ?
  `;

  db.query(sql, [userEmail, courseId], (err, result) => {
    if (err) {
      console.error("Fetch progress error:", err);
      return res.status(500).json({ message: "Progress fetch failed" });
    }

    res.json(result[0]);
  });
});

export default router;
