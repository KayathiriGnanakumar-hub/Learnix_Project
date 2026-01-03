import db from "../config/db.js";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateCertificate = (req, res) => {
  const { userId, courseId } = req.params;

  // Check if course is completed
  const sql = `
    SELECT 
      e.completed_at,
      u.firstName,
      u.lastName,
      c.title,
      c.id
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ? AND e.course_id = ? AND e.status = 'completed' AND e.progress = 100
  `;

  db.query(sql, [userId, courseId], (err, results) => {
    if (err) {
      console.error("❌ Certificate check error:", err);
      return res.status(500).json({ message: "Failed to generate certificate" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Course not completed. You need 100% progress to get a certificate." });
    }

    const { firstName, lastName, title, completed_at } = results[0];
    const studentName = `${firstName} ${lastName}`;
    const courseName = title;
    const completionDate = new Date(completed_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 40
      });

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="certificate_${userId}_${courseId}.pdf"`);

      // Pipe to response
      doc.pipe(res);

      // Set font
      doc.font("Helvetica");

      // White background
      doc.rect(0, 0, doc.page.width, doc.page.height).fill("white");

      // Logo at top
      const logoPath = join(__dirname, "../../vite-project/public/logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, doc.page.width / 2 - 40, 30, { width: 80, height: 80 });
      }

      doc.moveDown(6);

      // Title
      doc.fontSize(48)
        .font("Helvetica-Bold")
        .text("Certificate of Completion", { align: "center" });

      doc.moveDown(2);

      // Decorative line
      doc.strokeColor("#007bff")
        .lineWidth(2)
        .moveTo(100, doc.y)
        .lineTo(doc.page.width - 100, doc.y)
        .stroke();

      doc.moveDown(2);

      // Main text
      doc.fontSize(16)
        .font("Helvetica")
        .text("This is to certify that", { align: "center" });

      doc.moveDown(1);

      // Student Name
      doc.fontSize(32)
        .font("Helvetica-Bold")
        .text(studentName, { align: "center" });

      doc.moveDown(1);

      // Body text
      doc.fontSize(14)
        .font("Helvetica")
        .text("has successfully completed the course", { align: "center" });

      doc.moveDown(0.5);

      // Course Name
      doc.fontSize(26)
        .font("Helvetica-Bold")
        .fillColor("#007bff")
        .text(courseName, { align: "center" });

      doc.fillColor("black");
      doc.moveDown(1);

      // Completion text
      doc.fontSize(12)
        .font("Helvetica")
        .text(`Completed on ${completionDate}`, { align: "center" });

      doc.moveDown(3);

      // Footer decorative line
      doc.strokeColor("#007bff")
        .lineWidth(2)
        .moveTo(100, doc.y)
        .lineTo(doc.page.width - 100, doc.y)
        .stroke();

      doc.moveDown(2);

      // Signature area
      doc.fontSize(10)
        .font("Helvetica-Italic")
        .text("Learnix Certificate Authority", { align: "center" });

      doc.moveDown(0.5);

      doc.fontSize(9)
        .font("Helvetica")
        .text("Certificate ID: " + `CERT-${userId}-${courseId}-${Date.now()}`, { align: "center" });

      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("❌ PDF generation error:", error);
      res.status(500).json({ message: "Failed to generate certificate" });
    }
  });
};

// Verify certificate
export const verifyCertificate = (req, res) => {
  const { userId, courseId } = req.params;

  const sql = `
    SELECT 
      e.completed_at,
      u.firstName,
      u.lastName,
      c.title,
      e.progress
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ? AND e.course_id = ? AND e.status = 'completed' AND e.progress = 100
  `;

  db.query(sql, [userId, courseId], (err, results) => {
    if (err) {
      console.error("❌ Verification error:", err);
      return res.status(500).json({ message: "Failed to verify certificate" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Certificate not found or course not completed" });
    }

    res.json({
      verified: true,
      data: results[0],
      message: "Certificate is valid"
    });
  });
};

// Get all user certificates
export const getUserCertificates = (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT 
      c.id,
      c.title,
      e.completed_at,
      e.progress,
      u.firstName,
      u.lastName
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN users u ON e.user_id = u.id
    WHERE e.user_id = ? AND e.status = 'completed' AND e.progress = 100
    ORDER BY e.completed_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Certificates fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch certificates" });
    }

    res.json(results);
  });
};
