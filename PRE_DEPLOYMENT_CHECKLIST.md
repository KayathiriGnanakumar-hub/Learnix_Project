# Pre-Deployment Checklist

## ✅ Code Changes Complete

- [x] Enrollment controller updated (complete flag support)
- [x] Quiz routes updated (video_quizzes, 10 limit, normalization)
- [x] Course routes updated (add /list/with-videos endpoint)
- [x] Database initialization updated (enrollments table)
- [x] PaymentSuccess component updated (complete: true)
- [x] Certificates page updated (enrollments status check)
- [x] Progress page updated (enrollments completion check)
- [x] Database schema created (enrollments_table.sql)

## ✅ Testing Steps

### 1. Local Environment
```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev
# Check logs for: ✅ MySQL connected, ✅ Enrollments tables initialized

# Terminal 2: Start Frontend
cd vite-project
npm install
npm run dev
# Check browser console for no errors
```

### 2. Manual Flow Testing
- [ ] Register new user account
- [ ] Login successfully
- [ ] Browse courses page
- [ ] Click "Enroll Now" on a course
- [ ] Redirected to /payment
- [ ] Click "Pay Now"
- [ ] See "Processing Payment" message
- [ ] Redirected to /students/my-courses
- [ ] Course appears in "My Courses"
- [ ] Go to /students/progress
- [ ] Course shows 100% progress
- [ ] Go to /students/certificates
- [ ] Certificate appears (even without watching videos)
- [ ] Click "Download Certificate"
- [ ] PDF downloads with student name and course name

### 3. Database Verification
```bash
# Open MySQL client
mysql -u root -p

# Check enrollments table
USE learnix_db; -- (or your DB name)
SELECT * FROM enrollments;

# Should see columns:
# - id, user_email, course_id, status, progress, enrolled_at, completed_at
# - First enrollment should have: status='completed', progress=100
```

### 4. API Testing (optional, using Postman or curl)

#### Register User
```bash
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
# Response should include token and user.name
```

#### Enroll Course
```bash
POST /api/enroll
Authorization: Bearer <token>
{
  "courseId": 1,
  "complete": true
}
```

#### Get My Enrollments
```bash
GET /api/enroll/my
Authorization: Bearer <token>
# Should return course with status='completed', progress=100
```

#### Get Courses with Videos
```bash
GET /api/courses/list/with-videos
# Should return array of courses with nested videos array
```

#### Get Quiz Questions
```bash
GET /api/admin/quizzes/video/1
# Should return max 10 questions with option_a..option_d format
```

#### Generate Certificate
```bash
GET /api/certificates/generate/1/1
Authorization: Bearer <token>
# Should return PDF blob that can be downloaded
```

## ✅ Browser Console Checks

### No Errors
- [ ] No red errors in browser console
- [ ] No 404s in Network tab
- [ ] No CORS errors

### Expected Logs
- [ ] Enrollment log: "✅ Enrolled in [Course Name]"
- [ ] Certificate decode log: "✅ Decoded userId from token: X"
- [ ] Quiz fetch log: "📝 Fetched quizzes: [...]"

## ✅ Common Issues & Solutions

### Issue: "Table 'enrollments' doesn't exist"
**Solution**: Ensure backend started and initialization script ran
```bash
# Check server.js imports and runs initializeDatabase
# Look for: "✅ Enrollments tables initialized"
```

### Issue: Enrollment succeeds but course not in "My Courses"
**Solution**: Clear browser cache and refresh
```bash
# Ctrl+Shift+Delete → Clear cache
# Then refresh page
```

### Issue: Certificate doesn't show on certificates page
**Solution**: Verify enrollment status and progress values
```bash
# In MySQL:
SELECT user_email, course_id, status, progress FROM enrollments;
# Should show status='completed', progress=100
```

### Issue: Quiz returns wrong format
**Solution**: Ensure adminQuizRoutes.js changes are saved
```bash
# Check /backend/routes/adminQuizRoutes.js
# Should have normalization code with option_a..option_d
```

### Issue: PDF download fails (404)
**Solution**: Verify userId is correctly extracted from JWT
```javascript
// In browser console:
const token = localStorage.getItem('learnix_token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log('userId:', decoded.id); // Should be a number
```

## ✅ Performance Checks

- [ ] Page loads < 2 seconds
- [ ] Enrollment API responds < 500ms
- [ ] Certificate generation < 1 second
- [ ] Quiz questions load < 500ms

## ✅ Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers

## ✅ Security Checks

- [ ] JWT token properly validated
- [ ] Password hashing working (bcryptjs)
- [ ] Authorization headers checked
- [ ] SQL injection prevented (using parameterized queries)

## ✅ Data Integrity

- [ ] Duplicate enrollments prevented (UNIQUE constraint)
- [ ] User can't enroll twice for same course
- [ ] Progress values stay in 0-100 range
- [ ] Completed_at timestamp set correctly

## ✅ User Experience

- [ ] 2-second redirect after payment is smooth
- [ ] Loading spinners show during processing
- [ ] Error messages are clear
- [ ] Success messages display properly

## 📋 Post-Deployment Steps

1. **Monitor Logs**
   - Check backend logs for any errors
   - Monitor database connections

2. **User Testing**
   - Have 5 test users go through complete flow
   - Get feedback on UX

3. **Analytics**
   - Track enrollment completion rate
   - Monitor certificate generation success rate
   - Check for API errors

4. **Backup**
   - Backup database before going live
   - Document any custom configurations

5. **Documentation**
   - Send FLOW_DOCUMENTATION.md to team
   - Document any environment-specific setup

## 🎯 Success Criteria

When deployment is complete:
- ✅ User can complete entire flow in < 5 minutes
- ✅ All certificates generated without errors
- ✅ No database errors in logs
- ✅ Quiz questions display correctly
- ✅ Progress updates in real-time
- ✅ Payment flow is smooth and intuitive

## 🆘 Emergency Contacts

If issues arise:
1. Check this checklist first
2. Review FLOW_DOCUMENTATION.md
3. Check browser console for errors
4. Check MySQL for data integrity
5. Review API logs in backend terminal

---

**Ready for Production! 🚀**
