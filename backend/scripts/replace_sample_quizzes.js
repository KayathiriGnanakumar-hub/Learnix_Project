import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

// This script finds quizzes whose question starts with 'Sample question'
// and replaces them with generated questions based on the related course title.

const selectSql = `
  SELECT q.id AS quiz_id, q.video_id, v.course_id, c.title AS course_title
  FROM quizzes q
  LEFT JOIN videos v ON q.video_id = v.id
  LEFT JOIN courses c ON v.course_id = c.id
  WHERE q.question LIKE 'Sample question%'
`;

const updateSql = `
  UPDATE quizzes SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?
  WHERE id = ?
`;

function makeTemplates(courseTitle) {
  const base = courseTitle || 'this course';
  return [
    `Which topic is the focus of the course "${base}"?`,
    `What will you primarily learn in "${base}"?`,
    `Which skill is emphasized by "${base}"?`,
    `Which area best describes the content of "${base}"?`,
    `Which of the following is most likely taught in "${base}"?`,
    `What is a key concept covered in "${base}"?`,
    `Which tool or language is used in "${base}"?`,
    `What is an expected outcome of taking "${base}"?`,
    `Which audience is "${base}" intended for?`,
    `Which topic would you expect to practice in "${base}"?`,
  ];
}

db.query(selectSql, (err, rows) => {
  if (err) {
    console.error('Error selecting sample quizzes:', err);
    db.end();
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log('No sample quizzes found.');
    db.end();
    process.exit(0);
  }

  let pending = 0;
  let updated = 0;

  for (const r of rows) {
    pending++;
    const tmpl = makeTemplates(r.course_title);
    // pick a template based on quiz id to vary questions
    const idx = (r.quiz_id % tmpl.length);
    const question = tmpl[idx];

    const optA = r.course_title || 'Related topic';
    const optB = 'Web Development';
    const optC = 'Data Science';
    const optD = 'Mobile Development';
    const correct = optA;

    db.query(updateSql, [question, optA, optB, optC, optD, correct, r.quiz_id], (uErr, res) => {
      if (uErr) console.error(`Update error for quiz ${r.quiz_id}:`, uErr);
      else {
        updated++;
        console.log(`Updated quiz id ${r.quiz_id}`);
      }
      pending--;
      if (pending === 0) {
        console.log(`Done. Updated ${updated} quizzes.`);
        db.end();
        process.exit(0);
      }
    });
  }
});
