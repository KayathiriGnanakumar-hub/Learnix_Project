# 🚀 Getting Started - Step by Step

## One-Minute Setup

### 1. Start Backend
```bash
cd backend
npm install
npm start
```

### 2. Start Frontend (in new terminal)
```bash
cd vite-project
npm install
npm run dev
```

### 3. Test in Browser
```
http://localhost:5173
```

**That's it!** ✅ Database table created automatically on first quiz submission.

---

## Complete Feature Test (5 minutes)

### Step 1: Login as Student
```
1. Go to http://localhost:5173
2. Click "Login" (if not already logged in)
3. Use test credentials
```

### Step 2: Enroll in Course
```
1. Browse available courses
2. Click "Enroll" 
3. Complete payment if required
```

### Step 3: Watch Video
```
1. Go to course details
2. Select first video
3. Watch completely (scroll to end)
```

### Step 4: Take Quiz
```
1. "Take Quiz Now" button becomes active
2. Answer quiz questions
3. Click "Submit Quiz"
```

### Step 5: See Results
```
✅ If ≥ 70%: PASSED
   - Progress updates
   - Course progress visible
   
❌ If < 70%: TRY AGAIN
   - Retake quiz
   - Review material
```

### Step 6: Complete Course
```
1. Repeat Steps 3-4 for all videos
2. Once all done:
   - Course marked as COMPLETED
   - Certificate option appears
```

### Step 7: Download Certificate
```
1. Go to "Certificates" section
2. Click "Download Certificate"
3. PDF downloads with completion date
```

### Step 8: Check Internship Eligibility
```
1. Go to "Internships" section
2. If 2+ courses completed:
   - "Eligible for internships!" message
3. Browse and apply for internships
```

---

## Verification Checklist

After starting servers, verify:

- [ ] Backend running on http://localhost:5001
- [ ] Frontend running on http://localhost:5173
- [ ] Can login as student
- [ ] Can enroll in course
- [ ] Can watch video
- [ ] Can take quiz
- [ ] Quiz result saves (check console)
- [ ] Score displays correctly
- [ ] Progress updates
- [ ] Certificate available after completion
- [ ] Internship eligibility shows correctly

---

## Detailed Testing

### Test Quiz Result Saving

**In browser console (after logging in):**
```javascript
const token = localStorage.getItem("learnix_token");
fetch("http://localhost:5001/api/quiz-results/save", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    videoId: 1,
    courseId: 1,
    score: 4,
    totalQuestions: 5
  })
})
.then(r => r.json())
.then(d => console.log("✅ Result saved:", d))
.catch(e => console.error("❌ Error:", e))
```

**Expected output:**
```
✅ Result saved: {
  message: "Quiz result saved",
  score: 4,
  totalQuestions: 5,
  percentage: "80.0",
  passed: true
}
```

### Test Quiz Statistics

**In browser console:**
```javascript
const token = localStorage.getItem("learnix_token");
fetch("http://localhost:5001/api/quiz-results/stats/all", {
  headers: { "Authorization": `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log("📊 Stats:", d))
.catch(e => console.error("❌ Error:", e))
```

### Test Internship Eligibility

**In browser console:**
```javascript
const token = localStorage.getItem("learnix_token");
fetch("http://localhost:5001/api/internships/check/eligibility", {
  headers: { "Authorization": `Bearer ${token}` }
})
.then(r => r.json())
.then(d => console.log("💼 Eligibility:", d))
.catch(e => console.error("❌ Error:", e))
```

---

## Troubleshooting

### Backend won't start
```bash
# Check Node version
node --version  # Should be 14+

# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules
npm install
npm start
```

### Frontend won't load
```bash
# Check Vite port
npm run dev

# If port 5173 taken, use:
npm run dev -- --port 3000
```

### Quiz not saving
```
1. Check browser console (F12)
2. Look for network errors
3. Verify token in localStorage:
   localStorage.getItem("learnix_token")
4. Check backend logs for errors
```

### Database table not created
```
1. Submit a quiz to trigger table creation
2. Or manually run:
   mysql -u root -p database_name < backend/sql/create_quiz_results_table.sql
```

---

## Monitoring

### Backend Console Output

You should see logs like:
```
✅ Quiz result saved: {...}
📊 Course 1 Quiz Results for user 123:
  - Video 5: 80% (✅ PASSED)
📊 Internship Eligibility Check for user 123:
  - Completed Courses: 2
  - Courses with Quizzes: 2
  - Eligible: true
