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
    SELECT DISTINCT e.user_email, u.id as user_id
    FROM enrollments e
    JOIN users u ON u.email = e.user_email
    WHERE e.progress > 0 OR e.status = 'completed'
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
      SELECT e.id, c.title, e.status, e.progress, e.completed_at
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
      `;

      db.query(quizQuery, [user_id], (err, quizzes) => {
        if (err) {
          console.error('❌ Error fetching quizzes:', err.message);
          db.end();
          process.exit(1);
        }

        console.table(quizzes);

        // 3. Check video progress
        console.log('\n=== VIDEO PROGRESS ===');
        const videoProgressQuery = `
          SELECT v.id, v.title, c.title as course_title, vp.completed, vp.completed_at
          FROM videos v
          LEFT JOIN video_progress vp ON v.id = vp.video_id AND vp.user_email = ?
          JOIN courses c ON v.course_id = c.id
          WHERE c.id IN (SELECT course_id FROM enrollments WHERE user_email = ?)
          ORDER BY c.id, v.order_no
        `;

        db.query(videoProgressQuery, [user_email, user_email], (err, videos) => {
          if (err) {
            console.error('❌ Error fetching video progress:', err.message);
            db.end();
            process.exit(1);
          }

          console.table(videos);

          // 4. For each enrollment, check if it should be marked as completed
          console.log('\n=== COMPLETION CHECK ===');
          const enrollmentIds = enrollments.map(e => e.id);
          
          if (enrollmentIds.length === 0) {
            console.log('No enrollments to check');
            db.end();
            process.exit(0);
          }

          // For each enrollment's course, check completion status
          enrollments.forEach((enrollment, index) => {
            const courseId = enrollments[index].id; // This is actually course title, need to get course_id
            console.log(`\nEnrollment: ${enrollment.title}`);
            console.log(`  Status: ${enrollment.status}`);
            console.log(`  Progress: ${enrollment.progress}%`);
            console.log(`  Completed: ${enrollment.completed_at ? 'YES' : 'NO'}`);
          });

          // Get course IDs for detailed check
          const courseCheckQuery = `
            SELECT DISTINCT e.course_id, c.title
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_email = ?
          `;

          db.query(courseCheckQuery, [user_email], (err, courseList) => {
            if (err) {
              console.log('Error checking courses');
              db.end();
              process.exit(1);
            }

            // For each course, check if all quizzes are passed
            let checkedCount = 0;
            courseList.forEach(course => {
              const courseId = course.course_id;
              
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
                console.log(`\nCourse: ${course.title} (ID: ${courseId})`);
                console.log(`  Videos: ${completedVideos}/${totalVideos} completed`);
                console.log(`  Quizzes: ${passedQuizzes}/${totalQuizzes} passed`);
                
                const allVideosWatched = totalVideos > 0 && completedVideos === totalVideos;
                const allQuizzesPassed = totalQuizzes > 0 && passedQuizzes === totalQuizzes;
                
                console.log(`  ✓ All videos watched: ${allVideosWatched}`);
                console.log(`  ✓ All quizzes passed: ${allQuizzesPassed}`);
                console.log(`  → Should mark as completed: ${allVideosWatched && allQuizzesPassed ? 'YES ✅' : 'NO ❌'}`);

                checkedCount++;
                if (checkedCount === courseList.length) {
                  db.end();
                  process.exit(0);
                }
              });
            });

            if (courseList.length === 0) {
              db.end();
              process.exit(0);
            }
          });
        });
      });
    });
  });
});
