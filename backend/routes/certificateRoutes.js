import express from "express";
import {
  generateCertificate,
  generateCertificateForMe,
  verifyCertificate,
  getUserCertificates
} from "../Controllers/certificateController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Generate certificate (download as PDF)
router.get("/generate/:userId/:courseId", verifyToken, generateCertificate);

// Generate certificate for current logged-in user (no userId in URL)
router.get("/generate/me/:courseId", verifyToken, generateCertificateForMe);

// Verify certificate authenticity
router.get("/verify/:userId/:courseId", verifyCertificate);

// Get all user certificates
router.get("/user/:userId", verifyToken, getUserCertificates);

export default router;
