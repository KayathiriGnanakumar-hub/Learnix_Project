import db from "../config/db.js";

/* =========================
   GET ALL INTERNSHIPS
========================= */
export const getAllInternships = (req, res) => {
  const sql = `
    SELECT * FROM internships
    WHERE status = 'open' AND deadline >= CURDATE()
    ORDER BY posted_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Fetch internships error:", err);
      return res.status(500).json({ message: "Failed to fetch internships" });
    }

    res.json(results || []);
  });
};

/* =========================
   GET INTERNSHIP BY ID
========================= */
export const getInternshipById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT * FROM internships
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Fetch internship error:", err);
      return res.status(500).json({ message: "Failed to fetch internship" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Internship not found" });
    }

    res.json(results[0]);
  });
};

/* =========================
   APPLY FOR INTERNSHIP
========================= */
export const applyInternship = (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;
  const { internshipId, coverLetter, fasttrack } = req.body;

  // allow fasttrack applications (no explicit internshipId) or regular internshipId
  if (!internshipId && !fasttrack) {
    return res.status(400).json({ message: "Internship ID required" });
  }

  // Helper to insert application once we have an internship id
  const insertApplication = (targetInternshipId) => {
    // Check if already applied
    const checkSql = `
      SELECT id FROM internship_applications
      WHERE internship_id = ? AND user_id = ?
    `;

    db.query(checkSql, [targetInternshipId, userId], (err, results) => {
      if (err) {
        console.error("❌ Check application error:", err);
        return res.status(500).json({ message: "Error checking application" });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "You have already applied for this internship" });
      }

      // Insert new application
      const insertSql = `
        INSERT INTO internship_applications
        (internship_id, user_id, user_email, cover_letter)
        VALUES (?, ?, ?, ?)
      `;

      db.query(insertSql, [targetInternshipId, userId, userEmail, coverLetter], (insertErr) => {
        if (insertErr) {
          console.error("❌ Apply internship error:", insertErr);
          return res.status(500).json({ message: "Failed to apply for internship" });
        }

        res.json({ message: "Successfully applied for internship" });
      });
    });
  };

  // If fasttrack flag is present, find or create a special internship record and use its id
  if (fasttrack) {
    const title = 'Fast-Track Internship Offer';
    const findSql = `SELECT id FROM internships WHERE title = ? LIMIT 1`;
    db.query(findSql, [title], (findErr, findRes) => {
      if (findErr) {
        console.error('❌ Fasttrack lookup error:', findErr);
        return res.status(500).json({ message: 'Failed to process fast-track application' });
      }

      if (findRes.length > 0) {
        const existingId = findRes[0].id;
        return insertApplication(existingId);
      }

      // Create a lightweight internships entry for Fast-Track
      const insertInternSql = `
        INSERT INTO internships (title, company, description, status, posted_date, deadline)
        VALUES (?, ?, ?, 'open', NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))
      `;

      db.query(insertInternSql, [title, 'Learnix FastTrack', 'Auto-generated fast-track offer'], (insErr, insRes) => {
        if (insErr) {
          console.error('❌ Failed to create fast-track internship:', insErr);
          return res.status(500).json({ message: 'Failed to create fast-track internship' });
        }

        const newId = insRes.insertId;
        return insertApplication(newId);
      });
    });
  } else {
    // Regular internship application flow
    insertApplication(internshipId);
  }
};

/* =========================
   GET USER'S APPLICATIONS
========================= */
export const getUserApplications = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT 
      ia.id,
      ia.internship_id,
      ia.status,
      ia.applied_date,
      i.title,
      i.company,
      i.location,
      i.job_type,
      i.stipend
    FROM internship_applications ia
    JOIN internships i ON ia.internship_id = i.id
    WHERE ia.user_id = ?
    ORDER BY ia.applied_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Fetch applications error:", err);
      return res.status(500).json({ message: "Failed to fetch applications", error: err.message });
    }

    console.log(`✅ User ${userId} applications fetched: ${results.length} records`);
    console.log('Applications:', JSON.stringify(results, null, 2));
    
    res.json(results || []);
  });
};

/* =========================
   CHECK ELIGIBILITY FOR INTERNSHIP
========================= */
export const checkEligibility = (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  // Get total completed courses AND check if user has passed quizzes
  const sql = `
    SELECT 
      COUNT(*) as completedCourses,
      (
        SELECT COUNT(DISTINCT c.id)
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        JOIN videos v ON c.id = v.course_id
        JOIN video_quizzes vq ON v.id = vq.video_id
        WHERE e.user_email = ? AND e.status = 'completed' AND e.progress = 100
      ) as coursesWithQuizzes
    FROM enrollments
    WHERE user_email = ? AND status = 'completed' AND progress = 100
  `;

  db.query(sql, [userEmail, userEmail], (err, results) => {
    if (err) {
      console.error("❌ Check eligibility error:", err);
      return res.status(500).json({ message: "Error checking eligibility" });
    }

    const completedCourses = results[0].completedCourses || 0;
    const coursesWithQuizzes = results[0].coursesWithQuizzes || 0;
    
    // User must complete at least 2 courses with quizzes
    const isEligible = completedCourses >= 2 && coursesWithQuizzes >= 2;

    console.log(`\n📊 Internship Eligibility Check for user ${userId}:`);
    console.log(`  - Completed Courses: ${completedCourses}`);
    console.log(`  - Courses with Quizzes: ${coursesWithQuizzes}`);
    console.log(`  - Eligible: ${isEligible}\n`);

    res.json({
      isEligible,
      completedCourses,
      coursesWithQuizzes,
      requiredCourses: 2,
      message: isEligible
        ? "✅ You are eligible for internships! Complete courses and pass their quizzes."
        : `Complete ${2 - completedCourses} more course(s) to become eligible`
    });
  });
};

/* =========================
   WITHDRAW APPLICATION
========================= */
export const withdrawApplication = (req, res) => {
  const userId = req.user.id;
  const { applicationId } = req.params;

  // Verify the application belongs to the user
  const verifySql = `
    SELECT id FROM internship_applications
    WHERE id = ? AND user_id = ?
  `;

  db.query(verifySql, [applicationId, userId], (err, results) => {
    if (err) {
      console.error("❌ Verify application error:", err);
      return res.status(500).json({ message: "Error verifying application" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Update status to withdrawn
    const updateSql = `
      UPDATE internship_applications
      SET status = 'withdrawn'
      WHERE id = ?
    `;

    db.query(updateSql, [applicationId], (updateErr) => {
      if (updateErr) {
        console.error("❌ Withdraw application error:", updateErr);
        return res.status(500).json({ message: "Failed to withdraw application" });
      }

      res.json({ message: "Application withdrawn successfully" });
    });
  });
};

/* =========================
   ADMIN: GET ALL APPLICATIONS
========================= */
export const getAllApplications = (req, res) => {
  const tokenEmail = req.user?.email;

  // Verify requester is an admin
  const adminCheckSql = `SELECT id FROM admins WHERE email = ? LIMIT 1`;
  db.query(adminCheckSql, [tokenEmail], (adminErr, adminRes) => {
    if (adminErr || !adminRes || adminRes.length === 0) {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    const sql = `
      SELECT
        ia.id,
        ia.internship_id,
        ia.user_id,
        ia.user_email,
        ia.cover_letter,
        ia.resume_url,
        ia.status,
        ia.applied_date,
        ia.response_date,
        ia.admin_message,
        i.title as internship_title,
        i.company as internship_company,
        u.name as user_name
      FROM internship_applications ia
      JOIN internships i ON ia.internship_id = i.id
      LEFT JOIN users u ON ia.user_id = u.id
      ORDER BY ia.applied_date DESC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error('❌ Fetch all applications error:', err);
        return res.status(500).json({ message: 'Failed to fetch applications' });
      }

      res.json(results || []);
    });
  });
};

