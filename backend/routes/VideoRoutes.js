import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET ALL videos (for admin panel)
router.get("/", (req, res) => {
  db.query(
    `SELECT v.*, c.title as course_title 
     FROM videos v 
     LEFT JOIN courses c ON v.course_id = c.id 
     ORDER BY v.course_id, v.order_no ASC`,
    (err, results) => {
      if (err) {
        console.error("Fetch all videos error:", err);
        return res.status(500).json({ message: "Failed to fetch videos" });
      }
      res.json(results);
    }
  );
});

// GET videos by course ID
router.get("/course/:courseId", (req, res) => {
  const { courseId } = req.params;

  db.query(
    "SELECT * FROM videos WHERE course_id = ? ORDER BY order_no ASC",
    [courseId],
    (err, results) => {
      if (err) {
        console.error("Fetch videos error:", err);
        return res.status(500).json({ message: "Failed to fetch videos" });
      }

      res.json(results);
    }
  );
});

// GET single video by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM videos WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Video fetch error:", err);
        return res.status(500).json({ message: "Failed to fetch video" });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: "Video not found" });
      }

      res.json(result[0]);
    }
  );
});

// UPDATE video
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { courseId, title, youtubeUrl, orderNo } = req.body;

  if (!courseId || !title || !youtubeUrl || !orderNo) {
    return res.status(400).json({ message: "All fields required" });
  }

  db.query(
    `UPDATE videos 
     SET course_id = ?, title = ?, youtube_url = ?, order_no = ? 
     WHERE id = ?`,
    [courseId, title, youtubeUrl, orderNo, id],
    (err) => {
      if (err) {
        console.error("Update video error:", err);
        return res.status(500).json({ message: "Failed to update video" });
      }
      res.json({ message: "Video updated successfully" });
    }
  );
});

// DELETE video
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM videos WHERE id = ?",
    [id],
    (err) => {
      if (err) {
        console.error("Delete video error:", err);
        return res.status(500).json({ message: "Failed to delete video" });
      }
      res.json({ message: "Video deleted successfully" });
    }
  );
});

export default router;
