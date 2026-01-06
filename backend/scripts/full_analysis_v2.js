import mysql from 'mysql2';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('❌ DB Connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL\n');

  // Get the most recently enrolled user
  const userQuery = `
    SELECT e.user_email, u.id as user_id, e.id as enrollment_id
    FROM enrollments e
    JOIN users u ON u.email = e.user_email
    ORDER BY e.id DESC
    LIMIT 1
  `;

  db.query(userQuery, (err, userResults) => {
    if (err) {
      console.error('❌ Error fetching user:', err.message);
      db.end();
      process.exit(1);
    }

    if (userResults.length === 0) {
      console.log('⚠️ No enrollments found');
      db.end();
      process.exit(0);
    }

    const { user_email, user_id } = userResults[0];
    console.log(`📧 Analyzing user: ${user_email} (ID: ${user_id})\n`);

    // 1. Check enrollments
    console.log('=== ENROLLMENTS ===');
    const enrollmentQuery = `
      SELECT e.id, e.course_id, c.title, e.status, e.progress, e.completed_at
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_email = ?
      ORDER BY e.id DESC
    `;

    db.query(enrollmentQuery, [user_email], (err, enrollments) => {
      if (err) {
        console.error('❌ Error fetching enrollments:', err.message);
        db.end();
        process.exit(1);
      }

      console.table(enrollments);

      // 2. Check quiz results
      console.log('\n=== QUIZ RESULTS ===');
      const quizQuery = `
        SELECT qr.id, v.title as video_title, c.title as course_title, qr.percentage, qr.passed, qr.taken_at
        FROM quiz_results qr
        JOIN videos v ON qr.video_id = v.id
        JOIN courses c ON qr.course_id = c.id
        WHERE qr.user_id = ?
        ORDER BY qr.taken_at DESC
        LIMIT 20
      `;

      db.query(quizQuery, [user_id], (err, quizzes) => {
        if (err) {
          console.error('❌ Error fetching quizzes:', err.message);
          db.end();
          process.exit(1);
        }

        if (quizzes.length === 0) {
          console.log('No quiz results found');
        } else {
          console.table(quizzes);
        }

        // 3. For each course, check completion status
        console.log('\n=== COMPLETION ANALYSIS ===');
        
        let checkedCount = 0;
        enrollments.forEach(enrollment => {
          const courseId = enrollment.course_id;
          
          const checkCompletionQuery = `
            SELECT 
              COUNT(DISTINCT vq.id) as totalQuizzes,
              COUNT(DISTINCT CASE WHEN qr.passed = 1 THEN vq.id END) as passedQuizzes,
              COUNT(DISTINCT v.id) as totalVideos,
              COUNT(DISTINCT vp.id) as completedVideos
            FROM videos v
            LEFT JOIN video_quizzes vq ON v.id = vq.video_id
            LEFT JOIN quiz_results qr ON qr.video_id = vq.video_id AND qr.user_id = ?
            LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_email = ? AND vp.completed = 1
            WHERE v.course_id = ?
          `;

          db.query(checkCompletionQuery, [user_id, user_email, courseId], (err, result) => {
            if (err) {
              console.error('Error checking completion:', err.message);
              checkedCount++;
              return;
            }

            const { totalQuizzes, passedQuizzes, totalVideos, completedVideos } = result[0];
            console.log(`\nCourse: ${enrollment.title}`);
            console.log(`  Current Status: ${enrollment.status} | Progress: ${enrollment.progress}%`);
            console.log(`  Videos: ${completedVideos}/${totalVideos} completed`);
            console.log(`  Quizzes: ${passedQuizzes}/${totalQuizzes} passed`);
            
            const allVideosWatched = totalVideos > 0 && completedVideos === totalVideos;
            const allQuizzesPassed = totalQuizzes > 0 && passedQuizzes === totalQuizzes;
            
            console.log(`  ✓ All videos watched: ${allVideosWatched ? 'YES ✅' : 'NO ❌'}`);
            console.log(`  ✓ All quizzes passed: ${allQuizzesPassed ? 'YES ✅' : 'NO ❌'}`);
            console.log(`  → Should be marked as 'completed': ${allVideosWatched && allQuizzesPassed ? 'YES ✅' : 'NO ❌'}`);

            if (allVideosWatched && allQuizzesPassed && enrollment.status !== 'completed') {
              console.log(`  ⚠️ ERROR: Status should be 'completed' but is '${enrollment.status}'`);
            }

            checkedCount++;
            if (checkedCount === enrollments.length) {
              console.log('\n=== SUMMARY ===');
              const completedEnrollments = enrollments.filter(e => e.status === 'completed' && e.progress === 100);
              console.log(`Total enrollments: ${enrollments.length}`);
              console.log(`Completed (status='completed' AND progress=100): ${completedEnrollments.length}`);
              console.log(`→ Certificates should be available for: ${completedEnrollments.length}`);
              
              db.end();
              process.exit(0);
            }
          });
        });

        if (enrollments.length === 0) {
          db.end();
          process.exit(0);
        }
      });
    });
  });
});
