-- Add missing columns to enrollments table if they don't exist
ALTER TABLE enrollments ADD COLUMN status VARCHAR(50) DEFAULT 'in_progress' AFTER course_id;
ALTER TABLE enrollments ADD COLUMN progress INT DEFAULT 0 AFTER status;
ALTER TABLE enrollments ADD COLUMN completed_at TIMESTAMP NULL AFTER progress;

-- Add indexes for better performance
ALTER TABLE enrollments ADD INDEX idx_status (status);

-- Verify the structure
DESCRIBE enrollments;
