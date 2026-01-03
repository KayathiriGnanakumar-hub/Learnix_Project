import db from "../config/db.js";

export const getCourseProgress = (req, res) => {
  const { userId, courseId } = req.params;

  const sql = `
    SELECT 
      COUNT(v.id) AS totalVideos,
      COUNT(vp.id) AS completedVideos
    FROM videos v
    LEFT JOIN video_progress vp
      ON v.id = vp.video_id
      AND vp.user_id = ?
      AND vp.completed = 1
    WHERE v.course_id = ?
  `;

  db.query(sql, [userId, courseId], (err, result) => {
    if (err) {
      console.error("❌ Progress error:", err);
      return res.status(500).json({ message: "Progress error" });
    }

    res.json(result[0]);
  });
};
