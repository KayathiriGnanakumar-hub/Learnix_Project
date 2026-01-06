# Detailed Changes Reference

## File-by-File Changes

### 1. backend/sql/create_enrollments_table.sql [NEW FILE]
**Purpose**: Define schema for enrollments and video_progress tables

**Content**: 
- `enrollments` table with columns: id, user_email, course_id, status, progress, enrolled_at, completed_at
- `video_progress` table with columns: id, user_email, video_id, completed, completed_at, created_at
- Includes proper indexes and foreign keys

---

### 2. backend/Controllers/enrollmentController.js
**Change 1: Accept complete flag**
```javascript
// BEFORE:
export const enrollCourse = (req, res) => {
  const email = req.user.email;
  const { courseId } = req.body;

  const sql = `
    INSERT IGNORE INTO enrollments (user_email, course_id)
    VALUES (?, ?)
  `;

// AFTER:
export const enrollCourse = (req, res) => {
  const email = req.user.email;
  const { courseId } = req.body;
  const complete = req.body.complete === true || req.body.complete === "true";

  let sql, params;
  if (complete) {
    sql = `
      INSERT INTO enrollments (user_email, course_id, status, progress, completed_at)
      VALUES (?, ?, 'completed', 100, NOW())
      ON DUPLICATE KEY UPDATE status = 'completed', progress = 100, completed_at = NOW()
    `;
    params = [email, courseId];
  } else {
    sql = `
      INSERT INTO enrollments (user_email, course_id, status, progress, completed_at)
      VALUES (?, ?, 'in_progress', 0, NULL)
      ON DUPLICATE KEY UPDATE course_id = course_id
    `;
    params = [email, courseId];
  }

  db.query(sql, params, (err) => {
    // ... rest of code
```

**Why**: Allows payment flow to mark enrollment as complete, enabling instant certificate generation

---

### 3. backend/routes/adminQuizRoutes.js
**Change 1: Switch to video_quizzes and limit to 10**
```javascript
// BEFORE:
router.get("/video/:videoId", (req, res) => {
  const { videoId } = req.params;

  const sql = `
    SELECT * FROM quizzes
    WHERE video_id = ?
    ORDER BY id ASC
  `;

  db.query(sql, [videoId], (err, result) => {
    // ...
    res.json(result || []);

// AFTER:
router.get("/video/:videoId", (req, res) => {
  const { videoId } = req.params;

  const sql = `
    SELECT * FROM video_quizzes
    WHERE video_id = ?
    ORDER BY id ASC
    LIMIT 10
  `;

  db.query(sql, [videoId], (err, rows) => {
    // Normalize rows to option_a, option_b, etc.
    const normalized = (rows || []).map((r) => {
      let opts = [];
      try {
        opts = JSON.parse(r.options || "[]");
      } catch (e) {
        opts = [];
      }

      let corr = null;
      if (typeof r.correct_option === "number") {
        const idx = r.correct_option > 3 ? r.correct_option - 1 : r.correct_option;
        const map = ["a", "b", "c", "d"];
        corr = map[idx] || null;
      } else if (typeof r.correct_option === "string") {
        corr = r.correct_option.toLowerCase();
      }

      return {
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
    });

    res.json(normalized);
```

**Why**: 
- Uses `video_quizzes` table (based on video, not feedback)
- Limits to 10 questions per video
- Normalizes JSON options to format frontend expects

---

