const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gnana@1972',
  database: 'learnix_db'
});

// Check all quizzes with course info
conn.query(`
  SELECT 
    vq.id as quiz_id,
    vq.video_id,
    vq.question,
    vq.option_a,
    vq.option_b,
    vq.option_c,
    vq.option_d,
    vq.correct_option,
    v.title as video_title,
    v.course_id,
    c.title as course_title
  FROM video_quizzes vq
  JOIN videos v ON vq.video_id = v.id
  JOIN courses c ON v.course_id = c.id
  LIMIT 20
`, (err, results) => {
  if (err) {
    console.error('❌ Error:', err.message);
    conn.end();
    return;
  }
  console.log('\n✅ QUIZZES IN DATABASE:\n');
  if (results.length === 0) {
    console.log('❌ No quizzes found!');
  } else {
    results.forEach((q, idx) => {
      console.log(`${idx + 1}. Quiz ID: ${q.quiz_id}`);
      console.log(`   Course: ${q.course_title} (ID: ${q.course_id})`);
      console.log(`   Video: ${q.video_title} (ID: ${q.video_id})`);
      console.log(`   Question: ${q.question}`);
      console.log(`   Options: A) ${q.option_a}, B) ${q.option_b}, C) ${q.option_c}, D) ${q.option_d}`);
      console.log(`   Correct: ${q.correct_option}`);
      console.log('');
    });
  }
  conn.end();
});
