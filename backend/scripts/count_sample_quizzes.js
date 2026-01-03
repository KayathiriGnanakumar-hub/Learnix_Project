import dotenv from 'dotenv';
import db from '../config/db.js';

dotenv.config();

const sql = `SELECT COUNT(*) AS count FROM quizzes WHERE question LIKE 'Sample%';`;

db.query(sql, (err, rows) => {
  if (err) {
    console.error('Error counting sample quizzes:', err);
    db.end();
    process.exit(1);
  }

  console.log('Sample questions remaining:', rows[0].count);
  db.end();
  process.exit(0);
});