### 4. backend/routes/courseRoutes.js
**Change 1: Add list with videos endpoint**
```javascript
// ADDED IMPORT:
import db from "../config/db.js";

// ADDED ENDPOINT:
router.get("/list/with-videos", (req, res) => {
  const sql = `
    SELECT 
      c.id as courseId,
      c.title as courseName,
      c.description,
      c.price,
      c.instructor,
      c.image,
      COALESCE(
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'videoId', v.id,
            'videoTitle', v.title,
            'youtubeUrl', v.youtube_url,
            'orderNo', v.order_no
          )
        ),
        JSON_ARRAY()
      ) as videos
    FROM courses c
    LEFT JOIN videos v ON c.id = v.course_id
    GROUP BY c.id, c.title, c.description, c.price, c.instructor, c.image
    ORDER BY c.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching courses with videos:", err);
      return res.status(500).json({ message: "Error fetching courses" });
    }

    const formattedResults = results.map((course) => {
      try {
        if (typeof course.videos === "string") {
          course.videos = JSON.parse(course.videos);
        }
      } catch (e) {
        course.videos = [];
      }
      return course;
    });

    res.json(formattedResults);
  });
});
```

**Why**: Provides endpoint to list all courses with video IDs for admin/listing purposes

---

### 5. backend/scripts/initializeDatabase.js
**Change 1: Initialize enrollments tables first**
```javascript
// BEFORE:
function initializeDatabase() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const videoQuizPath = path.join(__dirname, "../sql/create_video_quizzes_table.sql");
  const internshipsPath = path.join(__dirname, "../sql/create_internships_table.sql");

  try {
    const videoQuizSql = fs.readFileSync(videoQuizPath, "utf8");

    db.query(videoQuizSql, (err) => {
      if (err) {
        console.error("❌ Video quiz table initialization error:", err.message);
      } else {
        console.log("✅ Video quiz tables initialized");
      }
    });

    const internshipsSql = fs.readFileSync(internshipsPath, "utf8");
    db.query(internshipsSql, (err) => {
      // ...

// AFTER:
function initializeDatabase() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const enrollmentsPath = path.join(__dirname, "../sql/create_enrollments_table.sql");
  const videoQuizPath = path.join(__dirname, "../sql/create_video_quizzes_table.sql");
  const internshipsPath = path.join(__dirname, "../sql/create_internships_table.sql");

  try {
    // Create enrollments and video_progress tables first
    const enrollmentsSql = fs.readFileSync(enrollmentsPath, "utf8");
    db.query(enrollmentsSql, (err) => {
      if (err) {
        console.error("❌ Enrollments table initialization error:", err.message);
      } else {
        console.log("✅ Enrollments tables initialized");
      }
    });

    // Create video quizzes tables
    const videoQuizSql = fs.readFileSync(videoQuizPath, "utf8");
    db.query(videoQuizSql, (err) => {
      if (err) {
        console.error("❌ Video quiz table initialization error:", err.message);
      } else {
        console.log("✅ Video quiz tables initialized");
      }
    });

    // Create internship tables
    const internshipsSql = fs.readFileSync(internshipsPath, "utf8");
    db.query(internshipsSql, (err) => {
      // ...
```

**Why**: Ensures enrollments table is created on server startup

---

### 6. vite-project/src/Components/PaymentSuccess.jsx
**Change 1: Add complete flag to enrollment**
```javascript
// BEFORE:
      try {
        // Enroll in each course
        for (const course of cart) {
          console.log(`📝 Enrolling in course ${course.id}:`, course.title);
          const res = await fetch("http://localhost:5001/api/enroll", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              courseId: parseInt(course.id) || course.id
            }),
          });

// AFTER:
      try {
        // Enroll in each course with completion flag (marks as finished for instant certificate eligibility)
        for (const course of cart) {
          console.log(`📝 Enrolling in course ${course.id}:`, course.title);
          const res = await fetch("http://localhost:5001/api/enroll", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ 
              courseId: parseInt(course.id) || course.id,
              complete: true
            }),
          });
```

**Why**: Marks course as completed on payment, enabling instant certificate generation

---

### 7. vite-project/src/Components/students/Certificates.jsx
**Change 1: Check enrollments table instead of video progress**
```javascript
// BEFORE:
  useEffect(() => {
    const token = localStorage.getItem("learnix_token");

    axios
      .get("http://localhost:5001/api/enroll/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const done = [];

        for (const course of res.data) {
          try {
            const progressRes = await axios.get(
              `http://localhost:5001/api/progress/${course.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (progressRes.data.total > 0 && progressRes.data.total === progressRes.data.completed) {
              done.push({
                ...course,
                completedAt: new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                }),
                progress: 100
              });
            }
          } catch (err) {
            console.error("Error fetching progress:", err);
          }
        }

// AFTER:
  useEffect(() => {
    const token = localStorage.getItem("learnix_token");

    axios
      .get("http://localhost:5001/api/enroll/my", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const done = [];

        for (const course of res.data) {
          try {
            // Check if enrollment status is 'completed' and progress is 100
            // (instead of counting videos, use enrollments table status)
            if (course.status === 'completed' && course.progress === 100) {
              done.push({
                ...course,
                completedAt: course.completed_at 
                  ? new Date(course.completed_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                  : new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    }),
                progress: 100
              });
            }
          } catch (err) {
            console.error("Error checking completion:", err);
          }
        }
```

**Why**: Uses enrollments table directly instead of counting videos, enabling instant certificate display after payment

---

### 8. vite-project/src/Components/students/Progress.jsx
**Change 1: Check enrollments status for completion**
```javascript
// BEFORE:
      const data = await Promise.all(
        enrolled.data.map(async (course) => {
          const res = await axios.get(
            `http://localhost:5001/api/progress/${course.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const total = res.data.total || 0;
          const completed = res.data.completed || 0;
          const percent =
            total === 0 ? 0 : Math.round((completed / total) * 100);

          return { 
            ...course, 
            percent,
            completed,
            total,
            isComplete: percent === 100 && total > 0
          };
        })
      );

// AFTER:
      const data = await Promise.all(
        enrolled.data.map(async (course) => {
          // Get video progress details
          const res = await axios.get(
            `http://localhost:5001/api/progress/${course.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const total = res.data.total || 0;
          const completed = res.data.completed || 0;
          const percent =
            total === 0 ? 0 : Math.round((completed / total) * 100);

          // A course is complete if either:
          // 1. Enrolled with status='completed' and progress=100 (instant completion via payment)
          // 2. All videos watched (percent = 100)
          const isComplete = (course.status === 'completed' && course.progress === 100) || 
                            (percent === 100 && total > 0);

          return { 
            ...course, 
            percent: course.status === 'completed' ? 100 : percent,
            completed,
            total,
            isComplete
          };
        })
      );
```

**Why**: Checks both enrollments completion status AND video progress for accurate display

---

## Summary of Changes

| File | Type | Lines Changed | Purpose |
|------|------|---------------|---------|
| enrollments_table.sql | New | ~40 | DB schema |
| enrollmentController.js | Modified | ~15 | Accept complete flag |
| adminQuizRoutes.js | Modified | ~70 | video_quizzes, 10 limit, normalize |
| courseRoutes.js | Modified | ~50 | Add /list/with-videos |
| initializeDatabase.js | Modified | ~15 | Init enrollments table |
| PaymentSuccess.jsx | Modified | ~3 | Add complete: true |
| Certificates.jsx | Modified | ~20 | Check enrollments status |
| Progress.jsx | Modified | ~15 | Check enrollments completion |

**Total Lines Changed**: ~230 lines
**Files Modified**: 8 files
**New Features**: 2 (complete enrollment flag, /list/with-videos endpoint)
**Bug Fixes**: 6 (all issues from user's request)
