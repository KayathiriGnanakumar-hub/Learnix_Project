import rateLimit from "express-rate-limit";

/* =========================
   RATE LIMITING
========================= */

// Forgot Password: 5 attempts per hour per IP
export const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per window
  message: {
    message: "Too many password reset requests. Please try again in an hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Reset Password: 10 attempts per hour per IP
export const resetPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per window
  message: {
    message: "Too many password reset attempts. Please try again in an hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
});