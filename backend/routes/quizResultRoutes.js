import express from "express";
import {
  saveQuizResult,
  getCourseQuizResults,
  getUserAllQuizResults,
  checkCourseQuizzesPassed,
  getQuizStatistics
} from "../Controllers/quizResultController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* PROTECTED ROUTES */

// Save quiz result (when user completes a quiz)
router.post("/save", verifyToken, saveQuizResult);

// Get all quiz results for a specific course
router.get("/course/:courseId", verifyToken, getCourseQuizResults);

// Get all quiz results for the user across all courses
router.get("/all/results", verifyToken, getUserAllQuizResults);

// Check if all quizzes in a course are passed
router.get("/check/:courseId", verifyToken, checkCourseQuizzesPassed);

// Get user's quiz statistics
router.get("/stats/all", verifyToken, getQuizStatistics);

export default router;
