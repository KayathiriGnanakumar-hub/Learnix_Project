import express from "express";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
} from "../Controllers/courseController.js";
import db from "../config/db.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Get all courses with their video IDs (for listing purposes)
router.get("/list/with-videos", (req, res) => {
  const sql = `
    SELECT 
      c.id as courseId,
      c.title as courseName,
      c.description,
      c.price,
      c.instructor,
      c.image,
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'videoId', v.id,
            'videoTitle', v.title,
            'youtubeUrl', v.youtube_url,
            'orderNo', v.order_no
          )
        ),
        JSON_ARRAY()
      ) as videos
    FROM courses c
    LEFT JOIN videos v ON c.id = v.course_id
    GROUP BY c.id, c.title, c.description, c.price, c.instructor, c.image
    ORDER BY c.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching courses with videos:", err);
      return res.status(500).json({ message: "Error fetching courses" });
    }

    // Parse JSON arrays if needed
    const formattedResults = results.map((course) => {
      try {
        if (typeof course.videos === "string") {
          course.videos = JSON.parse(course.videos);
        }
      } catch (e) {
        course.videos = [];
      }
      return course;
    });

    res.json(formattedResults);
  });
});

// ADMIN (later you can protect these)
router.post("/", addCourse);
router.delete("/:id", deleteCourse);

export default router;
