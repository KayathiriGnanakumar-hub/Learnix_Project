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
  // Enhanced student listing: include enrolled course titles, count, avg progress and last activity
  const sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.created_at,
      GROUP_CONCAT(DISTINCT c.title SEPARATOR ', ') AS enrolled_courses,
      COUNT(DISTINCT e.id) AS enrolled_courses_count,
      ROUND(AVG(IFNULL(e.progress,0)),2) AS avg_progress,
      COALESCE(MAX(qr.taken_at), MAX(e.completed_at)) AS last_activity
    FROM users u
    LEFT JOIN enrollments e ON u.email = e.user_email
    LEFT JOIN courses c ON e.course_id = c.id
    LEFT JOIN quiz_results qr ON qr.user_id = u.id
    GROUP BY u.id, u.email
    ORDER BY u.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Fetch students error:", err.message);
      console.error("Error code:", err.code);
      console.error("Full error:", err);
      return res.status(500).json({ 
        message: "Failed to fetch students",
        error: err.message,
        code: err.code
      });
    }

    console.log(`✅ Fetched ${results.length} students from database`);

    // Normalize results so frontend can rely on fields
    const normalized = results.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      created_at: r.created_at,
      enrolled_courses: r.enrolled_courses || "",
      enrolled_courses_count: r.enrolled_courses_count || 0,
      avg_progress: r.avg_progress != null ? Number(r.avg_progress) : 0,
      last_activity: r.last_activity || null,
    }));

    res.json(normalized);
  });
};

/* =========================
   GET SINGLE STUDENT
========================= */
export const getStudentById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.created_at,
      GROUP_CONCAT(DISTINCT c.title SEPARATOR ', ') AS enrolled_courses,
      COUNT(DISTINCT e.id) AS enrolled_courses_count,
      ROUND(AVG(IFNULL(e.progress,0)),2) AS avg_progress,
      COALESCE(MAX(qr.taken_at), MAX(e.completed_at)) AS last_activity
    FROM users u
    LEFT JOIN enrollments e ON u.email = e.user_email
    LEFT JOIN courses c ON e.course_id = c.id
    LEFT JOIN quiz_results qr ON qr.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id, u.email
    LIMIT 1
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Fetch student error:", err.message);
      return res.status(500).json({ message: "Failed to fetch student", error: err.message });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const r = results[0];
    const normalized = {
      id: r.id,
      name: r.name,
      email: r.email,
      created_at: r.created_at,
      enrolled_courses: r.enrolled_courses || "",
      enrolled_courses_count: r.enrolled_courses_count || 0,
      avg_progress: r.avg_progress != null ? Number(r.avg_progress) : 0,
      last_activity: r.last_activity || null,
    };

    res.json(normalized);
  });
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const PERMANENT_ADMIN_EMAIL = "admin@learnix.com";

/* =========================
   CREATE NEW ADMIN (only permanent admin can do this)
========================= */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verify that the current user is the permanent admin
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is the permanent admin
    const sql = "SELECT * FROM admins WHERE email = ? AND is_permanent = TRUE";
    db.query(sql, [decoded.email], async (err, result) => {
      if (err || result.length === 0 || result[0].email !== PERMANENT_ADMIN_EMAIL) {
        return res.status(403).json({ message: "Only the permanent admin can create new admin accounts" });
      }

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new admin
      const insertSql = "INSERT INTO admins (name, email, password, is_permanent) VALUES (?, ?, ?, FALSE)";
      db.query(insertSql, [name, email, hashedPassword], (err) => {
        if (err) {
          console.error("Error creating admin:", err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Admin with this email already exists" });
          }
          return res.status(500).json({ message: "Error creating admin account" });
        }

        res.status(201).json({ message: "Admin created successfully" });
      });
    });
  } catch (err) {
    console.error("Error in createAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL ADMINS (only permanent admin can do this)
========================= */
export const getAllAdmins = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is the permanent admin
    const sql = "SELECT * FROM admins WHERE email = ? AND is_permanent = TRUE";
    db.query(sql, [decoded.email], (err, result) => {
      if (err || result.length === 0 || result[0].email !== PERMANENT_ADMIN_EMAIL) {
        return res.status(403).json({ message: "Only the permanent admin can view admin accounts" });
      }

      // Fetch all admins
      const getAllSql = "SELECT id, name, email, is_permanent, created_at FROM admins ORDER BY created_at DESC";
      db.query(getAllSql, (err, admins) => {
        if (err) {
          console.error("Error fetching admins:", err);
          return res.status(500).json({ message: "Error fetching admins" });
        }

        res.json(admins);
      });
    });
  } catch (err) {
    console.error("Error in getAllAdmins:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE ADMIN (only permanent admin can do this, and cannot delete permanent admin)
========================= */
export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is the permanent admin
    const checkAdminSql = "SELECT * FROM admins WHERE email = ? AND is_permanent = TRUE";
    db.query(checkAdminSql, [decoded.email], (err, result) => {
      if (err || result.length === 0 || result[0].email !== PERMANENT_ADMIN_EMAIL) {
        return res.status(403).json({ message: "Only the permanent admin can delete admin accounts" });
      }

      // Check if admin to delete is permanent
      const checkDeleteSql = "SELECT * FROM admins WHERE id = ?";
      db.query(checkDeleteSql, [id], (err, adminToDelete) => {
        if (err || adminToDelete.length === 0) {
          return res.status(404).json({ message: "Admin not found" });
        }

        if (adminToDelete[0].is_permanent === 1) {
          return res.status(403).json({ message: "Cannot delete the permanent admin account" });
        }

        // Delete the admin
        const deleteSql = "DELETE FROM admins WHERE id = ?";
        db.query(deleteSql, [id], (err) => {
          if (err) {
            console.error("Error deleting admin:", err);
            return res.status(500).json({ message: "Error deleting admin" });
          }

          res.json({ message: "Admin deleted successfully" });
        });
      });
    });
  } catch (err) {
    console.error("Error in deleteAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};
