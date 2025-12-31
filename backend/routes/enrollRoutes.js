import express from "express";
import {
  enrollCourse,
  getMyCourses,
} from "../controllers/enrollmentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* =========================
   ENROLL COURSE
========================= */
router.post("/", verifyToken, enrollCourse);

/* =========================
   STUDENT - MY COURSES
========================= */
router.get("/my-courses", verifyToken, getMyCourses);

export default router;
