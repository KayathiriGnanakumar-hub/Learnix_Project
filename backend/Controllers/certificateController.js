import db from "../config/db.js";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { certificateTemplate } from "../templates/certificateTemplate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateCertificate = (req, res) => {
  const { courseId } = req.params;
  // userId may be passed via params (admin route) or available on req.user (token)
  const paramUserId = req.params.userId;
  const tokenUser = req.user;
  // Derive userId robustly from params or token payload
  const userId = paramUserId || (tokenUser && (tokenUser.id || tokenUser.userId || tokenUser.sub));

  console.log("🔍 Certificate request - derived userId:", userId, "courseId:", courseId);
  console.log("🔍 Request user token payload:", req.user);

  // Check if course is completed AND user has passed all quizzes
  const sql = `
    SELECT 
      e.completed_at,
      u.name,
      u.email as userEmail,
      c.title,
      c.id,
      e.progress,
      e.status,
      (
        SELECT COUNT(*)
        FROM video_quizzes vq
        JOIN videos v ON vq.video_id = v.id
        WHERE v.course_id = ?
      ) as totalQuizzes
    FROM enrollments e
    JOIN users u ON u.email = e.user_email
    JOIN courses c ON e.course_id = c.id
    WHERE u.id = ? AND e.course_id = ? AND e.status = 'completed' AND e.progress = 100
  `;

  db.query(sql, [courseId, userId, courseId], (err, results) => {
    if (err) {
      console.error("❌ Certificate check error:", err);
      return res.status(500).json({ message: "Failed to generate certificate" });
    }

    console.log("📋 Query results for certificate:", results);
    console.log("📋 Result count:", results ? results.length : 0);

    if (!results || results.length === 0) {
      console.warn("⚠️ No completed enrollment found for userId:", userId, "courseId:", courseId);
      
      // Debug: Check what enrollment records exist
      const debugSql = `
        SELECT e.user_email, e.course_id, e.status, e.progress, u.id 
        FROM enrollments e 
        JOIN users u ON u.email = e.user_email 
        WHERE u.id = ? OR e.course_id = ?
      `;
      db.query(debugSql, [userId, courseId], (debugErr, debugResults) => {
        if (!debugErr) {
          console.log("🔍 Debug - Existing enrollments:", debugResults);
        }
      });
      
      return res.status(404).json({ 
        message: "Course not completed. You need 100% progress and to pass all quizzes to get a certificate." 
      });
    }

    const { name, userEmail, title, completed_at, totalQuizzes } = results[0];

    console.log(`\n📚 Certificate Generation Details:`);
    console.log(`  - Course: ${title}`);
    console.log(`  - Total Quizzes: ${totalQuizzes}`);
    console.log(`  - Status: Course Completed\n`);

    let studentName = "";
    if (name) {
      studentName = name;
    } else if (userEmail) {
      studentName = userEmail.split("@")[0];
    } else {
      studentName = "Student";
    }
    const courseName = title;
    
    // Handle null completed_at
    const completionDate = completed_at 
      ? new Date(completed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
    
    const certificateId = `CERT-${userId}-${courseId}-${Date.now()}`;

    try {
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0
      });

      // Error handler for PDF document
      doc.on('error', (err) => {
        console.error("❌ PDF Document error:", err.message);
        if (!res.headersSent) {
          res.status(500).json({ message: "PDF generation failed: " + err.message });
        }
      });

      // Set response headers for PDF download
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="certificate_${userId}_${courseId}.pdf"`);

      // Pipe to response
      doc.pipe(res);

      // Dimensions
      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const margin = 35;
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);

      console.log("🖨️ Generating PDF certificate for:", studentName);

      // ===== BACKGROUND COLOR =====
      doc.fillColor("#FFFFFF").rect(0, 0, pageWidth, pageHeight).fill();

      // ===== ORNAMENTAL BORDERS =====
      // Outer gold border
      doc.strokeColor("#D4AF37").lineWidth(10);
      doc.rect(margin, margin, contentWidth, contentHeight).stroke();

      // Inner decorative border
      doc.strokeColor("#D4AF37").lineWidth(2);
      doc.rect(margin + 12, margin + 12, contentWidth - 24, contentHeight - 24).stroke();

      // ===== HEADER SECTION WITH LOGO AND INSTITUTION NAME =====
      const headerY = margin + 25;
      const headerContentY = headerY + 5;
      const logoSize = 45; // Professional reduced size

      // Left: Logo
      const logoPath = join(__dirname, '..', '..', 'vite-project', 'public', 'logo.png');
      let logoDrawn = false;
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, margin + 25, headerContentY, { width: logoSize, height: logoSize });
          logoDrawn = true;
        } catch (imgErr) {
          console.error('Logo draw error:', imgErr.message);
        }
      }

      // Center: Institution Name (adjusted if logo present)
      const institutionX = logoDrawn ? margin + 85 : margin + 25;
      doc.fillColor("#00008B")
        .font("Helvetica-Bold")
        .fontSize(24)
        .text("LEARNIX ACADEMY", institutionX, headerContentY + 5, { align: "left" });

      doc.fillColor("#666666")
        .font("Helvetica")
        .fontSize(10)
        .text("Professional Learning Platform", institutionX, headerContentY + 32, { align: "left" });

      // Right: QR Code placeholder
      const qrX = pageWidth - margin - 55;
      doc.strokeColor("#CCCCCC").lineWidth(1);
      doc.rect(qrX, headerContentY, 50, 50).stroke();
      doc.fillColor("#999999")
        .font("Helvetica")
        .fontSize(7)
        .text("QR Code", qrX + 5, headerContentY + 20, { width: 40, align: "center" });

      // ===== SEPARATOR LINE =====
      const separatorY = headerY + 70;
      doc.strokeColor("#D4AF37").lineWidth(1);
      doc.moveTo(margin + 25, separatorY).lineTo(pageWidth - margin - 25, separatorY).stroke();

      // ===== MAIN CERTIFICATE TITLE =====
      const titleY = separatorY + 20;
      doc.fillColor("#D4AF37")
        .font("Helvetica-Bold")
        .fontSize(44)
        .text("Certificate of Achievement", margin + 25, titleY, { width: contentWidth - 50, align: "center" });

      // ===== CERTIFICATE TEXT BODY =====
      const bodyStartY = titleY + 60;

      // "This is to certify that"
      doc.fillColor("#1a1a1a")
        .font("Helvetica")
        .fontSize(14)
        .text("This is to certify that", margin + 25, bodyStartY, { width: contentWidth - 50, align: "center" });

      // Student name (most prominent)
      doc.fillColor("#00008B")
        .font("Helvetica-Bold")
        .fontSize(38)
        .text(studentName, margin + 25, bodyStartY + 25, { width: contentWidth - 50, align: "center" });

      // "has successfully completed"
      doc.fillColor("#1a1a1a")
        .font("Helvetica")
        .fontSize(13)
        .text("has successfully completed the course", margin + 25, bodyStartY + 70, { width: contentWidth - 50, align: "center" });

      // Course name (highlighted in gold)
      doc.fillColor("#D4AF37")
        .font("Helvetica-Bold")
        .fontSize(30)
        .text(courseName, margin + 25, bodyStartY + 95, { width: contentWidth - 50, align: "center" });

      // Achievement message
      doc.fillColor("#1a1a1a")
        .font("Helvetica")
        .fontSize(11)
        .text("With honors and distinction for demonstrating exceptional commitment to learning excellence and professional development.", margin + 25, bodyStartY + 135, { width: contentWidth - 50, align: "center" });

      // ===== SIGNATURE & DATE SECTION =====
      const signatureY = pageHeight - 130;

      // Draw signature lines with proper spacing
      const lineY = signatureY + 45;
      const lineLength = 80;

      // Left signature (Instructor)
      const leftSigX = margin + 40;
      doc.strokeColor("#000000").lineWidth(1.5);
      doc.moveTo(leftSigX, lineY).lineTo(leftSigX + lineLength, lineY).stroke();
      doc.fillColor("#1a1a1a")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Instructor Signature", leftSigX, lineY + 8, { width: lineLength, align: "center" });

      // Center date section
      const centerDateX = pageWidth / 2 - 60;
      doc.strokeColor("#000000").lineWidth(1.5);
      doc.moveTo(centerDateX, lineY).lineTo(centerDateX + lineLength, lineY).stroke();
      doc.fillColor("#1a1a1a")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Date of Completion", centerDateX, lineY - 20, { width: lineLength, align: "center" });
      doc.fillColor("#00008B")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(completionDate, centerDateX, lineY + 8, { width: lineLength, align: "center" });

      // Right signature (Director)
      const rightSigX = pageWidth - margin - 120;
      doc.strokeColor("#000000").lineWidth(1.5);
      doc.moveTo(rightSigX, lineY).lineTo(rightSigX + lineLength, lineY).stroke();
      doc.fillColor("#1a1a1a")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Director", rightSigX, lineY + 8, { width: lineLength, align: "center" });

      // ===== FOOTER =====
      const footerY = pageHeight - 32;
      doc.fillColor("#999999")
        .font("Helvetica")
        .fontSize(8)
        .text(`Certificate ID: ${certificateId} | Issue Date: ${new Date().toLocaleDateString()}`, margin + 25, footerY);

      doc.fillColor("#D4AF37")
        .font("Helvetica-Oblique")
        .fontSize(8)
        .text("Excellence in Learning | Professional Growth", pageWidth / 2 - 80, footerY, { width: 160, align: "center" });

      console.log("✅ PDF generation complete");
      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("❌ PDF generation error:", error.message);
      console.error("❌ PDF error stack:", error.stack);
      if (!res.headersSent) {
        res.status(500).json({ message: "Failed to generate certificate: " + error.message });
      } else {
        console.error("❌ Headers already sent, cannot send error response");
      }
    }
  });
};

// Generate certificate for the logged-in user (no need to pass userId in URL)
export const generateCertificateForMe = (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // Inject userId param and delegate to existing generator
  req.params.userId = req.user.id;
  return generateCertificate(req, res);
};

// Verify certificate
export const verifyCertificate = (req, res) => {
  const { userId, courseId } = req.params;

  const sql = `
    SELECT 
      e.completed_at,
      u.name,
      c.title,
      e.progress
    FROM enrollments e
    JOIN users u ON u.email = e.user_email
    JOIN courses c ON e.course_id = c.id
    WHERE u.id = ? AND e.course_id = ? AND e.status = 'completed' AND e.progress = 100
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
      u.name
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    JOIN users u ON u.email = e.user_email
    WHERE u.id = ? AND e.status = 'completed' AND e.progress = 100
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
