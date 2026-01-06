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

  const sql = `
    SELECT e.id, e.user_email, u.id as user_id, e.course_id, e.status, e.progress, e.completed_at
    FROM enrollments e
    LEFT JOIN users u ON u.email = e.user_email
    WHERE e.progress = 100 OR e.status = 'completed'
    ORDER BY e.completed_at DESC
    LIMIT 50
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Query error:', err.message);
      db.end();
      process.exit(1);
    }

    console.log('📚 Completed enrollments (progress=100 or status=completed):');
    console.table(results);
    db.end();
    process.exit(0);
  });
});
