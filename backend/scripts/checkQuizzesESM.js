import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  console.log('\n✓ Connected to database:', process.env.DB_NAME);
  console.log('=========================================\n');

  // Query to get all quizzes grouped by course
  const query = `
    SELECT 
      c.id as course_id,
      c.title as course_title,
      v.id as video_id,
      v.title as video_title,
      vq.id as quiz_id,
      vq.question,
      vq.options,
      vq.correct_option,
      COUNT(*) OVER (PARTITION BY c.id, v.id) as quiz_count_for_video
    FROM video_quizzes vq
    LEFT JOIN videos v ON vq.video_id = v.id
    LEFT JOIN courses c ON v.course_id = c.id
    ORDER BY c.id, v.id, vq.id
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Query failed:', error);
      connection.end();
      process.exit(1);
    }

    if (results.length === 0) {
      console.log('❌ NO QUIZZES FOUND in the database!');
      console.log('You need to add quizzes manually using SQL queries.');
    } else {
      console.log(`✓ Found ${results.length} quizzes\n`);

      let currentCourse = null;
      let currentVideo = null;

      results.forEach((row, index) => {
        if (currentCourse !== row.course_id) {
          console.log(`\n📚 COURSE: ${row.course_title || 'Unknown'} (ID: ${row.course_id})`);
          console.log('─'.repeat(80));
          currentCourse = row.course_id;
          currentVideo = null;
        }

        if (currentVideo !== row.video_id) {
          console.log(`   🎥 Video: ${row.video_title || 'Unknown'} (ID: ${row.video_id})`);
          console.log(`      Quizzes: ${row.quiz_count_for_video}`);
          currentVideo = row.video_id;
        }

        console.log(`      ${index + 1}. Q: ${row.question?.substring(0, 50)}...`);
        console.log(`         Correct: ${row.correct_option}`);
      });

      console.log('\n' + '═'.repeat(80));
      console.log(`\n✓ Total quizzes in database: ${results.length}`);
    }

    connection.end();
  });
});
