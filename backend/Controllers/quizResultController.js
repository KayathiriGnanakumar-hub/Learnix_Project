import db from "../config/db.js";

/* =========================
   CREATE QUIZ RESULTS TABLE (if not exists)
========================= */
// NOTE: Table initialization is now handled centrally in
// `backend/scripts/initializeDatabase.js`. Avoid running table-creation
// at module import time to prevent startup race conditions when the DB
// isn't yet reachable.
const initializeQuizResultsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      user_email VARCHAR(255) NOT NULL,
      video_id INT NOT NULL,
      course_id INT NOT NULL,
      score INT NOT NULL,
      total_questions INT NOT NULL,
      percentage DECIMAL(5,2) NOT NULL,
      passed BOOLEAN DEFAULT FALSE,
      taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (video_id) REFERENCES videos(id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      INDEX idx_user_course (user_id, course_id),
      INDEX idx_user_video (user_id, video_id)
    )
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("❌ Error creating quiz_results table:", err);
    } else {
      console.log("✅ Quiz results table ready");
    }
  });
};

// Do NOT call `initializeQuizResultsTable()` here; `initializeDatabase()`
// will run all table creation SQL at server startup once DB is reachable.

/* =========================
   SAVE QUIZ RESULT
========================= */
export const saveQuizResult = (req, res) => {
  const { videoId, courseId, score, totalQuestions } = req.body;
  const { id: userId, email: userEmail } = req.user;

  if (!videoId || !courseId || score === undefined || !totalQuestions) {
    return res.status(400).json({ message: "Missing required quiz data" });
  }

  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= 70;

  console.log(`\n📝 Saving quiz result:`);
  console.log(`  User: ${userEmail} (${userId})`);
  console.log(`  Video: ${videoId}, Course: ${courseId}`);
  console.log(`  Score: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)`);
  console.log(`  Passed: ${passed}\n`);

  const sql = `
    INSERT INTO quiz_results 
    (user_id, user_email, video_id, course_id, score, total_questions, percentage, passed)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [userId, userEmail, videoId, courseId, score, totalQuestions, percentage, passed],
    (err) => {
      if (err) {
        console.error("❌ Save quiz result error:", err);
        return res.status(500).json({ message: "Failed to save quiz result" });
      }

      // After saving quiz result, check if course should be marked as completed
      checkAndCompleteCourse(userId, userEmail, courseId, (completed) => {
        res.json({
          message: "Quiz result saved",
          score,
          totalQuestions,
          percentage: percentage.toFixed(1),
          passed,
          courseCompleted: completed
        });
      });
    }
  );
};

/* HELPER: Check if course should be marked as completed */
const checkAndCompleteCourse = (userId, userEmail, courseId, callback) => {
  // Check: Are all quizzes passed?
  const quizSql = `
    SELECT 
      COUNT(DISTINCT vq.id) as totalQuizzes,
      COUNT(DISTINCT CASE WHEN qr.passed = 1 THEN vq.id END) as passedQuizzes
    FROM video_quizzes vq
    JOIN videos v ON vq.video_id = v.id
    LEFT JOIN quiz_results qr 
      ON qr.video_id = vq.video_id 
      AND qr.user_id = ?
      AND qr.course_id = ?
    WHERE v.course_id = ?
  `;

  db.query(quizSql, [userId, courseId, courseId], (err, quizResults) => {
    if (err) {
      console.error("❌ Error checking quiz results:", err);
      return callback(false);
    }

    const { totalQuizzes, passedQuizzes } = quizResults[0];
    const allQuizzesPassed = totalQuizzes > 0 && passedQuizzes === totalQuizzes;

    console.log(`📝 Quiz Progress: ${passedQuizzes}/${totalQuizzes} quizzes passed`);

    if (!allQuizzesPassed) {
      console.log("⏳ Not all quizzes passed yet");
      return callback(false);
    }

    // All quizzes passed - mark course as completed
    console.log("✅ All quizzes passed! Marking course as completed...");
    
    const completionSql = `
      UPDATE enrollments 
      SET progress = 100, status = 'completed', completed_at = NOW()
      WHERE user_email = ? AND course_id = ? AND status != 'completed'
    `;

    db.query(completionSql, [userEmail, courseId], (err, result) => {
      if (err) {
        console.error("❌ Error updating enrollment status:", err);
        return callback(false);
      }

      console.log("✅ Enrollment marked as completed! Affected rows:", result.affectedRows);
      callback(true);
    });
  });
};

/* =========================
   GET QUIZ RESULTS FOR COURSE
========================= */
export const getCourseQuizResults = (req, res) => {
  const { courseId } = req.params;
  const { id: userId, email: userEmail } = req.user;

  const sql = `
    SELECT 
      qr.id,
      qr.video_id,
      qr.score,
      qr.total_questions,
      qr.percentage,
      qr.passed,
      qr.taken_at,
      v.title as video_title,
      v.order_no
    FROM quiz_results qr
    JOIN videos v ON qr.video_id = v.id
    WHERE qr.user_id = ? AND qr.course_id = ?
    ORDER BY v.order_no ASC
  `;

  db.query(sql, [userId, courseId], (err, results) => {
    if (err) {
      console.error("❌ Fetch quiz results error:", err);
      return res.status(500).json({ message: "Failed to fetch quiz results" });
    }

    console.log(`\n📊 Course ${courseId} Quiz Results for user ${userId}:`);
    console.log(`  - Total quizzes taken: ${results.length}`);
    results.forEach((r) => {
      console.log(`    - Video ${r.video_id}: ${r.percentage}% (${r.passed ? "✅ PASSED" : "❌ FAILED"})`);
    });
    console.log("");

    res.json(results);
  });
};

/* =========================
   GET ALL QUIZ RESULTS FOR USER
========================= */
export const getUserAllQuizResults = (req, res) => {
  const { id: userId } = req.user;

  const sql = `
    SELECT 
      qr.id,
      qr.user_id,
      qr.video_id,
      qr.course_id,
      qr.score,
      qr.total_questions,
      qr.percentage,
      qr.passed,
      qr.taken_at,
      v.title as video_title,
      c.title as course_title,
      c.id as courseId
    FROM quiz_results qr
    JOIN videos v ON qr.video_id = v.id
    JOIN courses c ON qr.course_id = c.id
    WHERE qr.user_id = ?
    ORDER BY qr.taken_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Fetch all quiz results error:", err);
      return res.status(500).json({ message: "Failed to fetch quiz results" });
    }

    // Group by course
    const grouped = {};
    results.forEach((result) => {
      if (!grouped[result.course_id]) {
        grouped[result.course_id] = {
          courseId: result.course_id,
          courseName: result.course_title,
          quizzes: [],
          passPercentage: 0
        };
      }
      grouped[result.course_id].quizzes.push(result);
    });

    // Calculate pass percentage for each course
    Object.keys(grouped).forEach((courseId) => {
      const course = grouped[courseId];
      const passedCount = course.quizzes.filter(q => q.passed).length;
      course.passPercentage = (passedCount / course.quizzes.length) * 100;
    });

    console.log(`\n📊 All Quiz Results for user ${userId}:`);
    Object.values(grouped).forEach((course) => {
      console.log(`  Course: ${course.courseName} - ${course.passPercentage.toFixed(1)}% quizzes passed`);
    });
    console.log("");

    res.json(Object.values(grouped));
  });
};

