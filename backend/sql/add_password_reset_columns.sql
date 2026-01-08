-- Add password reset and session management columns to users table
ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255) NULL COMMENT 'SHA256 hashed reset token',
ADD COLUMN reset_token_expiry DATETIME NULL,
ADD COLUMN token_version INT DEFAULT 1 NOT NULL COMMENT 'Version for JWT invalidation';

-- Add indexes for better performance
CREATE INDEX idx_reset_token ON users(reset_token);
CREATE INDEX idx_reset_token_expiry ON users(reset_token_expiry);
CREATE INDEX idx_token_version ON users(token_version);