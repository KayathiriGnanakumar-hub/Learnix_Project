## 📧 CONTACT PAGE SYSTEM - COMPLETE SETUP GUIDE

---

## 🎯 SYSTEM OVERVIEW

Your contact system is now fully implemented with:

### **User Side (Contact Form)**
- Users submit queries with: Name, Email, Phone (optional), Subject, Message
- Confirmation email sent automatically to user
- Query stored in database

### **Admin Side (Contact Management)**
- All admins receive notification emails about new queries
- Admin panel shows all queries with filtering (Pending/Responded/Closed)
- Admins can view, reply to, and manage query status
- Only **Permanent Admin** can delete queries
- Admin replies are automatically emailed to users

### **Admin Access Control**
- Only **Permanent Admin** can grant/revoke admin access
- Secondary admins can view and reply to queries
- Role-based access control throughout

---

## 📋 FILES CREATED

### **Backend Files**
```
backend/
├── config/
│   └── emailService.js (NEW - Email configuration & sending)
├── Controllers/
│   └── contactController.js (NEW - All query handling logic)
├── routes/
│   └── contactRoutes.js (NEW - All contact endpoints)
├── sql/
│   └── create_contact_table.sql (NEW - Database table schema)
└── server.js (UPDATED - Added contact routes)
```

### **Frontend Files**
```
vite-project/src/
├── Components/
│   ├── Contact.jsx (UPDATED - Added form with validation & submission)
│   └── admin/
│       ├── ContactQueries.jsx (NEW - Admin query management panel)
│       └── AdminLayout.jsx (UPDATED - Added menu item for Contact Queries)
└── App.jsx (UPDATED - Added routing for Contact Queries)
```

---

## 🔧 SETUP STEPS (DO THIS FIRST)

### **Step 1: Create Database Table**

Run this SQL query in your MySQL database:

```sql
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message LONGTEXT NOT NULL,
  reply LONGTEXT,
  reply_date DATETIME,
  status ENUM('pending', 'responded', 'closed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

**Or use the file:** `backend/sql/create_contact_table.sql`

---

### **Step 2: Email Configuration (GMAIL SETUP)**

You need to set up Gmail SMTP credentials. Follow these steps:

#### **2A. Enable 2-Factor Authentication on Gmail**
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **Security** in the left sidebar
3. Find **2-Step Verification** and enable it

#### **2B. Create App Password**
1. Go back to Security settings
2. Find **App passwords** (appears only after 2FA is enabled)
3. Select **Mail** and **Windows Computer**
4. Google will generate a 16-character password
5. Copy this password

#### **2C. Add to .env file**
Create or update `backend/.env` with:

```
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database

JWT_SECRET=your_jwt_secret
PORT=5000

# NEW: Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Important:** Use the **16-character App Password**, not your regular Gmail password!

---

### **Step 3: Install nodemailer Package**

Run in `backend` folder:
```bash
npm install nodemailer
```

---

### **Step 4: Test Email Configuration**

Create a test script `backend/test_email.js`:

```javascript
import { testEmail } from "./config/emailService.js";

testEmail("your-email@gmail.com")
  .then(() => console.log("✅ Email test successful!"))
  .catch(err => console.log("❌ Email test failed:", err.message));
```

Run: `node test_email.js`

---

## 🚀 HOW IT WORKS

### **User Submits Contact Query**
1. User fills Contact form at `/contact` page
2. Form validates all required fields
3. Query submitted to backend: `POST /api/contact/submit`
4. Backend:
   - ✅ Saves query to `contact_inquiries` table
   - ✅ Sends confirmation email to user
   - ✅ Sends notification emails to ALL admins
5. User sees success message

### **Admin Manages Queries**
1. Admin logs in and goes to Admin Dashboard
2. Clicks **Contact Queries** in sidebar
3. Can see:
   - **Stats**: Pending/Responded/Closed counts
   - **Filter**: By status
   - **Query List**: All submissions
   - **Query Details**: Full message when selected
4. Admin actions:
   - ✅ View query details
   - ✅ Send reply (auto-emails to user)
   - ✅ Update status (Pending → Responded → Closed)
   - ✅ Delete query (only permanent admin)

---

## 📡 API ENDPOINTS

### **Public Endpoint** (Anyone can use)
```
POST /api/contact/submit
Body: {
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 1234567890",
  subject: "Course Inquiry",
  message: "I have a question..."
}
Response: {
  message: "Your query has been submitted successfully!",
  queryId: 123
}
```

### **Admin Endpoints** (Token required, admin only)

**Get All Queries:**
```
GET /api/contact/queries
Headers: Authorization: Bearer <token>
```

