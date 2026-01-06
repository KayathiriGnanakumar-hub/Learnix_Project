-- QUICK FIX: Run this directly in MySQL to add missing columns to enrollments table

-- Add missing columns to enrollments table
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'in_progress' AFTER course_id;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS progress INT DEFAULT 0 AFTER status;
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL AFTER progress;

-- Add index for status column
ALTER TABLE enrollments ADD INDEX IF NOT EXISTS idx_status (status);

-- Show table structure to verify
DESCRIBE enrollments;

-- Show sample data
SELECT id, user_email, course_id, status, progress, completed_at FROM enrollments LIMIT 5;
