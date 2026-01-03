import db from "../config/db.js";

export const addVideo = (req, res) => {
  const { courseId, title, youtubeUrl, orderNo } = req.body;

  if (!courseId || !title || !youtubeUrl || !orderNo) {
    return res.status(400).json({ message: "Missing video data" });
  }

  const sql = `
    INSERT INTO videos (course_id, title, youtube_url, order_no)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [courseId, title, youtubeUrl, orderNo], (err) => {
    if (err) {
      console.error("❌ Add video error:", err);
      return res.status(500).json({ message: "Failed to add video" });
    }

    res.json({ message: "Video added successfully" });
  });
};
