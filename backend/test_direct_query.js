import db from './config/db.js';
import jwt from 'jsonwebtoken';

// Create a test token
const SECRET = 'your_secret_key';
const testToken = jwt.sign(
  { id: 1, email: 'admin@learnix.com' },
  SECRET
);

console.log('Testing getStudents query directly...\n');

// Simulate the query that the endpoint runs
const sql = `
  SELECT
    u.id,
    u.name,
    u.email,
    u.created_at,
    GROUP_CONCAT(DISTINCT c.title SEPARATOR ', ') AS enrolled_courses,
    COUNT(DISTINCT e.id) AS enrolled_courses_count,
    ROUND(AVG(IFNULL(e.progress,0)),2) AS avg_progress,
    COALESCE(MAX(qr.taken_at), MAX(e.completed_at)) AS last_activity
  FROM users u
  LEFT JOIN enrollments e ON u.email = e.user_email
  LEFT JOIN courses c ON e.course_id = c.id
  LEFT JOIN quiz_results qr ON qr.user_id = u.id
  GROUP BY u.id, u.email
  ORDER BY u.created_at DESC
`;

db.query(sql, (err, results) => {
  if (err) {
    console.log('❌ Database Error:');
    console.log('  Message:', err.message);
    console.log('  Code:', err.code);
    console.log('  SQL State:', err.sqlState);
  } else {
    console.log('✅ Query Success!');
    console.log(`Total students: ${results.length}`);
    
    // Normalize like the controller does
    const normalized = results.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      created_at: r.created_at,
      enrolled_courses: r.enrolled_courses || "",
      enrolled_courses_count: r.enrolled_courses_count || 0,
      avg_progress: r.avg_progress != null ? Number(r.avg_progress) : 0,
      last_activity: r.last_activity || null,
    }));
    
    if (normalized.length > 0) {
      console.log('\nFirst student:', JSON.stringify(normalized[0], null, 2));
    }
  }
  process.exit(0);
});
