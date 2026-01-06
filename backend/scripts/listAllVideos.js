import mysql from 'mysql2/promise';

async function getAllVideos() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gnana@1972',
    database: 'learnix_db'
  });

  try {
    const [videos] = await connection.execute('SELECT id, title, course_id FROM videos ORDER BY id');
    console.log('\n📺 All videos in database:\n');
    videos.forEach(v => {
      console.log(`ID: ${v.id} | Course: ${v.course_id} | Title: ${v.title}`);
    });
    console.log(`\nTotal videos: ${videos.length}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

getAllVideos();
