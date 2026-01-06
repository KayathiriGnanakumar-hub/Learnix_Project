import express from "express";
import {
  getAllInternships,
  getInternshipById,
  applyInternship,
  getUserApplications,
  checkEligibility,
  withdrawApplication
} from "../Controllers/internshipController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* Public Routes */
router.get("/", getAllInternships);
router.get("/:id", getInternshipById);

/* Protected Routes */
router.get("/check/eligibility", verifyToken, checkEligibility);
router.post("/apply", verifyToken, applyInternship);
router.get("/applications/my", verifyToken, getUserApplications);
router.put("/applications/:applicationId/withdraw", verifyToken, withdrawApplication);

export default router;
