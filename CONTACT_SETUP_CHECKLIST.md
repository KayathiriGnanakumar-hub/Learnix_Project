## ✅ CONTACT SYSTEM - QUICK SETUP CHECKLIST

Complete these steps in order:

### **Database Setup**
- [ ] Run SQL query to create `contact_inquiries` table
- [ ] Verify table created: `SHOW TABLES;`

### **Email Configuration**
- [ ] Enable 2-Factor Authentication on your Gmail account
- [ ] Generate Google App Password
- [ ] Add `EMAIL_USER` to `backend/.env`
- [ ] Add `EMAIL_PASSWORD` (16-char App Password) to `backend/.env`

### **Backend Setup**
- [ ] Navigate to backend folder: `cd backend`
- [ ] Install nodemailer: `npm install nodemailer`
- [ ] Test email: `node test_email.js`
- [ ] Restart backend server: `npm start` or `node server.js`

### **Verify Implementation**
- [ ] Contact form appears at `/contact` page
- [ ] Submit test query from contact form
- [ ] Check that confirmation email received
- [ ] Check that admin notification email received
- [ ] Admin can log in to admin panel
- [ ] New "Contact Queries" option appears in admin sidebar
- [ ] Admin can see the test query in Contact Queries panel
- [ ] Admin can write and send a reply
- [ ] Check that reply email received by user

### **Test All Statuses**
- [ ] Query starts as "Pending"
- [ ] After admin reply, status changes to "Responded"
- [ ] Admin can manually change to "Closed"
- [ ] Filter shows correct counts

### **Final Verification**
- [ ] Multiple test queries submitted
- [ ] All admin emails are receiving notifications
- [ ] Reply emails formatting looks good
- [ ] No errors in backend console
- [ ] Admin panel fully functional

---

## 🚀 QUICK COMMANDS

### Backend Commands
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install nodemailer

# Test email
node test_email.js

# Start server
npm start
```

### Frontend
```bash
# Navigate to frontend
cd vite-project

# Start dev server (if not already running)
npm run dev
```

---

## 📧 EMAIL CREDENTIALS SETUP

**Gmail Account Steps:**
1. Go to: https://myaccount.google.com
2. Click: Security (left sidebar)
3. Find: 2-Step Verification → Turn ON
4. Find: App passwords → Generate new
5. Select: Mail, Windows Computer
6. Copy: 16-character password
7. Paste in: `backend/.env` as EMAIL_PASSWORD

---

## 🔍 TESTING CHECKLIST

### Test Case 1: Basic Form Submission
- [ ] User submits query
- [ ] Sees success message
- [ ] Confirmation email arrives within 2 mins
- [ ] Query in database

### Test Case 2: Admin Notification
- [ ] All admin emails receive notification
- [ ] Notification contains user's message
- [ ] Query appears in admin panel

### Test Case 3: Admin Reply
- [ ] Admin can access Contact Queries page
- [ ] Admin can select a query
- [ ] Admin can write reply
- [ ] Admin clicks "Send Reply"
- [ ] Reply email sent to user

### Test Case 4: Status Management
- [ ] Query status changes to "Responded" after reply
- [ ] Admin can change status manually
- [ ] Filter works correctly
- [ ] Counts update correctly

---

## ⚠️ COMMON ISSUES

| Problem | Solution |
|---------|----------|
| Email not sending | Check .env EMAIL_USER and EMAIL_PASSWORD |
| App Password not working | Make sure 2FA is enabled on Gmail first |
| "Unauthorized" in admin panel | User might not be in admins table |
| Contact form shows error | Check backend server is running on port 5000 |
| No queries showing | Try refreshing admin panel or check browser console |

---

## 📞 SUPPORT CONTACTS

If something doesn't work:
1. Check `backend.log` or terminal output for errors
2. Verify all `.env` variables are correct
3. Test email separately: `node test_email.js`
4. Check backend console for SQL errors
5. Verify database table exists: `DESCRIBE contact_inquiries;`

---

**Last Updated:** January 7, 2026
**System Status:** ✅ READY TO USE
