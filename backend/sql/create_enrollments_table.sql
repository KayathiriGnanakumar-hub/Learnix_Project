-- Create enrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  course_id INT NOT NULL,
  status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed'
  progress INT DEFAULT 0, -- 0-100 percentage
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  UNIQUE KEY unique_enrollment (user_email, course_id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  INDEX idx_user_email (user_email),
  INDEX idx_course_id (course_id),
  INDEX idx_status (status)
);

-- Create video_progress table to track individual video completion
CREATE TABLE IF NOT EXISTS video_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  video_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_progress (user_email, video_id),
  FOREIGN KEY (video_id) REFERENCES videos(id),
  INDEX idx_user_email (user_email),
  INDEX idx_video_id (video_id)
);
