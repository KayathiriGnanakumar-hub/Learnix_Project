#!/bin/bash

# Learnix Database Setup Script
# This script sets up the MySQL database for the Learnix project

echo "🔧 Learnix Database Setup"
echo "=========================="

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first:"
    echo "   Ubuntu/Debian: sudo apt install mysql-server"
    echo "   macOS: brew install mysql"
    echo "   Windows: Download from https://dev.mysql.com/downloads/mysql/"
    exit 1
fi

# Check if MySQL service is running
if ! sudo systemctl is-active --quiet mysql 2>/dev/null && ! brew services list | grep mysql | grep started &> /dev/null; then
    echo "❌ MySQL service is not running. Please start MySQL:"
    echo "   Ubuntu/Debian: sudo systemctl start mysql"
    echo "   macOS: brew services start mysql"
    exit 1
fi

echo "✅ MySQL is installed and running"

# Get database credentials from .env file
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure your settings."
    exit 1
fi

# Extract database credentials from .env
DB_HOST=$(grep "DB_HOST=" .env | cut -d '=' -f2)
DB_USER=$(grep "DB_USER=" .env | cut -d '=' -f2)
DB_PASSWORD=$(grep "DB_PASSWORD=" .env | cut -d '=' -f2)
DB_NAME=$(grep "DB_NAME=" .env | cut -d '=' -f2)

echo "📝 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"

# Create database if it doesn't exist
echo "📦 Creating database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null || {
    echo "⚠️  Could not create database with root user. Trying with sudo..."
    sudo mysql -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
}

# Create user and grant permissions
echo "👤 Creating database user..."
mysql -u root -p -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null || {
    echo "⚠️  Could not create user with root. Trying with sudo..."
    sudo mysql -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD'; GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost'; FLUSH PRIVILEGES;"
}

# Create tables
echo "🛠️  Creating tables..."

# Users table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  token_version INT DEFAULT 1 NOT NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expiry DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# Admins table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_permanent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);"

# Insert default admin
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
INSERT IGNORE INTO admins (name, email, password, is_permanent)
VALUES ('Admin', 'admin@learnix.com', '\$2b\$10\$E.WRQvMQjyibuidECsuKS.2BpklcvsR1uR40xHusRWXLxfF2v/SEK', TRUE);"

# Courses table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# Videos table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(255),
  duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);"

# Enrollments table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  course_id INT NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completion_status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  progress_percentage INT DEFAULT 0,
  UNIQUE KEY unique_enrollment (user_email, course_id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);"

# Video progress table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS video_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  video_id INT NOT NULL,
  watched_duration INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  last_watched TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (user_email, video_id),
  FOREIGN KEY (video_id) REFERENCES videos(id)
);"

# Video quizzes table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS video_quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id INT NOT NULL,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_answer VARCHAR(255) NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
);"

# Quiz results table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  video_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  answers JSON,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (video_id) REFERENCES videos(id)
);"

# Contact inquiries table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('pending', 'responded', 'closed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);"

# Internships table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  description TEXT,
  requirements TEXT,
  duration VARCHAR(100),
  stipend DECIMAL(10,2),
  application_deadline DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"

# Internship eligibility table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS internship_eligibility (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  criteria TEXT NOT NULL,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE
);"

# Internship applications table
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "
CREATE TABLE IF NOT EXISTS internship_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  resume_url VARCHAR(255),
  cover_letter TEXT,
  status ENUM('pending', 'reviewed', 'shortlisted', 'selected', 'rejected') DEFAULT 'pending',
  admin_message TEXT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id)
);"

echo "✅ Database setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server: cd backend && npm start"
echo "2. Start the frontend: cd client && npm run dev"
echo "3. Visit http://localhost:5173 to access the application"
echo ""
echo "🔐 Default admin credentials:"
echo "   Email: admin@learnix.com"
echo "   Password: admin123"