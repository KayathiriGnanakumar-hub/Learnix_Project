import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

// This script adds quizzes for ALL videos in ALL courses
// It creates 5 realistic quiz questions per video

const quizzes = [
  {
    questions: [
      {
        question: "What is the primary focus of this course?",
        options: {
          a: "Core concepts and fundamentals",
          b: "Advanced techniques only",
          c: "Historical overview",
          d: "Marketing strategies"
        },
        correct: "a"
      },
      {
        question: "Which of the following is a key benefit of learning this topic?",
        options: {
          a: "Better problem-solving skills",
          b: "Decreased productivity",
          c: "Higher costs",
          d: "Less flexibility"
        },
        correct: "a"
      },
      {
        question: "What is the recommended approach for beginners?",
        options: {
          a: "Start with basics and build progressively",
          b: "Jump directly to advanced topics",
          c: "Skip fundamentals",
          d: "Learn only theory"
        },
        correct: "a"
      },
      {
        question: "How can you apply what you learn in practical scenarios?",
        options: {
          a: "Through hands-on projects and examples",
          b: "Only through reading books",
          c: "Never in real-world situations",
          d: "Theory has no practical value"
        },
        correct: "a"
      },
      {
        question: "What skill will be most valuable from this course?",
        options: {
          a: "Practical implementation ability",
          b: "Memorizing facts",
          c: "Avoiding challenges",
          d: "Teaching without practice"
        },
        correct: "a"
      }
    ]
  }
];

const mapOptionToField = (option) => {
  const map = {
    a: "option_a",
    b: "option_b",
    c: "option_c",
    d: "option_d"
  };
  return map[option.toLowerCase()];
};

const getCorrectOption = (option) => {
  const map = {
    a: "Option A",
    b: "Option B",
    c: "Option C",
    d: "Option D"
  };
  return map[option.toLowerCase()];
};

// First, get all videos
const selectVideosSql = `
  SELECT v.id AS video_id, c.title AS course_title
  FROM videos v
  LEFT JOIN courses c ON v.course_id = c.id
  ORDER BY c.id, v.id
`;

db.query(selectVideosSql, (err, videos) => {
  if (err) {
    console.error("❌ Error selecting videos:", err);
    db.end();
    process.exit(1);
  }

  if (!videos || videos.length === 0) {
    console.log("❌ No videos found in database.");
    db.end();
    process.exit(1);
  }

  console.log(`📺 Found ${videos.length} videos. Starting to seed quizzes...`);

  // Check how many quizzes already exist per video
  const checkSql = `
    SELECT video_id, COUNT(*) as count
    FROM quizzes
    GROUP BY video_id
  `;

  db.query(checkSql, (checkErr, existingQuizzes) => {
    if (checkErr) {
      console.error("❌ Error checking existing quizzes:", checkErr);
      db.end();
      process.exit(1);
    }

    const existingMap = {};
    if (existingQuizzes) {
      existingQuizzes.forEach(row => {
        existingMap[row.video_id] = row.count;
      });
    }

    let processed = 0;
    let inserted = 0;
    let skipped = 0;

    videos.forEach(video => {
      const existingCount = existingMap[video.video_id] || 0;

      if (existingCount > 0) {
        console.log(`⏭️  Skipping video ${video.video_id} (${video.course_title}) - already has ${existingCount} quizzes`);
        skipped++;
        processed++;

        if (processed === videos.length) {
          completionSummary();
        }
        return;
      }

      // Insert 5 quizzes for this video
      const quizTemplate = quizzes[0];
      let questionsInserted = 0;

      quizTemplate.questions.forEach((q, idx) => {
        const insertSql = `
          INSERT INTO quizzes
          (video_id, question, option_a, option_b, option_c, option_d, correct_option)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const correctOption = getCorrectOption(q.correct);

        db.query(
          insertSql,
          [
            video.video_id,
            q.question,
            q.options.a,
            q.options.b,
            q.options.c,
            q.options.d,
            correctOption
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.error(`❌ Error inserting quiz for video ${video.video_id}:`, insertErr);
            } else {
              questionsInserted++;
              inserted++;
              console.log(`✅ Inserted quiz for video ${video.video_id} (${video.course_title}): "${q.question}"`);
            }

            // Check if all questions for this video are done
            if (questionsInserted === quizTemplate.questions.length) {
              console.log(`✅ Completed all 5 quizzes for video ${video.video_id}`);
              processed++;

              if (processed === videos.length) {
                completionSummary();
              }
            }
          }
        );
      });
    });

    function completionSummary() {
      console.log("\n" + "=".repeat(50));
      console.log("📊 SEEDING COMPLETE");
      console.log("=".repeat(50));
      console.log(`✅ Total inserted: ${inserted}`);
      console.log(`⏭️  Total skipped: ${skipped}`);
      console.log(`📺 Total videos processed: ${processed}`);
      console.log("=".repeat(50));
      db.end();
      process.exit(0);
    }
  });
});
