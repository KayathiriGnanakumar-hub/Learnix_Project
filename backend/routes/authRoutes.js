import express from "express";
import { registerUser, loginUser } from "../Controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
} from "../Controllers/passwordController.js";
import { forgotPasswordLimiter, resetPasswordLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 PASSWORD
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);

export default router;

