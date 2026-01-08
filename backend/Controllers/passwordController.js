import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import db from "../config/db.js";

/* =========================
   EMAIL CONFIG
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   PASSWORD VALIDATION
========================= */
const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return errors;
};

/* =========================
   AUDIT LOGGING
========================= */
const logAudit = (action, email, ip, userAgent, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    action,
    email: email || 'unknown',
    ip: ip || 'unknown',
    userAgent: userAgent || 'unknown',
    ...details
  };

  console.log(`AUDIT: ${JSON.stringify(logEntry)}`);

  // In production, you might want to write to a file or database
  // For now, we'll just log to console
};

/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = (req, res) => {
  const { email } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  // Log the attempt
  logAudit('PASSWORD_RESET_REQUEST', email, clientIP, userAgent);

  // Always generate a token to prevent timing attacks
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  // Try to update any user with this email (or do nothing if not found)
  const sql =
    "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?";

  db.query(sql, [hashedToken, expiry, email], (err, result) => {
    if (err) {
      console.error("Database error in forgot password:", err);
      logAudit('PASSWORD_RESET_REQUEST_FAILED', email, clientIP, userAgent, { error: 'database_error' });
      return res.status(500).json({ message: "Server error" });
    }

    // Always send the same response regardless of whether email exists
    // This prevents user enumeration attacks
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    // Only send email if user actually exists (result.affectedRows > 0)
    if (result.affectedRows > 0) {
      transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Learnix Password Reset",
        html: `
          <h2>Password Reset</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link expires in 15 minutes.</p>
          <p>If you didn't request this reset, please ignore this email.</p>
        `,
      }, (emailErr) => {
        if (emailErr) {
          console.error("Email sending failed:", emailErr);
          logAudit('PASSWORD_RESET_EMAIL_FAILED', email, clientIP, userAgent, { error: 'email_send_failed' });
        } else {
          logAudit('PASSWORD_RESET_EMAIL_SENT', email, clientIP, userAgent);
        }
      });
    } else {
      logAudit('PASSWORD_RESET_REQUEST_INVALID_EMAIL', email, clientIP, userAgent);
    }

    // Always return success to prevent user enumeration
    res.json({ message: "If an account with that email exists, a password reset link has been sent." });
  });
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');

  // Validate password strength
  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    logAudit('PASSWORD_RESET_VALIDATION_FAILED', null, clientIP, userAgent, { errors: passwordErrors });
    return res.status(400).json({
      message: "Password does not meet requirements",
      errors: passwordErrors
    });
  }

  // Hash the token for comparison
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Start transaction to ensure atomicity
    db.query("START TRANSACTION", (err) => {
      if (err) {
        console.error("Transaction start failed:", err);
        return res.status(500).json({ message: "Server error" });
      }

      // Find user with valid token
      const findSql = `
        SELECT id, email FROM users
        WHERE reset_token=? AND reset_token_expiry > NOW()
        LIMIT 1
      `;

      db.query(findSql, [hashedToken], (err, results) => {
        if (err) {
          console.error("Database error finding user:", err);
          db.query("ROLLBACK");
          return res.status(500).json({ message: "Server error" });
        }

        if (results.length === 0) {
          logAudit('PASSWORD_RESET_INVALID_TOKEN', null, clientIP, userAgent);
          db.query("ROLLBACK");
          return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const user = results[0];

        // Update password and clear reset token, increment token version for session invalidation
        const updateSql = `
          UPDATE users
          SET password=?, reset_token=NULL, reset_token_expiry=NULL, token_version=token_version+1
          WHERE id=?
        `;

        db.query(updateSql, [hashedPassword, user.id], (err, result) => {
          if (err) {
            console.error("Database error updating password:", err);
            db.query("ROLLBACK");
            logAudit('PASSWORD_RESET_UPDATE_FAILED', user.email, clientIP, userAgent, { error: 'database_error' });
            return res.status(500).json({ message: "Server error" });
          }

          // Commit transaction
          db.query("COMMIT", (err) => {
            if (err) {
              console.error("Transaction commit failed:", err);
              return res.status(500).json({ message: "Server error" });
            }

            logAudit('PASSWORD_RESET_SUCCESS', user.email, clientIP, userAgent);
            res.json({ message: "Password reset successful. All sessions have been invalidated." });
          });
        });
      });
    });

  } catch (error) {
    console.error("Password reset error:", error);
    logAudit('PASSWORD_RESET_ERROR', null, clientIP, userAgent, { error: error.message });
    res.status(500).json({ message: "Server error" });
  }
};
