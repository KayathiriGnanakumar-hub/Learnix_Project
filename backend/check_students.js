import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'learnix_db'
    });
    
    console.log('Connected to database');
    
    const [users] = await conn.execute('SELECT COUNT(*) as count FROM users');
    console.log('Total users in database:', users[0].count);
    
    const [enrollments] = await conn.execute('SELECT COUNT(*) as count FROM enrollments');
    console.log('Total enrollments in database:', enrollments[0].count);
    
    if (users[0].count > 0) {
      const [sampleUsers] = await conn.execute('SELECT id, name, email FROM users LIMIT 3');
      console.log('Sample users:', sampleUsers);
    }
    
    conn.end();
  } catch (error) {
    console.error('Database error:', error.message);
  }
})();
