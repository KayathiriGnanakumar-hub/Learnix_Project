#!/bin/bash

# Learnix Setup Verification Script

echo "🔍 Learnix Setup Verification"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi
echo "✅ Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi
echo "✅ npm is installed: $(npm --version)"

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed"
    exit 1
fi
echo "✅ MySQL is installed"

# Check if MySQL is running
if ! sudo systemctl is-active --quiet mysql 2>/dev/null && ! brew services list | grep mysql | grep started &> /dev/null; then
    echo "❌ MySQL service is not running"
    exit 1
fi
echo "✅ MySQL service is running"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "❌ backend/.env file not found"
    exit 1
fi
echo "✅ backend/.env file exists"

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "❌ Backend dependencies not installed. Run: cd backend && npm install"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Check if frontend dependencies are installed
if [ ! -d "client/node_modules" ]; then
    echo "❌ Frontend dependencies not installed. Run: cd client && npm install"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Test database connection
DB_HOST=$(grep "DB_HOST=" backend/.env | cut -d '=' -f2)
DB_USER=$(grep "DB_USER=" backend/.env | cut -d '=' -f2)
DB_PASSWORD=$(grep "DB_PASSWORD=" backend/.env | cut -d '=' -f2)
DB_NAME=$(grep "DB_NAME=" backend/.env | cut -d '=' -f2)

if mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -e "USE $DB_NAME; SELECT 1;" &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Run: ./setup-database.sh"
    exit 1
fi

# Check if tables exist
TABLE_COUNT=$(mysql -h$DB_HOST -u$DB_USER -p$DB_PASSWORD -NB -e "USE $DB_NAME; SHOW TABLES;" | wc -l)
if [ "$TABLE_COUNT" -lt 10 ]; then
    echo "❌ Not all database tables created. Run: ./setup-database.sh"
    exit 1
fi
echo "✅ Database tables created ($TABLE_COUNT tables)"

echo ""
echo "🎉 Setup verification completed successfully!"
echo ""
echo "🚀 You can now start the application:"
echo "   Backend:  cd backend && npm start"
echo "   Frontend: cd client && npm run dev"
echo ""
echo "📱 Access the application at: http://localhost:5173"