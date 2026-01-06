-- Create quiz_results table to track quiz performance
CREATE TABLE IF NOT EXISTS quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  video_id INT NOT NULL,
  course_id INT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  passed BOOLEAN DEFAULT FALSE,
  taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (video_id) REFERENCES videos(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  INDEX idx_user_course (user_id, course_id),
  INDEX idx_user_video (user_id, video_id),
  INDEX idx_passed (passed)
);
