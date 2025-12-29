import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 PASSWORD
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

