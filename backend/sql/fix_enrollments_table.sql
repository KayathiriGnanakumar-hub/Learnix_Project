-- Fix enrollments table schema
ALTER TABLE enrollments DROP COLUMN IF EXISTS user_name;

ALTER TABLE enrollments MODIFY COLUMN status VARCHAR(50) DEFAULT 'in_progress';

ALTER TABLE enrollments MODIFY COLUMN progress INT DEFAULT 0;

ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL;