**Get Single Query:**
```
GET /api/contact/queries/:id
Headers: Authorization: Bearer <token>
```

**Send Reply:**
```
POST /api/contact/queries/:id/reply
Headers: Authorization: Bearer <token>
Body: {
  reply: "Thank you for your inquiry..."
}
```

**Update Status:**
```
PUT /api/contact/queries/:id/status
Headers: Authorization: Bearer <token>
Body: {
  status: "pending" | "responded" | "closed"
}
```

**Delete Query (Only Permanent Admin):**
```
DELETE /api/contact/queries/:id
Headers: Authorization: Bearer <token>
```

---

## 🔐 PERMISSION STRUCTURE

| Action | Public User | Secondary Admin | Permanent Admin |
|--------|-------------|-----------------|-----------------|
| Submit Query | ✅ | ✅ | ✅ |
| View Queries | ❌ | ✅ | ✅ |
| Reply to Query | ❌ | ✅ | ✅ |
| Update Status | ❌ | ✅ | ✅ |
| Delete Query | ❌ | ❌ | ✅ |
| Grant Admin Access | ❌ | ❌ | ✅ |
| Create New Admin | ❌ | ❌ | ✅ |

---

## 📊 DATABASE SCHEMA

```sql
contact_inquiries Table:
┌─────────────────┬──────────────────┬──────────────────┐
│ Column          │ Type             │ Purpose          │
├─────────────────┼──────────────────┼──────────────────┤
│ id              │ INT (PK)         │ Unique ID        │
│ name            │ VARCHAR(100)     │ Sender's name    │
│ email           │ VARCHAR(100)     │ Sender's email   │
│ subject         │ VARCHAR(255)     │ Query subject    │
│ message         │ LONGTEXT         │ Full message     │
│ reply           │ LONGTEXT         │ Admin's response │
│ reply_date      │ DATETIME         │ When replied     │
│ status          │ ENUM             │ pending/responded/closed |
│ created_at      │ TIMESTAMP        │ Submission time  │
│ updated_at      │ TIMESTAMP        │ Last update time │
└─────────────────┴──────────────────┴──────────────────┘
```

---

## ✉️ EMAIL WORKFLOW

### **Confirmation Email (to User)**
- Sent immediately after query submission
- Subject: "We received your inquiry - Learnix Support"
- Tells user their message was received
- Sets expectations for response time

### **Notification Email (to All Admins)**
- Sent immediately after query submission
- Subject: "New contact query from [Name]"
- Shows full message so admins can start reviewing
- Allows quick response

### **Reply Email (to User)**
- Sent when admin sends reply
- Subject: "Re: [Original Subject]"
- Contains admin's response
- User can simply reply to this email if needed

---

## 🛠️ TROUBLESHOOTING

### **Email Not Sending?**

**Check 1:** Verify .env variables
```bash
# backend/.env must have:
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

**Check 2:** Verify Gmail App Password
- Is it a 16-character password from Google (not your regular password)?
- Is 2FA enabled on Gmail?

**Check 3:** Check backend console logs
```
❌ Error sending confirmation email
❌ Error sending admin notification
```

**Check 4:** Test with test script
```bash
node backend/test_email.js
```

### **Admin Can't See Queries?**

- Verify user is logged in as admin
- Check if `admins` table has the user with correct permissions
- Check browser console for API errors

### **Query Not Saving to Database?**

1. Verify table exists: `SHOW TABLES;`
2. Check DB connection in `backend/config/db.js`
3. Check server logs for SQL errors
4. Verify all required fields are filled in form

---

## 🎯 NEXT STEPS

1. ✅ Create `contact_inquiries` table in database
2. ✅ Set up Gmail SMTP credentials in `.env`
3. ✅ Install `nodemailer` package
4. ✅ Test email configuration
5. ✅ Restart backend server
6. ✅ Test contact form submission
7. ✅ Verify queries appear in admin panel
8. ✅ Test admin reply functionality

---

## 📞 SUPPORT

If you encounter issues:
1. Check the **Troubleshooting** section above
2. Review backend console logs
3. Verify all `.env` variables are set
4. Test email configuration separately
5. Check database table structure

---

## 📝 IMPORTANT NOTES

- **Email Password:** Use Google App Password, NOT your Gmail password
- **Admin Access:** Only Permanent Admin can create/delete admins
- **Query Storage:** All queries stored indefinitely (only permanent admin can delete)
- **Emails:** Make sure to check spam folder for test emails
- **Mobile Responsive:** Admin panel is fully responsive
- **Real-time Updates:** Admin panel requires manual refresh to see new queries

---

**✅ Implementation Complete!** Your contact system is ready to use. 🎉
