import db from "../config/db.js";

export const enrollCourse = (req, res) => {
  const email = req.user.email;
  const { courseId } = req.body;
  const complete = req.body.complete === true || req.body.complete === "true";

  if (!courseId) {
    return res.status(400).json({ message: "courseId missing" });
  }

  // Use atomic upsert to avoid race conditions and duplicate rows.
  const status = complete ? "completed" : "in_progress";
  const progress = complete ? 100 : 0;
  const completedAt = complete ? new Date() : null; // will be converted below

  const sql = `
    INSERT INTO enrollments (user_email, course_id, status, progress, completed_at)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      status = VALUES(status),
      progress = VALUES(progress),
      completed_at = VALUES(completed_at)
  `;

  // Convert completedAt to MySQL NOW() when provided
  const params = [email, courseId, status, progress, complete ? new Date() : null];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("❌ Enroll error:", err);
      return res.status(500).json({ message: "Enroll failed: " + err.message });
    }

    console.log("✅ Course enrolled (upsert) for email:", email, "courseId:", courseId, "affectedRows:", result.affectedRows);
    res.json({ message: "Enrolled" });
  });
};

export const getMyEnrollments = (req, res) => {
  const email = req.user.email;

  const sql = `
    SELECT 
      c.*,
      e.user_email,
      e.id as enrollment_id,
      e.status,
      e.progress,
      e.completed_at
    FROM courses c
    JOIN enrollments e ON c.id = e.course_id
    WHERE e.user_email = ?
    ORDER BY e.id DESC
  `;

  db.query(sql, [email], (err, rows) => {
    if (err) {
      console.error("Fetch enroll error:", err);
      return res.status(500).json({ message: "Fetch failed" });
    }

    // Deduplicate by enrollment_id (most recent enrollment only) to prevent duplicates
    const seen = new Set();
    const uniqueRows = [];
    rows.forEach((enrollment) => {
      const key = enrollment.enrollment_id;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueRows.push(enrollment);
      }
    });

    console.log(`✅ Fetched ${uniqueRows.length} enrollments for user:`, email);
    uniqueRows.forEach((enrollment) => {
      console.log(`  - ${enrollment.title}: status=${enrollment.status}, progress=${enrollment.progress}`);
    });

    res.json(uniqueRows);
  });
};
