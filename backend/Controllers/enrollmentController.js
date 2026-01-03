import db from "../config/db.js";

export const enrollCourse = (req, res) => {
  const email = req.user.email;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "courseId missing" });
  }

  const sql = `
    INSERT IGNORE INTO enrollments (user_email, course_id)
    VALUES (?, ?)
  `;

  db.query(sql, [email, courseId], (err) => {
    if (err) {
      console.error("Enroll error:", err);
      return res.status(500).json({ message: "Enroll failed" });
    }

    res.json({ message: "Enrolled" });
  });
};

export const getMyEnrollments = (req, res) => {
  const email = req.user.email;

  const sql = `
    SELECT c.*
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_email = ?
  `;

  db.query(sql, [email], (err, rows) => {
    if (err) {
      console.error("Fetch enroll error:", err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    res.json(rows);
  });
};
