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
   FORGOT PASSWORD
========================= */
export const forgotPassword = (req, res) => {
  const { email } = req.body;

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  const sql =
    "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?";

  db.query(sql, [token, expiry, email], (err, result) => {
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Learnix Password Reset",
      html: `
        <h2>Password Reset</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({ message: "Password reset link sent" });
  });
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    UPDATE users
    SET password=?, reset_token=NULL, reset_token_expiry=NULL
    WHERE reset_token=? AND reset_token_expiry > NOW()
  `;

  db.query(sql, [hashedPassword, token], (err, result) => {
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Password reset successful" });
  });
};
