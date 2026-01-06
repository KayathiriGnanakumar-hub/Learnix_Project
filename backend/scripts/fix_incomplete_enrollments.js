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

  // Find enrollments where all quizzes are passed but status is not 'completed'
  const findQuery = `
    SELECT DISTINCT e.id, e.user_email, e.course_id, c.title
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.status != 'completed'
    AND e.course_id IN (
      SELECT DISTINCT v.course_id
      FROM videos v
      JOIN video_quizzes vq ON v.id = vq.video_id
      WHERE v.course_id IN (
        SELECT DISTINCT e2.course_id
        FROM enrollments e2
        WHERE e2.user_email = e.user_email
      )
      GROUP BY v.course_id
      HAVING COUNT(DISTINCT vq.id) = COUNT(DISTINCT CASE WHEN EXISTS(
        SELECT 1 FROM quiz_results qr 
        WHERE qr.video_id = vq.video_id 
        AND qr.user_email = e.user_email 
        AND qr.passed = 1
      ) THEN vq.id END)
    )
  `;

  // Simpler approach: Get enrollments where not completed, then check each
  const simpleQuery = `
    SELECT e.id, e.user_email, e.course_id, c.title
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.status != 'completed'
    ORDER BY e.id DESC
    LIMIT 10
  `;

  db.query(simpleQuery, (err, enrollments) => {
    if (err) {
      console.error('❌ Error fetching enrollments:', err.message);
      db.end();
      process.exit(1);
    }

    console.log(`Found ${enrollments.length} incomplete enrollments. Checking each...\n`);

    let checked = 0;
    let updated = 0;

    enrollments.forEach(enrollment => {
      const { id, user_email, course_id, title } = enrollment;

      const checkQuery = `
        SELECT 
          COUNT(DISTINCT vq.id) as totalQuizzes,
          COUNT(DISTINCT CASE WHEN qr.passed = 1 THEN vq.id END) as passedQuizzes
        FROM video_quizzes vq
        JOIN videos v ON vq.video_id = v.id
        LEFT JOIN quiz_results qr 
          ON qr.video_id = vq.video_id 
          AND qr.user_email = ?
          AND qr.passed = 1
        WHERE v.course_id = ?
      `;

      db.query(checkQuery, [user_email, course_id], (err, result) => {
        if (err) {
          console.error('Error checking:', err.message);
          checked++;
          return;
        }

        const { totalQuizzes, passedQuizzes } = result[0];
        if (totalQuizzes > 0 && passedQuizzes === totalQuizzes) {
          console.log(`✅ ${title} - All ${totalQuizzes} quizzes passed. Marking as completed...`);

          const updateQuery = `
            UPDATE enrollments 
            SET progress = 100, status = 'completed', completed_at = NOW()
            WHERE id = ?
          `;

          db.query(updateQuery, [id], (err, updateResult) => {
            if (err) {
              console.error('Error updating:', err.message);
            } else {
              console.log(`   Updated enrollment ${id}`);
              updated++;
            }
            checked++;

            if (checked === enrollments.length) {
              console.log(`\n✅ Updated ${updated} enrollments to 'completed' status`);
              db.end();
              process.exit(0);
            }
          });
        } else {
          console.log(`❌ ${title} - Only ${passedQuizzes}/${totalQuizzes} quizzes passed. Skipping.`);
          checked++;

          if (checked === enrollments.length) {
            console.log(`\n✅ Updated ${updated} enrollments to 'completed' status`);
            db.end();
            process.exit(0);
          }
        }
      });
    });

    if (enrollments.length === 0) {
      console.log('No incomplete enrollments found.');
      db.end();
      process.exit(0);
    }
  });
});
