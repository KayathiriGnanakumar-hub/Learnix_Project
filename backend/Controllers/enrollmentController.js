import db from "../config/db.js";

/* =========================
   ENROLL COURSE (ALREADY USED)
========================= */
export const enrollCourse = (req, res) => {
  const { courseId, user_name, user_email } = req.body;

  if (!courseId || !user_name || !user_email) {
    return res.status(400).json({ message: "Missing enrollment data" });
  }

  const sql =
    "INSERT INTO enrollments (user_name, user_email, course_id) VALUES (?, ?, ?)";

  db.query(sql, [user_name, user_email, courseId], (err) => {
    if (err) {
      console.error("Enrollment error:", err);
      return res.status(500).json({ message: "Enrollment failed" });
    }

    res.json({ message: "Enrollment successful" });
  });
};

/* =========================
   MY COURSES (STUDENT)
========================= */
export const getMyCourses = (req, res) => {
  const userEmail = req.user.email;

  const sql = `
    SELECT 
      c.id,
      c.title,
      c.description,
      c.image,
      c.price,
      c.instructor,
      c.duration
    FROM enrollments e
    INNER JOIN courses c ON e.course_id = c.id
    WHERE e.user_email = ?
  `;

  db.query(sql, [userEmail], (err, results) => {
    if (err) {
      console.error("Fetch my courses error:", err);
      return res.status(500).json({ message: "Failed to fetch courses" });
    }

    res.json(results);
  });
};
