import express from "express";
import { getAdminStats, getStudents, getStudentById } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* =========================
   ADMIN DASHBOARD STATS
========================= */
router.get("/stats", verifyToken, getAdminStats);

/* =========================
   ADMIN STUDENTS LIST
========================= */
router.get("/students", verifyToken, getStudents);
router.get("/students/:id", verifyToken, getStudentById);

export default router;
