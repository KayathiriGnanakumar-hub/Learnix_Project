import express from "express";
import { getAdminStats, getStudents } from "../controllers/adminController.js";
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

export default router;