/* =========================
   ADMIN: REPLY / UPDATE APPLICATION
   body: { status: 'accepted'|'rejected', admin_message: '...' }
========================= */
export const replyToApplication = (req, res) => {
  const tokenEmail = req.user?.email;
  const { applicationId } = req.params;
  const { status, admin_message } = req.body;

  if (!applicationId) return res.status(400).json({ message: 'Application id required' });
  if (!status || (status !== 'accepted' && status !== 'rejected')) {
    return res.status(400).json({ message: 'Status must be "accepted" or "rejected"' });
  }

  // Verify admin
  const adminCheckSql = `SELECT id FROM admins WHERE email = ? LIMIT 1`;
  db.query(adminCheckSql, [tokenEmail], (adminErr, adminRes) => {
    if (adminErr || !adminRes || adminRes.length === 0) {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    const updateSql = `
      UPDATE internship_applications
      SET status = ?, admin_message = ?, response_date = NOW()
      WHERE id = ?
    `;

    db.query(updateSql, [status, admin_message || null, applicationId], (err) => {
      if (err) {
        console.error('❌ Reply to application error:', err);
        return res.status(500).json({ message: 'Failed to update application' });
      }

      res.json({ message: 'Application updated' });
    });
  });
};
/* =========================
   SELECT DOMAIN OF INTEREST
========================= */
export const selectDomain = (req, res) => {
  const userId = req.user.id;
  const { domain, message } = req.body;

  if (!domain) {
    return res.status(400).json({ message: "Domain is required" });
  }

  // Save domain preference to user profile or a preferences table
  const sql = `
    UPDATE users
    SET domain_of_interest = ?
    WHERE id = ?
  `;

  db.query(sql, [domain, userId], (err, results) => {
    if (err) {
      console.error("❌ Select domain error:", err);
      return res.status(500).json({ message: "Failed to save domain preference" });
    }

    res.json({ 
      message: "Domain preference saved successfully",
      domain: domain,
      userMessage: message || null
    });
  });
};