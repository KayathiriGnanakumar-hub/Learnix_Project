import db from "../db/db.js";

/* =========================
   ENROLL COURSE (AFTER PAYMENT)
========================= */
export const enrollCourse = (req, res) => {
  try {
    const { courseId } = req.body;

    // req.user comes from verifyToken middleware
    const userId = req.user.id;

    if (!courseId || !userId) {
      return res.status(400).json({ message: "Missing data" });
    }

    // 1️⃣ Check duplicate enrollment
    const checkSql = `
      SELECT id FROM enrollments
      WHERE user_id = ? AND course_id = ?
    `;

    db.query(checkSql, [userId, courseId], (err, rows) => {
      if (err) {
        console.error("Enrollment check error:", err);
        return res.status(500).json({ message: "Enrollment failed" });
      }

      if (rows.length > 0) {
        return res.status(400).json({ message: "Already enrolled" });
      }

      // 2️⃣ Insert enrollment
      const insertSql = `
        INSERT INTO enrollments (user_id, course_id)
        VALUES (?, ?)
      `;

      db.query(insertSql, [userId, courseId], (err) => {
        if (err) {
          console.error("Enrollment insert error:", err);
          return res.status(500).json({ message: "Enrollment failed" });
        }

        // 3️⃣ Increment students count
        const updateSql = `
          UPDATE courses
          SET students = students + 1
          WHERE id = ?
        `;

        db.query(updateSql, [courseId]);

        return res.json({ message: "Enrolled successfully" });
      });
    });

  } catch (error) {
    console.error("Enroll controller error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

