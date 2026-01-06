import db from "../config/db.js";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

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
      const margin = 40;

      console.log("🖨️  Generating PDF certificate for:", studentName);

      // ===== BACKGROUND & BORDERS =====
      // Golden border (outer)
      doc.strokeColor("#d4af37").lineWidth(8);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin).stroke();

      // Inner decorative border
      doc.strokeColor("#d4af37").lineWidth(2);
      doc.rect(margin + 10, margin + 10, pageWidth - margin * 2 - 20, pageHeight - margin * 2 - 20).stroke();

      // ===== HEADER WITH LOGO & COMPANY NAME =====
      // Attempt to draw the company logo from the project public folder
      const logoPath = join(__dirname, '..', '..', 'vite-project', 'public', 'logo.png');
      let headerTextX = margin + 40;
      if (fs.existsSync(logoPath)) {
        try {
          // draw logo on top-left
          doc.image(logoPath, margin + 40, margin + 10, { width: 100, height: 60 });
          headerTextX = margin + 160;
        } catch (imgErr) {
          console.error('⚠️ Logo draw error:', imgErr.message);
        }
      }

      // Company name (adjusted if logo present)
      doc.fillColor("#667eea")
        .font("Helvetica-Bold")
        .fontSize(28)
        .text("Learnix Academy", headerTextX, margin + 20);

      // ===== MAIN TITLE =====
      doc.fillColor("#1a1a1a")
        .font("Helvetica-Bold")
        .fontSize(52)
        .text("Certificate of Achievement", { align: "center", y: margin + 80 });

      doc.moveDown(0.5);

      // Subtitle
      doc.fillColor("#666666")
        .font("Helvetica-Oblique")
        .fontSize(16)
        .text("This is to certify that", { align: "center" });

      doc.moveDown(1.5);

      // ===== STUDENT NAME =====
      doc.fillColor("#1a1a1a")
        .font("Helvetica-Bold")
        .fontSize(40)
        .text(studentName, { align: "center" });

      doc.moveDown(1.5);

      // ===== COURSE SECTION =====
      doc.fillColor("#666666")
        .font("Helvetica")
        .fontSize(14)
        .text("has successfully completed the course", { align: "center" });

      doc.moveDown(1);

      // Course Name
      doc.fillColor("#667eea")
        .font("Helvetica-Bold")
        .fontSize(32)
        .text(courseName, { align: "center" });

      doc.moveDown(2);

      // Congratulations message
      doc.fillColor("#1a1a1a")
        .font("Helvetica")
        .fontSize(14)
        .text("With honors and recognition for outstanding achievement and commitment to learning excellence.", { align: "center" });

      doc.moveDown(3);

      // ===== FOOTER SECTION =====
      const footerY = pageHeight - 100;

      // Date in center
      doc.fillColor("#666666").font("Helvetica").fontSize(11).text("Date of Completion", pageWidth / 2 - 60, footerY, { width: 120, align: "center" });
      doc.fillColor("#1a1a1a").font("Helvetica-Bold").fontSize(13).text(completionDate, pageWidth / 2 - 60, footerY + 20, { width: 120, align: "center" });

      // Certificate ID at bottom
      doc.fillColor("#999999").font("Helvetica").fontSize(9).text(`Certificate ID: ${certificateId}`, margin + 20, pageHeight - 30);

      console.log("✅ PDF generation complete, ending document");
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
