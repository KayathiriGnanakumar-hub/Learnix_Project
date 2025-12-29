import express from "express";
import { enrollCourse } from "../controllers/enrollController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, enrollCourse);

export default router;
