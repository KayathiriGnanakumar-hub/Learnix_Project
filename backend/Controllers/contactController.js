import db from "../config/db.js";
import jwt from "jsonwebtoken";
import { sendContactConfirmationEmail, sendReplyEmail } from "../config/emailService.js";

const PERMANENT_ADMIN_EMAIL = "admin@learnix.com";

/* =========================
   SUBMIT CONTACT QUERY (Public - Any user can submit)
========================= */
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "Name, email, subject, and message are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Get all admin emails to notify
    const getAdminsSql = "SELECT email FROM admins WHERE 1=1";
    db.query(getAdminsSql, async (err, admins) => {
      if (err) {
        console.error("Error fetching admins:", err);
        // Don't fail - proceed without admin notification
        admins = [];
      }

      // Insert query into database (phone removed)
      const insertSql = "INSERT INTO contact_inquiries (name, email, subject, message, status) VALUES (?, ?, ?, ?, 'pending')";
      db.query(insertSql, [name, email, subject, message], async (err, result) => {
        if (err) {
          console.error("❌ Error inserting contact query:", err);
          console.error("Query details:", { name, email, subject, message });
          return res.status(500).json({ message: "Error submitting your query: " + err.message });
        }

        console.log("✅ Contact query inserted successfully, ID:", result.insertId);

        // Send confirmation email to user
        try {
          await sendContactConfirmationEmail(email, name);
          console.log("✅ Confirmation email sent to:", email);
        } catch (emailErr) {
          console.error("⚠️ Error sending confirmation email:", emailErr.message);
          // Don't fail the request if email fails
        }

        // Send notification emails to all admins
        if (admins && admins.length > 0) {
          try {
            const adminEmails = admins.map(admin => admin.email);
            for (const adminEmail of adminEmails) {
              await sendReplyEmail(adminEmail, subject, `New contact query from ${name} (${email}):\n\n${message}`, "New Query Notification");
              console.log("✅ Admin notification sent to:", adminEmail);
            }
          } catch (emailErr) {
            console.error("⚠️ Error sending admin notification:", emailErr.message);
            // Don't fail the request if email fails
          }
        }

        res.status(201).json({ 
          message: "Your query has been submitted successfully! We will get back to you soon.",
          queryId: result.insertId
        });
      });
    });
  } catch (err) {
    console.error("❌ Error in submitContact:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

/* =========================
   GET ALL CONTACT QUERIES (Admin only)
========================= */
export const getContactQueries = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is an admin
    const checkAdminSql = "SELECT * FROM admins WHERE email = ?";
    db.query(checkAdminSql, [decoded.email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(403).json({ message: "Only admins can view contact queries" });
      }

      // Fetch all queries
      const getAllSql = "SELECT * FROM contact_inquiries ORDER BY created_at DESC";
      db.query(getAllSql, (err, queries) => {
        if (err) {
          console.error("Error fetching contact queries:", err);
          return res.status(500).json({ message: "Error fetching queries" });
        }

        res.json(queries);
      });
    });
  } catch (err) {
    console.error("Error in getContactQueries:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET SINGLE CONTACT QUERY (Admin only)
========================= */
export const getContactQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is an admin
    const checkAdminSql = "SELECT * FROM admins WHERE email = ?";
    db.query(checkAdminSql, [decoded.email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(403).json({ message: "Only admins can view contact queries" });
      }

      // Fetch query
      const getSql = "SELECT * FROM contact_inquiries WHERE id = ?";
      db.query(getSql, [id], (err, queries) => {
        if (err) {
          console.error("Error fetching contact query:", err);
          return res.status(500).json({ message: "Error fetching query" });
        }

        if (queries.length === 0) {
          return res.status(404).json({ message: "Query not found" });
        }

        res.json(queries[0]);
      });
    });
  } catch (err) {
    console.error("Error in getContactQuery:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   REPLY TO CONTACT QUERY (Admin only)
========================= */
export const replyToContactQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!reply || reply.trim() === "") {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is an admin
    const checkAdminSql = "SELECT * FROM admins WHERE email = ?";
    db.query(checkAdminSql, [decoded.email], (err, adminResult) => {
      if (err || adminResult.length === 0) {
        return res.status(403).json({ message: "Only admins can reply to queries" });
      }

      // Get the query to get user email
      const getQuerySql = "SELECT * FROM contact_inquiries WHERE id = ?";
      db.query(getQuerySql, [id], async (err, queries) => {
        if (err || queries.length === 0) {
          return res.status(404).json({ message: "Query not found" });
        }

        const query = queries[0];
        const userEmail = query.email;
        const subject = `Re: ${query.subject}`;

        // Update query with reply
        const updateSql = "UPDATE contact_inquiries SET reply = ?, reply_date = NOW(), status = 'responded' WHERE id = ?";
        db.query(updateSql, [reply, id], async (err) => {
          if (err) {
            console.error("Error updating query:", err);
            return res.status(500).json({ message: "Error sending reply" });
          }

          // Send reply email to user
          try {
            await sendReplyEmail(userEmail, subject, reply, "Response to Your Inquiry");
          } catch (emailErr) {
            console.error("Error sending reply email:", emailErr);
            // Don't fail the request if email fails
          }

          res.json({ message: "Reply sent successfully to " + userEmail });
        });
      });
    });
  } catch (err) {
    console.error("Error in replyToContactQuery:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE QUERY STATUS (Admin only)
========================= */
export const updateQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!status || !["pending", "responded", "closed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is an admin
    const checkAdminSql = "SELECT * FROM admins WHERE email = ?";
    db.query(checkAdminSql, [decoded.email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(403).json({ message: "Only admins can update query status" });
      }

      // Update status
      const updateSql = "UPDATE contact_inquiries SET status = ? WHERE id = ?";
      db.query(updateSql, [status, id], (err) => {
        if (err) {
          console.error("Error updating status:", err);
          return res.status(500).json({ message: "Error updating status" });
        }

        res.json({ message: "Status updated successfully" });
      });
    });
  } catch (err) {
    console.error("Error in updateQueryStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE CONTACT QUERY (Admin only)
========================= */
export const deleteContactQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is a permanent admin
    const checkAdminSql = "SELECT * FROM admins WHERE email = ? AND is_permanent = TRUE";
    db.query(checkAdminSql, [decoded.email], (err, result) => {
      if (err || result.length === 0) {
        return res.status(403).json({ message: "Only permanent admin can delete queries" });
      }

      // Delete query
      const deleteSql = "DELETE FROM contact_inquiries WHERE id = ?";
      db.query(deleteSql, [id], (err) => {
        if (err) {
          console.error("Error deleting query:", err);
          return res.status(500).json({ message: "Error deleting query" });
        }

        res.json({ message: "Query deleted successfully" });
      });
    });
  } catch (err) {
    console.error("Error in deleteContactQuery:", err);
    res.status(500).json({ message: "Server error" });
  }
};
