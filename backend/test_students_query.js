import db from './config/db.js';

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
  LIMIT 3
`;

db.query(sql, (err, results) => {
  if (err) {
    console.log('❌ Error:', err.message);
  } else {
    console.log('✅ Query successful!');
    console.log('Records count:', results.length);
    results.forEach((r, i) => {
      console.log(`\nRecord ${i+1}:`);
      console.log(`  Name: ${r.name}, Email: ${r.email}`);
      console.log(`  Courses: ${r.enrolled_courses_count}, Avg Progress: ${r.avg_progress}%`);
      console.log(`  Last Activity: ${r.last_activity || 'Never'}`);
    });
  }
  process.exit(0);
});
