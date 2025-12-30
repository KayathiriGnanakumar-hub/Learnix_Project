import express from "express";
import {
  addCourse,
  getAllCourses,
  getCourseById,
  deleteCourse,
} from "../Controllers/courseController.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// ADMIN (later you can protect these)
router.post("/", addCourse);
router.delete("/:id", deleteCourse);

export default router;
