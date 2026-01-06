# Complete Course Enrollment & Certificate Flow

## User Flow
```
1. USER BROWSES COURSE
   ↓ Visits /course/:id
   ↓ Sees "Enroll Now" button

2. USER CLICKS "ENROLL NOW"
   ├─ IF NOT LOGGED IN → Redirects to /login?redirect=/course/:id
   │  ├─ User logs in
   │  └─ Redirected back to /course/:id
   │
   └─ IF LOGGED IN → Adds course to cart + navigates to /payment

3. PAYMENT PAGE (/payment)
   ↓ Shows cart items and total price
   ↓ User clicks "Pay Now $XX"

4. PAYMENT SUCCESS (/payment-success)
   ├─ Calls POST /api/enroll for each course with complete: true
   ├─ Backend marks enrollment as:
   │  ├─ status: 'completed'
   │  ├─ progress: 100
   │  └─ completed_at: NOW()
   │
   ├─ Clears cart
   └─ Redirects to /students/my-courses after 2 seconds

5. STUDENT DASHBOARD (/students/dashboard)
   ├─ Shows: Enrolled courses, Completed courses, Certificates earned
   └─ Fetches stats from /api/enroll/my

6. MY COURSES PAGE (/students/my-courses)
   ├─ Lists all enrolled courses
   └─ Click "Continue" → goes to /course/:id with isEnrolled=true

7. COURSE DETAILS PAGE (enrolled mode)
   ├─ Video player is active
   ├─ Watch video → triggers onVideoEnd event
   ├─ Marks video complete in DB (video_progress)
   ├─ Shows "Take Quiz Now" button (if video watched)
   └─ Click quiz → /quiz/:videoId

8. QUIZ PAGE (/quiz/:videoId)
   ├─ Fetches up to 10 questions from /api/admin/quizzes/video/:videoId
   ├─ User answers all questions
   ├─ Submits quiz → calculates score
   ├─ IF score >= 70%:
   │  ├─ Shows "Quiz Passed!" message
   │  └─ Marks video as completed for progress
   │
   └─ IF score < 70%:
      └─ Shows "Try Again" button

9. PROGRESS PAGE (/students/progress)
   ├─ Fetches enrolled courses from /api/enroll/my
   ├─ For each course, calculates progress based on video_progress
   ├─ Shows progress bars and completion status
   └─ IF course is 100% complete → shows "🎉 Course Complete!"

10. CERTIFICATES PAGE (/students/certificates)
    ├─ Checks /api/enroll/my for courses with:
    │  ├─ status: 'completed'
    │  └─ progress: 100
    │
    ├─ Displays available certificates
    └─ User clicks "Download Certificate"
       ├─ Extracts userId from JWT token
       ├─ Calls GET /api/certificates/generate/:userId/:courseId
       ├─ Backend generates PDF certificate
       └─ Browser downloads PDF file
```

## Key Changes Made

### 1. Backend Enrollment Table (New)
**File:** `backend/sql/create_enrollments_table.sql`
- Ensures `enrollments` table has required columns:
  - `user_email` (VARCHAR)
  - `course_id` (INT)
  - `status` ('in_progress' or 'completed')
  - `progress` (0-100)
  - `completed_at` (timestamp, NULL if not completed)

### 2. Enrollment Controller Update
**File:** `backend/Controllers/enrollmentController.js`
- Updated `enrollCourse()` to:
  - Accept optional `complete: true` flag
  - If `complete: true` → marks enrollment as `status='completed'`, `progress=100`, sets `completed_at=NOW()`
  - If not → marks as `status='in_progress'`, `progress=0`

### 3. Quiz Routes Fixed
**File:** `backend/routes/adminQuizRoutes.js`
- Switched from `quizzes` table to `video_quizzes` table
- Limits to 10 questions per video
- Normalizes options JSON to `option_a`, `option_b`, `option_c`, `option_d`
- Maps `correct_option` field to 'a', 'b', 'c', or 'd'

### 4. Payment Success Flow
**File:** `vite-project/src/Components/PaymentSuccess.jsx`
- Changed enrollment body to include `complete: true`
- This marks courses as completed immediately after payment
- Enables instant certificate generation

### 5. Certificates Page Logic
**File:** `vite-project/src/Components/students/Certificates.jsx`
- Changed from counting videos to checking `enrollments` table:
  - Queries `status='completed' && progress=100`
  - Uses `completed_at` from enrollments for display
  - No longer depends on video progress calculations

### 6. Database Initialization
**File:** `backend/scripts/initializeDatabase.js`
- Now includes `create_enrollments_table.sql`
- Initializes all required tables on server startup

### 7. Courses with Videos Endpoint (New)
**File:** `backend/routes/courseRoutes.js`
- Added GET `/list/with-videos` endpoint
- Returns all courses with their associated video IDs and details
- Format:
```json
[
  {
    "courseId": 1,
    "courseName": "React JS",
    "description": "...",
    "price": 499,
    "instructor": "...",
    "videos": [
      {"videoId": 1, "videoTitle": "...", "youtubeUrl": "...", "orderNo": 1},
      ...
    ]
  }
]
```

## Database Schema

### enrollments table
```sql
CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  course_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress',
  progress INT DEFAULT 0,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  UNIQUE KEY unique_enrollment (user_email, course_id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);
```

### video_progress table
```sql
CREATE TABLE video_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  video_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (user_email, video_id),
  FOREIGN KEY (video_id) REFERENCES videos(id)
);
```

## API Endpoints Used

### Public Endpoints
- GET `/api/courses` - List all courses
- GET `/api/courses/:id` - Get single course
- GET `/api/courses/list/with-videos` - List courses with video IDs
- GET `/api/videos/course/:courseId` - List videos for a course
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Student Endpoints (require authentication)
- POST `/api/enroll` - Enroll in course (with optional `complete: true`)
- GET `/api/enroll/my` - Get user's enrolled courses
- GET `/api/admin/quizzes/video/:videoId` - Get quiz questions for video
- POST `/api/progress/complete` - Mark video as completed
- GET `/api/progress/:courseId` - Get course progress
- GET `/api/certificates/generate/:userId/:courseId` - Generate certificate PDF

## Testing the Flow Locally

1. **Start Backend**
```bash
cd backend
npm install
npm run dev
```

2. **Start Frontend**
```bash
cd vite-project
npm install
npm run dev
```

3. **Test Flow**
- Register new user
- Browse courses
- Click "Enroll Now" on a course
- Complete payment (Pay Now)
- Should redirect to student dashboard
- My Courses should show the new enrollment
- Click "Continue" on enrolled course
- Watch a video (simulated by clicking video play)
- Video completion trigger should allow quiz
- Take quiz and score >= 70% to pass
- Progress page should show updated progress
- Certificate page should show certificate if course is marked complete
- Download certificate should generate PDF

## Important Notes

1. **Instant Certificates**: With the current flow, courses are marked as `completed` immediately after payment. This allows instant certificate generation. If you want certificates only after completing all videos/quizzes:
   - Remove `complete: true` from PaymentSuccess.jsx
   - Keep enrollment as `in_progress`
   - Update progress controller to set `completed` when progress reaches 100%

2. **User Name Handling**: The certificate uses:
   - `firstName` + `lastName` if available
   - Falls back to `name` field
   - Falls back to email prefix if neither exists

3. **Quiz Questions**: Maximum 10 questions per video are returned from `video_quizzes` table. Ensure your seeding script inserts questions there, not in the old `quizzes` table.

4. **Progress Calculation**: Currently based on `video_progress` table. Quiz completion updates progress when score >= 70%.
