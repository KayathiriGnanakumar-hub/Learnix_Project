import db from "../config/db.js";

export const enrollCourse = (req, res) => {
  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({ message: "Missing user or course" });
  }

  const sql =
    "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";

  db.query(sql, [userId, courseId], (err) => {
    if (err) {
      console.error("Enrollment error:", err);
      return res.status(500).json({ message: "Enrollment failed" });
    }

    res.json({ message: "Course enrolled successfully" });
  });
};
