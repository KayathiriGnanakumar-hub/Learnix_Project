import express from "express";
import db from "../config/db.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/* HELPER: Normalize quiz data */
const normalizeQuizzes = (rows = []) => {
  return rows.map((r, idx) => {
    console.log(`\n--- Quiz ${idx + 1} ---`);
    console.log(`ID: ${r.id}`);
    console.log(`Question: ${r.question}`);
    console.log(`Options (raw): ${r.options}`);
    console.log(`Correct Option: ${r.correct_option}`);
    
    let opts = [];
    // Handle cases where MySQL returns a JSON array (as array/object) or a string
    try {
      if (Array.isArray(r.options)) {
        opts = r.options;
        console.log(`✅ Options is already an array:`, opts);
      } else if (typeof r.options === 'string') {
        // try parse string JSON first
        try {
          const parsed = JSON.parse(r.options || '[]');
          if (Array.isArray(parsed)) opts = parsed;
          else opts = [];
          console.log(`✅ Parsed string options as JSON:`, opts);
        } catch (e) {
          // fallback to comma-separated
          const optionsStr = (r.options || '').trim();
          if (optionsStr) {
            opts = optionsStr.split(',').map(opt => opt.trim()).filter(Boolean);
            console.log(`✅ Parsed string options as comma-separated:`, opts);
          } else {
            opts = [];
          }
        }
      } else if (r.options && typeof r.options === 'object') {
        // object but not array (safeguard)
        if (Array.isArray(r.options)) opts = r.options;
        else opts = [];
        console.log(`✅ Options as object handled:`, opts);
      } else {
        opts = [];
      }
    } catch (err) {
      console.error('❌ Unexpected parse error for options:', err && err.message);
      opts = [];
    }

    // support either 0-based or 1-based correct_option. Normalize to 'a'..'d'
    let corr = null;
    if (typeof r.correct_option === "number") {
      const idx = r.correct_option > 3 ? r.correct_option - 1 : r.correct_option; // crude
      const map = ["a", "b", "c", "d"];
      corr = map[idx] || null;
    } else if (typeof r.correct_option === "string") {
      corr = r.correct_option.toLowerCase();
    }

    const result = {
      id: r.id,
      video_id: r.video_id,
      question: r.question,
      option_a: opts[0] || null,
      option_b: opts[1] || null,
      option_c: opts[2] || null,
      option_d: opts[3] || null,
      correct_option: corr,
      created_at: r.created_at,
    };
    
    console.log(`✅ Result:`, result);
    return result;
  });
};

/* GET ALL QUIZZES BY VIDEO (video_quizzes, limit 10) */
router.get("/video/:videoId", (req, res) => {
  const { videoId } = req.params;

  const sql = `
    SELECT * FROM video_quizzes
    WHERE video_id = ?
    ORDER BY id ASC
    LIMIT 10
  `;

  db.query(sql, [videoId], (err, rows) => {
    if (err) {
      console.error("❌ Quiz fetch error:", err);
      return res.status(500).json({ message: "Quiz fetch error" });
    }

    console.log(`\n📚 Fetching quizzes for video ${videoId}...`);
    console.log(`Found ${rows ? rows.length : 0} quizzes\n`);

    const normalized = normalizeQuizzes(rows);

    console.log(`\n✅ Sending ${normalized.length} normalized quizzes to frontend\n`);
    res.json(normalized);
  });
});

/* GET ALL QUIZZES FOR A COURSE (with video info) */
router.get("/course/:courseId", (req, res) => {
  const { courseId } = req.params;

  const sql = `
    SELECT 
      vq.id,
      vq.video_id,
      vq.question,
      vq.options,
      vq.correct_option,
      vq.created_at,
      v.title as video_title,
      v.course_id
    FROM video_quizzes vq
    JOIN videos v ON vq.video_id = v.id
    WHERE v.course_id = ?
    ORDER BY v.order_no ASC, vq.id ASC
  `;

  db.query(sql, [courseId], (err, rows) => {
    if (err) {
      console.error("❌ Course quizzes fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch quizzes for course" });
    }

    console.log(`\n📚 Fetching all quizzes for course ${courseId}...`);
    console.log(`Found ${rows ? rows.length : 0} total quizzes\n`);

    const normalized = normalizeQuizzes(rows);

    console.log(`\n✅ Sending ${normalized.length} quizzes for course\n`);
    res.json(normalized);
  });
});

/* GET QUIZZES FOR ALL COURSES */
router.get("/all/courses", (req, res) => {
  const sql = `
    SELECT 
      vq.id,
      vq.video_id,
      vq.question,
      vq.options,
      vq.correct_option,
      vq.created_at,
      v.title as video_title,
      v.course_id,
      c.title as course_title
    FROM video_quizzes vq
    JOIN videos v ON vq.video_id = v.id
    JOIN courses c ON v.course_id = c.id
    ORDER BY c.id ASC, v.order_no ASC, vq.id ASC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ All quizzes fetch error:", err);
      return res.status(500).json({ message: "Failed to fetch all quizzes" });
    }

    console.log(`\n📚 Fetching all quizzes from all courses...`);
    console.log(`Found ${rows ? rows.length : 0} total quizzes\n`);

    const normalized = normalizeQuizzes(rows);

    // Group by course for easier processing
    const grouped = {};
    normalized.forEach((quiz) => {
      if (!grouped[quiz.video_id]) {
        grouped[quiz.video_id] = [];
      }
      grouped[quiz.video_id].push(quiz);
    });

    console.log(`\n✅ Quizzes organized by video\n`);
    res.json(normalized);
  });
});

/* GET SINGLE QUIZ BY QUIZ ID */
router.get("/:quizId", (req, res) => {
  const { quizId } = req.params;

  const sql = `SELECT * FROM video_quizzes WHERE id = ? LIMIT 1`;

  db.query(sql, [quizId], (err, rows) => {
    if (err) {
      console.error("❌ Single quiz fetch error:", err);
      return res.status(500).json({ message: "Quiz fetch error" });
    }

    if (!rows || rows.length === 0) return res.status(404).json({ message: "Quiz not found" });

      const r = rows[0];
      let opts = [];
      try {
        // Try parsing as JSON first
        opts = JSON.parse(r.options || "[]");
      } catch (e) {
        // If JSON fails, try splitting by comma
        try {
          const optionsStr = (r.options || "").trim();
          if (optionsStr) {
            opts = optionsStr.split(",").map(opt => opt.trim()).filter(opt => opt);
          } else {
            opts = [];
          }
        } catch (e2) {
          opts = [];
        }
      }

    let corr = null;
    if (typeof r.correct_option === "number") {
      const idx = r.correct_option > 3 ? r.correct_option - 1 : r.correct_option;
      const map = ["a", "b", "c", "d"];
      corr = map[idx] || null;
    } else if (typeof r.correct_option === "string") {
      corr = r.correct_option.toLowerCase();
    }

    res.json({
      id: r.id,
      video_id: r.video_id,
      question: r.question,
      option_a: opts[0] || null,
      option_b: opts[1] || null,
      option_c: opts[2] || null,
      option_d: opts[3] || null,
      correct_option: corr,
      created_at: r.created_at,
    });
  });
});

export default router;
