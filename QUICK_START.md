# Quick Start Guide - Quizzes & Certificates

## ⚡ Quick Commands

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Quizzes (10 per video)
```bash
node scripts/seed_course_quizzes.js
```
This creates ~600+ quizzes (30 courses × 2 videos × 10 quizzes each)

### 3. Start Backend
```bash
npm start
# or for development with auto-reload:
npm run dev
```

---

## 📊 Progress Tracking (Automatic)

Once a student completes all videos in a course, their progress automatically updates to 100% and the course status changes to "completed".

**Check progress:**
```bash
curl http://localhost:5001/api/progress/1/1
# Response: { totalVideos: 2, completedVideos: 2, progressPercentage: 100 }
```

---

## 📜 Certificate Generation

**Download certificate as PDF** (only when course is 100% complete):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/certificates/generate/1/1 \
  --output certificate.pdf
```

**Verify certificate is valid:**
```bash
curl http://localhost:5001/api/certificates/verify/1/1
# Response: { verified: true, data: {...} }
```

**Get all certificates for a user:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5001/api/certificates/user/1
```

---

## 📁 Files Created/Modified

### New Files:
- ✅ `backend/scripts/seed_course_quizzes.js` - Quiz seeder with 13 course categories
- ✅ `backend/Controllers/certificateController.js` - PDF certificate generation
- ✅ `backend/routes/certificateRoutes.js` - Certificate API routes
- ✅ `CERTIFICATE_AND_QUIZ_SETUP.md` - Full documentation

### Modified Files:
- ✅ `backend/Controllers/progressController.js` - Auto course completion tracking
- ✅ `backend/server.js` - Added certificate routes
- ✅ `backend/package.json` - Added pdfkit dependency

---

## 🎓 How It Works

```
Student completes videos
        ↓
Progress updates to 100%
        ↓
Course marked as "completed"
        ↓
"Download Certificate" button appears
        ↓
PDF generated with:
- Your logo (from vite-project/public/logo.png)
- Student name
- Course name
- Completion date
- Certificate ID
```

---

## 🔍 Sample Requests

### Progress API
```javascript
// Get course progress
fetch('/api/progress/userId/courseId')
  .then(r => r.json())
  .then(data => console.log(data.progressPercentage + '%'))
```

### Certificate API
```javascript
// Generate & download certificate
const token = localStorage.getItem('authToken');
fetch(`/api/certificates/generate/${userId}/${courseId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.pdf';
    a.click();
  });
```

---

## 📋 Quiz Categories (Auto-Detected)

| Course Title | Category | Questions About |
|---|---|---|
| Python | python | Functions, lists, loops, OOP |
| React | react | Components, hooks, state, props |
| JavaScript | javascript | ES6, async/await, closures |
| Data Structures | data structures | Arrays, linked lists, complexity |
| DevOps | devops | CI/CD, Docker, Kubernetes |
| Java | java | OOP, exceptions, threads |
| SQL | sql | SELECT, JOIN, normalization |
| AWS | aws | EC2, S3, Lambda, RDS |

---

## ✅ Testing Checklist

- [ ] Run `npm install` in backend
- [ ] Run quiz seeder: `node scripts/seed_course_quizzes.js`
- [ ] Start backend: `npm start`
- [ ] Test progress endpoint
- [ ] Complete a course (mark all videos watched)
- [ ] Test certificate generation
- [ ] Verify PDF has logo
- [ ] Test certificate download

---

## 🆘 Troubleshooting

**"Course not completed" error:**
→ Ensure all videos are marked as watched and progress is 100%

**Logo not showing:**
→ Check that `vite-project/public/logo.png` exists and is readable

**No quizzes created:**
→ Verify videos exist in database and run seeder again

**JWT token error:**
→ Pass valid Bearer token in Authorization header for certificate endpoints

---

## 📞 API Endpoints Summary

```
POST   /api/progress/:userId/:courseId       - Get course progress
GET    /api/progress/overall/:userId         - Get all courses progress
GET    /api/certificates/generate/:userId/:courseId  - Download PDF cert
GET    /api/certificates/verify/:userId/:courseId    - Verify certificate
GET    /api/certificates/user/:userId        - Get all user certificates
```

Enjoy! 🎉
