import mysql from 'mysql2/promise';

async function fixOptions() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gnana@1972',
    database: 'learnix_db'
  });

  try {
    const [rows] = await conn.execute('SELECT id, options FROM video_quizzes');
    console.log(`Found ${rows.length} quiz rows`);

    let updated = 0;
    for (const r of rows) {
      const raw = r.options;
      if (!raw) continue;

      // If already JSON array (starts with [), skip
      const trimmed = String(raw).trim();
      if (trimmed.startsWith('[')) continue;

      // Split by comma and clean
      const arr = trimmed.split(',').map(s => s.trim()).filter(Boolean);
      const json = JSON.stringify(arr);

      await conn.execute('UPDATE video_quizzes SET options = ? WHERE id = ?', [json, r.id]);
      updated++;
    }

    console.log(`Updated ${updated} rows to JSON arrays`);
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
}

fixOptions();
