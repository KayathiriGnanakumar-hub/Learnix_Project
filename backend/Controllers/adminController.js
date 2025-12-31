import db from "../config/db.js";

/* =========================
   ADMIN DASHBOARD STATS
========================= */
export const getAdminStats = (req, res) => {
  const stats = {};

  /* TOTAL STUDENTS */
  db.query(
    "SELECT COUNT(*) AS totalStudents FROM users",
    (err, studentResult) => {
      if (err) {
        console.error("Students count error:", err);
        return res.status(500).json({ message: err.message });
      }

      stats.totalStudents = studentResult[0].totalStudents;

      /* TOTAL COURSES */
      db.query(
        "SELECT COUNT(*) AS totalCourses FROM courses",
        (err, courseResult) => {
          if (err) {
            console.error("Courses count error:", err);
            return res.status(500).json({ message: err.message });
          }

          stats.totalCourses = courseResult[0].totalCourses;

          /* TOTAL ENROLLMENTS */
          db.query(
            "SELECT COUNT(*) AS totalEnrollments FROM enrollments",
            (err, enrollResult) => {
              if (err) {
                console.error("Enrollments count error:", err);
                return res.status(500).json({ message: err.message });
              }

              stats.totalEnrollments =
                enrollResult[0].totalEnrollments;

              return res.json(stats);
            }
          );
        }
      );
    }
  );
};

/* =========================
   ADMIN STUDENTS LIST
========================= */
export const getStudents = (req, res) => {
  const sql = `
    SELECT 
      u.name,
      u.email,
      u.created_at,
      GROUP_CONCAT(c.title SEPARATOR ', ') AS enrolled_courses
    FROM users u
    LEFT JOIN enrollments e ON u.email = e.user_email
    LEFT JOIN courses c ON e.course_id = c.id
    GROUP BY u.email
    ORDER BY u.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch students error:", err);
      return res.status(500).json({
        message: "Failed to fetch students",
      });
    }

    res.json(results);
  });
};
