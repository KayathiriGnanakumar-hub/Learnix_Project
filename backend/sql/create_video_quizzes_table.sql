-- Create video_quizzes table if it doesn't exist (preserves existing data)
CREATE TABLE IF NOT EXISTS video_quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_id INT NOT NULL,
  question TEXT NOT NULL,
  options JSON,
  correct_option INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_video_id (video_id)
);
