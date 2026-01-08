# Learnix - Online Learning Platform

A full-stack online learning platform built with React, Node.js, Express, and MySQL.

## 🚀 Features

- **User Authentication** - Registration, login, password reset
- **Course Management** - Browse and enroll in courses
- **Video Learning** - Watch course videos with progress tracking
- **Quizzes** - Take quizzes after watching videos
- **Certificates** - Earn certificates upon course completion
- **Internship Portal** - Apply for internships
- **Admin Dashboard** - Manage courses, users, and applications
- **Contact Support** - Contact form for user inquiries

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcryptjs (password hashing)
- Nodemailer (email service)
- CORS

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd learnix-project
```

### 2. Environment Setup

```bash
# Copy environment file
cp backend/.env.example backend/.env

# Edit the .env file with your configuration
nano backend/.env
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=5001
JWT_SECRET=your_secure_jwt_secret_here

# Database Configuration
DB_HOST=127.0.0.1
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional - for password reset)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

### 3. Database Setup

**Option A: Automatic Setup (Recommended)**

```bash
# Make the setup script executable
chmod +x setup-database.sh

# Run the database setup script
./setup-database.sh
```

**Option B: Manual Setup**

1. Install and start MySQL
2. Create database and user manually
3. Run individual SQL files from `backend/sql/` directory

### 4. Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../client
npm install

# Return to root
cd ..
```

### 5. Start the Application

**Terminal 1: Backend**
```bash
cd backend
npm start
```

**Terminal 2: Frontend**
```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@learnix.com
- **Password**: admin123

## 📁 Project Structure

```
learnix-project/
├── backend/                 # Backend API server
│   ├── Controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── routes/             # API routes
│   ├── scripts/            # Database scripts
│   ├── sql/                # SQL schema files
│   ├── config/             # Database configuration
│   └── server.js           # Main server file
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── Components/     # React components
│   │   ├── context/        # React context
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── setup-database.sh       # Database setup script
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm start      # Start production server
npm run dev    # Start development server (requires nodemon)
```

**Frontend:**
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Database Management

The project includes several database management scripts in `backend/scripts/`:

- `initializeDatabase.js` - Sets up all tables and initial data
- `migrate_password_reset.js` - Adds password reset functionality
- Various seeding scripts for sample data

## 🔒 Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Token-based authentication with expiration
- **Session Invalidation** - Password reset invalidates all active sessions
- **Rate Limiting** - Prevents abuse on password reset endpoints
- **CORS Protection** - Configured for allowed origins only
- **Input Validation** - Strong password requirements and data validation

## 📧 Email Configuration

For password reset functionality, configure Gmail SMTP:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://support.google.com/accounts/answer/185833
3. Add the credentials to your `.env` file

## 🐛 Troubleshooting

### Database Connection Issues

1. Ensure MySQL is running: `sudo systemctl status mysql`
2. Check database credentials in `.env`
3. Run the setup script: `./setup-database.sh`

### CORS Errors

1. Check that `FRONTEND_URL` in `.env` matches your frontend URL
2. Ensure backend CORS configuration allows your frontend origin

### Port Conflicts

- Backend runs on port 5001
- Frontend runs on port 5173
- Change ports in `.env` or vite config if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please contact the development team or create an issue in the repository.
