import db from "../config/db.js";

export const addQuizQuestion = (req, res) => {
  const {
    videoId,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctOption,
  } = req.body;

  if (
    !videoId ||
    !question ||
    !optionA ||
    !optionB ||
    !optionC ||
    !optionD ||
    !correctOption
  ) {
    return res.status(400).json({ message: "Missing quiz data" });
  }

  const sql = `
    INSERT INTO quizzes
    (video_id, question, option_a, option_b, option_c, option_d, correct_option)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      videoId,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
    ],
    (err) => {
      if (err) {
        console.error("❌ Add quiz error:", err);
        return res.status(500).json({ message: "Failed to add quiz" });
      }

      res.json({ message: "Quiz question added" });
    }
  );
};
