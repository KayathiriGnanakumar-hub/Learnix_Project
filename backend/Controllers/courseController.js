import db from "../db/db.js";

/* =========================
   ADD COURSE (ADMIN)
========================= */
export const addCourse = (req, res) => {
  const { title, description, price, image, instructor, duration } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and price required" });
  }

  const sql = `
    INSERT INTO courses
    (title, description, price, image, instructor, duration, students)
    VALUES (?, ?, ?, ?, ?, ?, 0)
  `;

  db.query(
    sql,
    [title, description, price, image, instructor, duration],
    (err) => {
      if (err) {
        console.error("Add course error:", err);
        return res.status(500).json({ message: "Failed to add course" });
      }

      res.json({ message: "Course added successfully" });
    }
  );
};

/* =========================
   GET ALL COURSES
========================= */
export const getAllCourses = (req, res) => {
  const sql = "SELECT * FROM courses";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetch courses error:", err);
      return res.status(500).json({ message: "Failed to fetch courses" });
    }

    res.json(results);
  });
};

/* =========================
   GET COURSE BY ID
========================= */
export const getCourseById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM courses WHERE id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Fetch course error:", err);
      return res.status(500).json({ message: "Failed to fetch course" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(results[0]);
  });
};

/* =========================
   DELETE COURSE (ADMIN)
========================= */
export const deleteCourse = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM courses WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Delete course error:", err);
      return res.status(500).json({ message: "Failed to delete course" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  });
};
