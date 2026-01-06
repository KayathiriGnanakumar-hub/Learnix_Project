# Certificate & Internship Features Setup

## ✅ What's Been Implemented

### 1. **Enhanced Certificates Page**
- Beautiful certificate cards with course information
- Download certificate as PDF button
- Shows completion date and progress
- Responsive grid layout
- Located at: `/certificates`

**Features:**
- ✅ Download certificates as PDF
- ✅ View all completed courses
- ✅ Shows completion dates
- ✅ Professional certificate design with logo and borders

### 2. **Internship System**
Complete internship platform with:
- Job listings with company details
- Internship eligibility checker (requires 2+ completed courses)
- Application management system
- User can apply, view applications, and withdraw
- Internship details: location, stipend, duration, requirements

**Features:**
- ✅ Browse available internships
- ✅ Check eligibility status
- ✅ Apply with cover letter
- ✅ View application status (pending, accepted, rejected)
- ✅ Withdraw applications
- ✅ Only eligible users can apply

## 📊 Database Tables Created

### 1. **internships**
```
- id (PK)
- title
- company
- description
- requirements
- location
- job_type (Full-time, Part-time, Remote, Hybrid)
- stipend
- duration_months
- deadline
- status (open, closed, filled)
- posted_date
```

### 2. **internship_applications**
```
- id (PK)
- internship_id (FK)
- user_id (FK)
- user_email
- cover_letter
- status (pending, accepted, rejected, withdrawn)
- applied_date
- response_date
```

### 3. **internship_eligibility**
```
- id (PK)
- internship_id (FK)
- min_courses_completed
- required_course_ids
```

## 🚀 API Endpoints

### Public Endpoints
- `GET /api/internships` - List all open internships
- `GET /api/internships/:id` - Get internship details

### Protected Endpoints (Require Authentication)
- `GET /api/internships/check/eligibility` - Check user eligibility
- `POST /api/internships/apply` - Apply for internship
- `GET /api/internships/applications/my` - Get user's applications
- `PUT /api/internships/applications/:applicationId/withdraw` - Withdraw application

## 📝 How to Use

### 1. **View Certificates**
Navigate to `http://localhost:3000/dashboard/certificates`

**Features:**
- Shows all completed courses
- Download button for each certificate
- Certificate includes: student name, course name, completion date

### 2. **Browse Internships**
Navigate to `http://localhost:3000/dashboard/internships`

**Eligibility Check:**
- Must complete at least 2 courses
- System shows how many courses you've completed

**To Apply:**
1. Find an internship
2. Click "Apply Now" (if eligible)
3. Write a cover letter
4. Submit application
5. Check "My Applications" section to view status

## 🌱 Seeding Sample Data

To populate the database with sample internships:

```bash
cd backend
node scripts/seed_internships.js
```

This will add 6 sample internship positions:
1. Frontend Developer Intern - Tech Innovations Inc.
2. Backend Developer Intern - Cloud Systems Ltd.
3. Full Stack Development Intern - StartUp Hub
4. Mobile App Developer Intern - AppWorld Studios
5. Data Science Intern - Analytics Pro
6. UI/UX Designer Intern - Design Studios

## 🎓 Certificate Download

When a student completes a course (100% progress):
1. The course moves to "Completed" status
2. Certificate appears in the Certificates section
3. Click "Download Certificate" to get PDF
4. PDF includes:
   - Student name
   - Course name
   - Completion date
   - Company logo (Learnix)
   - Professional certificate design

## 🔧 Backend Routes

All routes are automatically registered in `server.js`:
```javascript
app.use("/api/certificates", certificateRoutes);
app.use("/api/internships", internshipRoutes);
```

## 📋 Next Steps

1. **Start your backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start your frontend:**
   ```bash
   cd vite-project
   npm run dev
   ```

3. **Seed sample internships (optional):**
   ```bash
   cd backend
   node scripts/seed_internships.js
   ```

4. **Test the features:**
   - Complete some courses to test certificate feature
   - Check internship eligibility and apply

---

**Features Ready:** ✅ Certificates | ✅ Internships | ✅ Application Management