/* =========================
   CHECK IF ALL COURSE QUIZZES PASSED
========================= */
export const checkCourseQuizzesPassed = (req, res) => {
  const { courseId } = req.params;
  const { id: userId } = req.user;

  // Get all quizzes for this course
  const quizzesCountSql = `
    SELECT COUNT(*) as totalQuizzes
    FROM video_quizzes vq
    JOIN videos v ON vq.video_id = v.id
    WHERE v.course_id = ?
  `;

  db.query(quizzesCountSql, [courseId], (err, countResults) => {
    if (err) {
      console.error("❌ Count quizzes error:", err);
      return res.status(500).json({ message: "Failed to check quizzes" });
    }

    const totalQuizzes = countResults[0].totalQuizzes || 0;

    if (totalQuizzes === 0) {
      return res.json({
        allPassed: true,
        passedQuizzes: 0,
        totalQuizzes: 0,
        message: "No quizzes in this course"
      });
    }

    // Get passed quizzes
    const passedSql = `
      SELECT COUNT(*) as passedQuizzes
      FROM quiz_results
      WHERE user_id = ? AND course_id = ? AND passed = TRUE
    `;

    db.query(passedSql, [userId, courseId], (err, passedResults) => {
      if (err) {
        console.error("❌ Count passed quizzes error:", err);
        return res.status(500).json({ message: "Failed to check passed quizzes" });
      }

      const passedQuizzes = passedResults[0].passedQuizzes || 0;
      const allPassed = passedQuizzes >= totalQuizzes;

      console.log(`\n✅ Quiz Status for Course ${courseId}, User ${userId}:`);
      console.log(`  - Passed: ${passedQuizzes}/${totalQuizzes}`);
      console.log(`  - All Passed: ${allPassed}\n`);

      res.json({
        allPassed,
        passedQuizzes,
        totalQuizzes,
        message: allPassed 
          ? "All quizzes passed! Course can be completed."
          : `${totalQuizzes - passedQuizzes} quiz(zes) remaining`
      });
    });
  });
};

/* =========================
   GET QUIZ STATISTICS
========================= */
export const getQuizStatistics = (req, res) => {
  const { id: userId } = req.user;

  const sql = `
    SELECT 
      c.id as courseId,
      c.title as courseName,
      COUNT(DISTINCT qr.video_id) as quizzesTaken,
      COUNT(DISTINCT CASE WHEN qr.passed = TRUE THEN qr.video_id END) as quizzesPassed,
      ROUND(AVG(qr.percentage), 2) as averageScore,
      MAX(qr.percentage) as bestScore,
      MIN(qr.percentage) as worstScore
    FROM quiz_results qr
    JOIN courses c ON qr.course_id = c.id
    WHERE qr.user_id = ?
    GROUP BY c.id, c.title
    ORDER BY c.id ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("❌ Quiz statistics error:", err);
      return res.status(500).json({ message: "Failed to fetch quiz statistics" });
    }

    console.log(`\n📊 Quiz Statistics for user ${userId}:`);
    results.forEach((r) => {
      console.log(`  Course: ${r.courseName}`);
      console.log(`    - Quizzes Taken: ${r.quizzesTaken}`);
      console.log(`    - Quizzes Passed: ${r.quizzesPassed}`);
      console.log(`    - Average Score: ${r.averageScore}%`);
    });
    console.log("");

    res.json(results);
  });
};
