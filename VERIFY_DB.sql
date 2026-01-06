-- Verification Script: Check if enrollments table has all required columns

-- 1. Check table structure
DESCRIBE enrollments;

-- 2. Count rows and check data
SELECT COUNT(*) as total_enrollments FROM enrollments;

-- 3. Check columns
SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'enrollments' 
ORDER BY ORDINAL_POSITION;

-- 4. Sample enrollment records
SELECT 
  id,
  user_email,
  course_id,
  status,
  progress,
  completed_at,
  enrolled_at
FROM enrollments 
LIMIT 5;

-- 5. Check if video_progress table exists
DESCRIBE video_progress;

-- If all above show proper structure with status, progress, completed_at columns,
-- the database is ready!
