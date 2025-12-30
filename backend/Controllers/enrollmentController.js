import db from "../config/db.js";

export const enrollCourse = (req, res) => {
  console.log("ENROLL BODY:", req.body); // ✅ Debug log

  const { userId, courseId } = req.body;

  if (!userId || !courseId) {
    return res.status(400).json({
      message: "Missing userId or courseId",
    });
  }

  const sql =
    "INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)";

  db.query(sql, [userId, courseId], (err, result) => {
    if (err) {
      console.error("❌ Enrollment error:", err);
      return res.status(500).json({
        message: "Enrollment failed",
      });
    }

    console.log("✅ Enrollment inserted:", result.insertId);

    res.status(201).json({
      message: "Course enrolled successfully",
    });
  });
};
