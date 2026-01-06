-- Add unique constraint on enrollments to prevent duplicate rows
-- Run this once against your MySQL database. If the constraint already exists,
-- MySQL may error; check existing indexes before running in production.

ALTER TABLE enrollments
  ADD CONSTRAINT unique_enrollment UNIQUE (user_email, course_id);
