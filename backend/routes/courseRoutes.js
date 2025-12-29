import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { googleLogin } from "../controllers/googleAuthController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);

// 🔐 PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

