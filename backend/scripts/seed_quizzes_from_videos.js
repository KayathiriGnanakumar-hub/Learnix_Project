import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

// Usage:
// node scripts/seed_quizzes_from_videos.js <countPerVideo>
// If <countPerVideo> is omitted, defaults to 10

const argCount = process.argv[2] || "10";
const count = parseInt(argCount, 10) || 10;

const selectSql = `
  SELECT v.id AS video_id, c.title AS course_title
  FROM videos v
  LEFT JOIN courses c ON v.course_id = c.id
`;

const insertSql = `
  INSERT INTO quizzes
  (video_id, question, option_a, option_b, option_c, option_d, correct_option)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

function makeQuestionTemplate(courseTitle, idx) {
  const templates = [
    `Which topic does the course "${courseTitle}" primarily cover?`,
    `What is a key subject in "${courseTitle}"?`,
    `The course "${courseTitle}" teaches which of these?`,
    `Which area is emphasized by the course "${courseTitle}"?`,
    `Which skill will you gain from "${courseTitle}"?`,
    `What best describes the course "${courseTitle}"?`,
    `Which concept is central to "${courseTitle}"?`,
    `What will you learn in "${courseTitle}"?`,
    `Which of the following relates to "${courseTitle}"?`,
    `What is the main focus of "${courseTitle}"?`,
  ];

  return templates[(idx - 1) % templates.length];
}

db.query(selectSql, (err, rows) => {
  if (err) {
    console.error("Error selecting videos:", err);
    db.end();
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("No videos found. Make sure the videos table has rows.");
    db.end();
    process.exit(0);
  }

  let pending = 0;
  let totalInserted = 0;

  for (const r of rows) {
    const vid = r.video_id;
    const course = r.course_title || "this course";
    for (let i = 1; i <= count; i++) {
      pending++;
      const question = makeQuestionTemplate(course, i);
      // simple options; Option A is the correct one (the course title)
      const optionA = course;
      const optionB = `Overview of ${course}`;
      const optionC = `Intro to ${course}`;
      const optionD = `Basics of ${course}`;
      const correct = optionA;

      db.query(insertSql, [vid, question, optionA, optionB, optionC, optionD, correct], (ieErr, res) => {
        if (ieErr) console.error(`Insert error for video ${vid}:`, ieErr);
        else {
          totalInserted++;
          console.log(`Inserted quiz id ${res.insertId} for video ${vid}`);
        }

        pending--;
        if (pending === 0) {
          console.log(`Done. Total inserted: ${totalInserted}`);
          db.end();
          process.exit(0);
        }
      });
    }
  }
});
