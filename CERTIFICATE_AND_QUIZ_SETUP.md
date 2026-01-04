# Quiz & Certificate System Setup

## Overview
This system includes:
- **10 domain-specific questions per video** (2 videos per course = 20 quizzes per course)
- **Automatic course completion tracking** (100% progress = course complete)
- **PDF certificate generation** with your logo
- **Certificate management** endpoints

---

## 1. Install Dependencies

```bash
cd backend
npm install
```

This installs `pdfkit` which is required for PDF certificate generation.

---

## 2. Create Domain-Specific Quizzes

Run the quiz seeder to populate all courses with domain-specific questions:

```bash
node scripts/seed_course_quizzes.js
```

This script will:
- Query all videos in the database
- Generate 10 varied questions per video based on the course category
- Automatically categorize courses (Python, React, JavaScript, etc.)
- Insert all quizzes into the database

**Output:** You'll see progress for each video:
```
Inserted quiz 1/10 for video 1
Inserted quiz 2/10 for video 1
...
✓ Done! Total quizzes inserted: 600+ (30 courses × 2 videos × 10 quizzes)
```

---

## 3. Progress Tracking

Progress is automatically tracked via the `progressController.js`:

### Track Course Progress
```
GET /api/progress/:userId/:courseId
```

**Response:**
```json
{
  "totalVideos": 2,
  "completedVideos": 2,
  "progressPercentage": 100
}
```

When progress reaches 100%, the course is automatically marked as `completed` in the enrollments table.

### Get Overall User Progress
```
GET /api/progress/overall/:userId
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "React Fundamentals",
    "totalVideos": 2,
    "completedVideos": 2,
    "progressPercentage": 100,
    "status": "completed",
    "completed_at": "2025-01-03T10:30:00Z"
  }
]
```

---

## 4. Certificate Generation

Certificates are automatically available once a course reaches 100% completion.

### Download Certificate (PDF)
```
GET /api/certificates/generate/:userId/:courseId
```

**Requirements:**
- Course must be 100% complete
- User must be authenticated (JWT token required)

**Response:** PDF file download with:
- Your logo at the top
- Student name
- Course name
- Completion date
- Certificate ID (unique per certificate)

### Verify Certificate
```
GET /api/certificates/verify/:userId/:courseId
```

**Response:**
```json
{
  "verified": true,
  "data": {
    "completed_at": "2025-01-03T10:30:00Z",
    "firstName": "John",
    "lastName": "Doe",
    "title": "Python for Beginners",
    "progress": 100
  },
  "message": "Certificate is valid"
}
```

### Get All User Certificates
```
GET /api/certificates/user/:userId
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Python for Beginners",
    "completed_at": "2025-01-03T10:30:00Z",
    "progress": 100,
    "firstName": "John",
    "lastName": "Doe"
  }
]
```

---

## 5. Frontend Integration

### Progress Page (Show in Student Dashboard)
```jsx
import React, { useEffect, useState } from 'react';

export const Progress = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    fetch(`/api/progress/${userId}/${courseId}`)
      .then(r => r.json())
      .then(data => setProgress(data));
  }, [userId, courseId]);

  return (
    <div>
      <h3>{progress?.progressPercentage}% Complete</h3>
      <progress value={progress?.progressPercentage} max="100"></progress>
      {progress?.progressPercentage === 100 && (
        <button onClick={() => generateCertificate()}>
          📄 Download Certificate
        </button>
      )}
    </div>
  );
};
```

### Download Certificate
```jsx
const generateCertificate = async () => {
  const response = await fetch(
    `/api/certificates/generate/${userId}/${courseId}`,
    { headers: { 'Authorization': `Bearer ${token}` } }
  );

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `certificate_${courseId}.pdf`;
  a.click();
};
```

---

## 6. Database Tables Required

Ensure your database has these tables (should already exist):

```sql
-- Courses table
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  description TEXT,
  -- ... other fields
);

-- Videos table
CREATE TABLE videos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT,
  title VARCHAR(255),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Quizzes table
CREATE TABLE quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  video_id INT,
  question VARCHAR(500),
  option_a VARCHAR(255),
  option_b VARCHAR(255),
  option_c VARCHAR(255),
  option_d VARCHAR(255),
  correct_option VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);

-- Enrollments table (updated)
ALTER TABLE enrollments ADD COLUMN status VARCHAR(50) DEFAULT 'active';
ALTER TABLE enrollments ADD COLUMN progress INT DEFAULT 0;
ALTER TABLE enrollments ADD COLUMN completed_at TIMESTAMP NULL;

-- Video progress table
CREATE TABLE video_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  video_id INT,
  completed TINYINT DEFAULT 0,
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (video_id) REFERENCES videos(id)
);
```

---

## 7. Course Categories (Auto-Detection)

The system automatically detects course type from title:

| Keywords | Category | Sample Questions |
|----------|----------|------------------|
| Python | python | Functions, lists, dictionaries, syntax |
| React | react | JSX, Props, State, Hooks |
| JavaScript | javascript | Async/await, closures, ES6 features |
| Data Structure | data structures | Arrays, linked lists, time complexity |
| DevOps | devops | CI/CD, Docker, Kubernetes |
| Docker | docker | Images, containers, volumes |
| Kubernetes | kubernetes | Pods, deployments, services |
| AWS/Cloud | aws | EC2, S3, Lambda, VPC |
| Java | java | OOP, inheritance, exceptions |
| SQL | sql | SELECT, JOIN, normalization |
| Machine Learning | machine_learning | Supervised, unsupervised, regression |
| Angular | angular | TypeScript, dependency injection, components |

---

## 8. API Routes Summary

```
Progress Routes:
GET  /api/progress/:userId/:courseId         → Get course progress
GET  /api/progress/overall/:userId           → Get all courses progress

Certificate Routes:
GET  /api/certificates/generate/:userId/:courseId  → Download PDF
GET  /api/certificates/verify/:userId/:courseId    → Verify certificate
GET  /api/certificates/user/:userId                → Get all user certificates
```

---

## 9. Troubleshooting

### Certificate download returns "Course not completed"
- Ensure course progress is 100%
- Check that `completed_at` is set in enrollments table
- Verify user is authenticated (JWT token in header)

### Quizzes not inserting
- Check database connection in `.env`
- Ensure videos exist in the database
- Run: `node scripts/seed_course_quizzes.js` (with console output)

### Logo not appearing on certificate
- Verify `vite-project/public/logo.png` exists
- Check file permissions
- Ensure path is correct: `../../vite-project/public/logo.png`

---

## 10. Next Steps

1. **Run the quiz seeder:**
   ```bash
   node backend/scripts/seed_course_quizzes.js
   ```

2. **Test progress tracking** by completing a course

3. **Generate a test certificate**

4. **Integrate frontend components** for progress display and certificate download

---

## Questions?
Review the code in:
- `backend/scripts/seed_course_quizzes.js` - Quiz generation
- `backend/Controllers/progressController.js` - Progress tracking
- `backend/Controllers/certificateController.js` - Certificate generation
