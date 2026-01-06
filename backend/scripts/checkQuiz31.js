import mysql from 'mysql2/promise';

async function checkQuiz() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Gnana@1972',
      database: 'learnix_db'
    });

    console.log('\n🔍 Checking quizzes for video 31...\n');

    const [rows] = await connection.execute(
      'SELECT id, video_id, question, options, correct_option FROM video_quizzes WHERE video_id = 31 LIMIT 10'
    );

    console.log(`Found ${rows.length} quizzes:\n`);

    rows.forEach((row, idx) => {
      console.log(`--- Quiz ${idx + 1} ---`);
      console.log(`ID: ${row.id}`);
      console.log(`Video ID: ${row.video_id}`);
      console.log(`Question: ${row.question}`);
      console.log(`Options (raw): ${row.options}`);
      
      try {
        const parsed = JSON.parse(row.options || '[]');
        console.log(`Options (parsed):`, parsed);
      } catch (e) {
        console.log(`❌ Failed to parse:`, e.message);
      }
      
      console.log(`Correct Option: ${row.correct_option}\n`);
    });

    await connection.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkQuiz();
