import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection error:", err);
    process.exit(1);
  }
  console.log("✅ Connected to database");

  // Query 1: Get user ID for anitha@gmail.com
  const userQuery = `SELECT id, email, name FROM users WHERE email = 'anitha@gmail.com'`;
  
  db.query(userQuery, (err, userResults) => {
    if (err) {
      console.error("❌ User query error:", err);
    } else {
      console.log("\n📧 User Details:");
      console.log(userResults);
      
      if (userResults.length > 0) {
        const userId = userResults[0].id;
        
        // Query 2: Check enrollments for this user and course 1
        const enrollmentQuery = `
          SELECT e.*, c.title 
          FROM enrollments e
          JOIN courses c ON e.course_id = c.id
          WHERE e.user_email = 'anitha@gmail.com' AND e.course_id = 1
        `;
        
        db.query(enrollmentQuery, (err, enrollResults) => {
          if (err) {
            console.error("❌ Enrollment query error:", err);
          } else {
            console.log("\n📚 Enrollment Details:");
            console.log(enrollResults);
            
            // Query 3: Test the exact query from certificateController.js
            const certQuery = `
              SELECT 
                e.completed_at,
                u.name,
                u.email as userEmail,
                c.title,
                c.id,
                e.progress,
                e.status,
                (
                  SELECT COUNT(*)
                  FROM video_quizzes vq
                  JOIN videos v ON vq.video_id = v.id
                  WHERE v.course_id = ?
                ) as totalQuizzes
              FROM enrollments e
              JOIN users u ON u.email = e.user_email
              JOIN courses c ON e.course_id = c.id
              WHERE u.id = ? AND e.course_id = ? AND e.status = 'completed' AND e.progress = 100
            `;
            
            db.query(certQuery, [1, userId, 1], (err, certResults) => {
              if (err) {
                console.error("❌ Certificate query error:", err);
              } else {
                console.log("\n🎓 Certificate Generation Query Results:");
                console.log(certResults);
                
                if (certResults.length === 0) {
                  console.log("\n⚠️ WARNING: Certificate query returned NO ROWS");
                  console.log(`   User ID: ${userId}`);
                  console.log(`   Course ID: 1`);
                  console.log(`   Expected: e.status='completed' AND e.progress=100`);
                } else {
                  console.log("\n✅ Certificate query PASSED - should generate");
                }
              }
              
              db.end();
            });
          }
        });
      } else {
        console.log("⚠️ User anitha@gmail.com not found");
        db.end();
      }
    }
  });
});
