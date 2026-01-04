import db from "../config/db.js";

export const getCourseProgress = (req, res) => {
  const { userId, courseId } = req.params;

  const sql = `
    SELECT 
      COUNT(v.id) AS totalVideos,
      COUNT(vp.id) AS completedVideos,
      ROUND((COUNT(vp.id) / COUNT(v.id)) * 100, 2) AS progressPercentage
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

    const progress = result[0];
    // Mark course as complete if 100% progress
    if (progress.progressPercentage === 100) {
      const updateSql = `
        UPDATE enrollments 
        SET progress = 100, status = 'completed', completed_at = NOW()
        WHERE user_id = ? AND course_id = ?
      `;
      db.query(updateSql, [userId, courseId], (updateErr) => {
        if (updateErr) console.error("Error updating course completion:", updateErr);
      });
    }

    res.json(progress);
  });
};

// Get overall user progress across all courses
export const getUserOverallProgress = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.id,
      c.title,
      COUNT(v.id) AS totalVideos,
      COUNT(vp.id) AS completedVideos,
      ROUND((COUNT(vp.id) / COUNT(v.id)) * 100, 2) AS progressPercentage,
      e.status,
      e.completed_at
    FROM courses c
    LEFT JOIN videos v ON c.id = v.course_id
    LEFT JOIN video_progress vp 
      ON v.id = vp.video_id 
      AND vp.user_id = ?
      AND vp.completed = 1
    LEFT JOIN enrollments e 
      ON c.id = e.course_id 
      AND e.user_id = ?
    GROUP BY c.id, c.title, e.id
    ORDER BY c.id
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error("❌ Overall progress error:", err);
      return res.status(500).json({ message: "Failed to get progress" });
    }

    res.json(results);
  });
};

// Check if course is completed (for certificate generation)
export const checkCourseCompletion = (req, res) => {
  const { userId, courseId } = req.params;

  const sql = `
    SELECT 
      e.status,
      e.completed_at,
      e.progress,
      u.firstName,
      u.lastName,
      c.title
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ? AND e.course_id = ? AND e.status = 'completed'
  `;

  db.query(sql, [userId, courseId], (err, results) => {
    if (err) {
      console.error("❌ Completion check error:", err);
      return res.status(500).json({ message: "Failed to check completion" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Course not completed" });
    }

    res.json(results[0]);
  });
};
