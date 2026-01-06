import db from './config/db.js';

const userId = 40;

const sql = `
  SELECT 
    ia.id,
    ia.internship_id,
    ia.status,
    ia.applied_date,
    i.title,
    i.company,
    i.location,
    i.job_type,
    i.stipend
  FROM internship_applications ia
  JOIN internships i ON ia.internship_id = i.id
  WHERE ia.user_id = ?
  ORDER BY ia.applied_date DESC
`;

db.query(sql, [userId], (err, results) => {
  console.log('\n=== USER APPLICATIONS (User ID: ' + userId + ') ===');
  console.log('Error:', err);
  console.log('Results:', JSON.stringify(results, null, 2));

  if (!err && results.length > 0) {
    console.log('\n✅ Query returned data successfully');
    console.log('Columns available:', Object.keys(results[0]));
  } else if (err) {
    console.log('\n❌ Query failed');
  } else {
    console.log('\n⚠️ No results found for this user');
  }

  process.exit(0);
});
