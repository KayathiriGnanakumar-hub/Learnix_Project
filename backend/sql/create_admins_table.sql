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
VALUES ('Admin', 'admin@learnix.com', '$2b$10$E.WRQvMQjyibuidECsuKS.2BpklcvsR1uR40xHusRWXLxfF2v/SEK', TRUE);
