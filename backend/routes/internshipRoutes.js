import express from "express";
import {
  getAllInternships,
  getInternshipById,
  applyInternship,
  getUserApplications,
  checkEligibility,
  withdrawApplication,
  getAllApplications,
  replyToApplication,
  selectDomain
} from "../Controllers/internshipController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* Public Routes */
router.get("/", getAllInternships);

/* Protected Routes */
router.get("/check/eligibility", verifyToken, checkEligibility);
router.post("/apply", verifyToken, applyInternship);
router.post("/select-domain", verifyToken, selectDomain);
router.get("/applications/my", verifyToken, getUserApplications);
router.put("/applications/:applicationId/withdraw", verifyToken, withdrawApplication);
// Admin routes: list and reply to applications
router.get("/applications", verifyToken, getAllApplications);
router.put("/applications/:applicationId/reply", verifyToken, replyToApplication);

/* Specific public route for internship by id (keep last to avoid catching other paths)
  placed after other routes so '/applications' isn't matched as ':id' */
router.get("/:id", getInternshipById);

export default router;
