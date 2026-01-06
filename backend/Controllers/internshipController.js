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
  const { internshipId } = req.body;
  const { coverLetter } = req.body;

  if (!internshipId) {
    return res.status(400).json({ message: "Internship ID required" });
  }

  // Check if already applied
  const checkSql = `
    SELECT id FROM internship_applications
    WHERE internship_id = ? AND user_id = ?
  `;

  db.query(checkSql, [internshipId, userId], (err, results) => {
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

    db.query(insertSql, [internshipId, userId, userEmail, coverLetter], (insertErr) => {
      if (insertErr) {
        console.error("❌ Apply internship error:", insertErr);
        return res.status(500).json({ message: "Failed to apply for internship" });
      }

      res.json({ message: "Successfully applied for internship" });
    });
  });
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
      return res.status(500).json({ message: "Failed to fetch applications" });
    }

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
