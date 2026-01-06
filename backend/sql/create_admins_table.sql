-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_permanent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert permanent admin if it doesn't exist
INSERT IGNORE INTO admins (name, email, password, is_permanent) 
VALUES ('Admin', 'admin@learnix.com', '$2a$10$wHLt5m/A8hj4f2Kj5Y1C8uZzF5G5H5I5J5K5L5M5N5O5P5Q5R5S5', TRUE);
