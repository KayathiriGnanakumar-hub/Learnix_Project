import mysql from 'mysql2/promise';

async function checkQuizzes() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gnana@1972',
    database: 'learnix_db'
  });

  try {
    // Check if video_quizzes table exists and has data
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM video_quizzes');
    console.log('📊 Total quizzes in database:', rows[0].count);

    // Check sample data
    const [sampleData] = await connection.execute('SELECT id, video_id, question FROM video_quizzes LIMIT 3');
    console.log('📝 Sample quiz data:');
    sampleData.forEach(q => {
      console.log(`  - ID: ${q.id}, Video: ${q.video_id}, Q: ${q.question.substring(0, 50)}...`);
    });

    // Check available videos
    const [videos] = await connection.execute('SELECT id, title FROM videos LIMIT 5');
    console.log('\n🎬 Sample videos:');
    videos.forEach(v => {
      console.log(`  - ID: ${v.id}, Title: ${v.title}`);
    });

    // Check if specific video has quizzes
    if (videos.length > 0) {
      const videoId = videos[0].id;
      const [videoQuizzes] = await connection.execute(
        'SELECT COUNT(*) as count FROM video_quizzes WHERE video_id = ?',
        [videoId]
      );
      console.log(`\n✅ Quizzes for video ${videoId}: ${videoQuizzes[0].count}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkQuizzes();
