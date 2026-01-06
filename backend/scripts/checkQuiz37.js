import mysql from 'mysql2/promise';

async function checkQuiz() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Gnana@1972',
      database: 'learnix_db'
    });

    console.log('\n🔍 Checking quizzes for video 37...\n');

    const [rows] = await connection.execute(
      'SELECT id, video_id, question, options, correct_option FROM video_quizzes WHERE video_id = 37 LIMIT 10'
    );

    console.log(`Found ${rows.length} quizzes:\n`);

    rows.forEach((row, idx) => {
      console.log(`--- Quiz ${idx + 1} ---`);
      console.log(`Question: ${row.question}`);
      console.log(`Options (raw): "${row.options}"`);
      console.log(`Type: ${typeof row.options}`);
      
      if (row.options) {
        let opts = [];
        try {
          opts = JSON.parse(row.options);
          console.log(`Parsed as JSON:`, opts);
        } catch (e) {
          console.log(`JSON parse failed, trying comma split...`);
          opts = row.options.split(",").map(opt => opt.trim());
          console.log(`Parsed as comma-separated:`, opts);
        }
      }
      console.log(`\n`);
    });

    await connection.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkQuiz();
