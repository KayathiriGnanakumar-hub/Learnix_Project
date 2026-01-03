import express from "express";
import { enrollCourse, getMyEnrollments } from "../controllers/enrollmentController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, enrollCourse);
router.get("/my", verifyToken, getMyEnrollments);

export default router;
