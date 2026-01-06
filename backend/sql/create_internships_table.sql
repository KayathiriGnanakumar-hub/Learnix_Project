-- Create internships table
CREATE TABLE IF NOT EXISTS internships (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT,
  requirements TEXT,
  location VARCHAR(255),
  job_type VARCHAR(50), -- Full-time, Part-time, Remote, etc.
  stipend INT, -- Monthly stipend in local currency
  duration_months INT DEFAULT 3,
  posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deadline DATE,
  status VARCHAR(50) DEFAULT 'open', -- open, closed, filled
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create internship applications table
CREATE TABLE IF NOT EXISTS internship_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  user_id INT NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  resume_url VARCHAR(255),
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected, withdrawn
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_date TIMESTAMP NULL,
  FOREIGN KEY (internship_id) REFERENCES internships(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_application (internship_id, user_id)
);

-- Create internship requirement table (for eligibility - min courses to complete)
CREATE TABLE IF NOT EXISTS internship_eligibility (
  id INT AUTO_INCREMENT PRIMARY KEY,
  internship_id INT NOT NULL,
  min_courses_completed INT DEFAULT 2,
  required_course_ids VARCHAR(255), -- comma-separated course IDs
  FOREIGN KEY (internship_id) REFERENCES internships(id)
);
