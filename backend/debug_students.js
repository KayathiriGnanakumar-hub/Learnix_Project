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
    MAX(
      GREATEST(
        IFNULL(MAX(vp.updated_at), '1970-01-01'),
        IFNULL(MAX(qr.created_at), '1970-01-01'),
        IFNULL(MAX(e.updated_at), '1970-01-01')
      )
    ) AS last_activity
  FROM users u
  LEFT JOIN enrollments e ON u.email = e.user_email
  LEFT JOIN courses c ON e.course_id = c.id
  LEFT JOIN video_progress vp ON vp.user_email = u.email
  LEFT JOIN quiz_results qr ON qr.user_id = u.id
  GROUP BY u.id, u.email
  ORDER BY u.created_at DESC
`;

db.query(sql, (err, results) => {
  if (err) {
    console.error('❌ Query Error:', err.message);
    console.error('Full Error:', err);
  } else {
    console.log('✅ Query successful');
    console.log('Results count:', results.length);
    if (results.length > 0) {
      console.log('First record:', JSON.stringify(results[0], null, 2));
    }
  }
  process.exit(0);
});