```

### Browser Console

Network tab should show:
```
POST /api/quiz-results/save          200 OK
GET  /api/quiz-results/stats/all     200 OK
GET  /api/internships/check/eligibility  200 OK
```

---

## Performance Check

### Verify Speed
- Quiz submission: < 1 second
- Certificate generation: < 5 seconds
- Statistics loading: < 1 second
- Internship check: < 1 second

If slower, check:
1. Database connections
2. Network latency
3. Disk I/O
4. Browser console errors

---

## Database Verification

### Check Quiz Results Table

```bash
# Login to MySQL
mysql -u root -p

# Select database
USE learnix;

# Check if table exists
SHOW TABLES LIKE 'quiz_results';

# See sample data
SELECT * FROM quiz_results LIMIT 5;

# Check indexes
SHOW INDEXES FROM quiz_results;

# Check record count
SELECT COUNT(*) FROM quiz_results;
```

### Sample Output
```
+----------+
| Tables   |
+----------+
| quiz_results |
+----------+

+---+----------+--------+------+-------+--------+-------+-----+-----+-------+
| id| user_id  | user_email | video_id | score | total | percent | passed | taken_at |
+---+----------+--------+------+-------+--------+-------+-----+-----+-------+
| 1 | 123 | student@example.com | 1 | 4 | 5 | 80.00 | 1 | 2026-01-04... |
+---+----------+--------+------+-------+--------+-------+-----+-----+-------+
```

---

## File Locations

### Important Files to Monitor
```
Backend:
  - backend/server.js              (Main server file)
  - backend/Controllers/           (Business logic)
  - backend/routes/                (API endpoints)
  - backend/sql/                   (Database schema)

Frontend:
  - vite-project/src/App.jsx       (Routing)
  - vite-project/src/Components/   (UI components)
  - vite-project/src/utils/        (Utilities)

Documentation:
  - QUIZ_CERTIFICATE_INTERNSHIP_COMPLETE.md    (Full guide)
  - QUICK_START_QUIZ_SYSTEM.md                 (Quick setup)
  - CODE_CHANGES_DETAILED.md                   (Code docs)
  - FINAL_SUMMARY.md                           (This summary)
```

---

## Environment Variables

If needed, create `.env` file in backend/:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learnix
NODE_ENV=development
PORT=5001
```

---

## Common Commands

### Kill Process on Port
```bash
# Kill port 5001 (backend)
npx kill-port 5001

# Kill port 5173 (frontend)
npx kill-port 5173

# Or macOS/Linux:
lsof -ti:5001 | xargs kill -9
```

### View Real-time Logs
```bash
# In backend directory
npm start 2>&1 | grep -E "✅|❌|📊"
```

### Reset Everything
```bash
# Full reset
rm -rf backend/node_modules vite-project/node_modules
npm install --prefix backend
npm install --prefix vite-project
npm start --prefix backend &
npm run dev --prefix vite-project
```

---

## Success Indicators ✅

**You'll know it's working when:**

1. ✅ Quiz saves without errors
2. ✅ Score displays correctly
3. ✅ Course progress updates
4. ✅ Certificate becomes available
5. ✅ Internship eligibility shows
6. ✅ Statistics display accurately

---

## Next Steps

1. ✅ Complete setup above
2. ✅ Test end-to-end flow
3. ✅ Check database for records
4. ✅ Monitor console logs
5. ✅ Generate sample certificates
6. ✅ Test internship eligibility

---

## Support Resources

| Issue | File |
|-------|------|
| Setup help | QUICK_START_QUIZ_SYSTEM.md |
| API details | QUIZ_CERTIFICATE_INTERNSHIP_COMPLETE.md |
| Code details | CODE_CHANGES_DETAILED.md |
| Full checklist | IMPLEMENTATION_VERIFICATION.md |
| Quick reference | FINAL_SUMMARY.md |

---

## Quick Links

```
Frontend:     http://localhost:5173
Backend API:  http://localhost:5001
API Docs:     See QUIZ_CERTIFICATE_INTERNSHIP_COMPLETE.md
Database:     mysql://root:password@localhost/learnix
```

---

**Ready to start?** Run these commands:

```bash
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend  
cd vite-project && npm install && npm run dev

# Then open: http://localhost:5173
```

**Everything works automatically from here!** 🚀

---

*Last Updated: January 4, 2026*
*Status: ✅ Production Ready*
