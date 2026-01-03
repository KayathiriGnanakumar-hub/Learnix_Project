import express from "express";
import {
  generateCertificate,
  verifyCertificate,
  getUserCertificates
} from "../Controllers/certificateController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Generate certificate (download as PDF)
router.get("/generate/:userId/:courseId", verifyToken, generateCertificate);

// Verify certificate authenticity
router.get("/verify/:userId/:courseId", verifyCertificate);

// Get all user certificates
router.get("/user/:userId", verifyToken, getUserCertificates);

export default router;
