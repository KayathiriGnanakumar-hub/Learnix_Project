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

const userId = 39; // change as needed
const courseId = 1;

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

db.connect((err) => {
  if (err) {
    console.error('❌ DB connect error:', err.message);
    process.exit(1);
  }
  db.query(sql, [courseId, userId, courseId], (err, results) => {
    if (err) {
      console.error('❌ Query error:', err.message);
      db.end();
      process.exit(1);
    }

    console.log('📋 Certificate query results for userId', userId, 'courseId', courseId);
    console.log(results);
    db.end();
    process.exit(0);
  });
});
