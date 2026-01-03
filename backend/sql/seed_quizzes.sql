-- Example INSERT statements for `quizzes` table
-- Adjust video_id values to match your `videos` table

-- Sample quizzes for video_id = 1
INSERT INTO quizzes (video_id, question, option_a, option_b, option_c, option_d, correct_option)
VALUES
(1, 'What is 2 + 2?', '3', '4', '5', '6', '4'),
(1, 'Which language is used for backend here?', 'Python', 'Ruby', 'JavaScript', 'Go', 'JavaScript'),
(1, 'Choose the correct option for sample question 3', 'A', 'B', 'C', 'D', 'A');

-- Sample quizzes for video_id = 2
INSERT INTO quizzes (video_id, question, option_a, option_b, option_c, option_d, correct_option)
VALUES
(2, 'What does HTTP stand for?', 'HyperText Transfer Protocol', 'HighText Transfer Protocol', 'HyperTransfer Text Protocol', 'HyperText Transfer Process', 'HyperText Transfer Protocol'),
(2, 'Which tag is used for a link in HTML?', '<a>', '<link>', '<href>', '<url>', '<a>');

-- Sample quizzes for video_id = 3
INSERT INTO quizzes (video_id, question, option_a, option_b, option_c, option_d, correct_option)
VALUES
(3, 'Which SQL command lists rows from a table?', 'SHOW', 'GET', 'SELECT', 'LIST', 'SELECT'),
(3, 'Which CSS property sets background color?', 'color', 'bg', 'background-color', 'bg-color', 'background-color');

-- If your table uses different column names or requires extra fields (timestamps, id autoincrement), edit accordingly.
