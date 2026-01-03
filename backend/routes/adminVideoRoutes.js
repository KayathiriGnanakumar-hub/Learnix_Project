import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.post("/add-video", (req, res) => {
  const { courseId, title, youtubeUrl, orderNo } = req.body;

  const sql = `
    INSERT INTO videos (course_id, title, youtube_url, order_no)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [courseId, title, youtubeUrl, orderNo], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Video add failed" });
    }

    res.json({ message: "Video added" });
  });
});

router.get("/course/:courseId", (req, res) => {
  const sql = `
    SELECT * FROM videos
    WHERE course_id = ?
    ORDER BY order_no
  `;

  db.query(sql, [req.params.courseId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Video fetch failed" });
    }

    res.json(rows);
  });
});

export default router;
