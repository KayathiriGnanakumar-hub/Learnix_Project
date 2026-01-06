import mysql from 'mysql2/promise';

async function seedQuizzes() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gnana@1972',
    database: 'learnix_db'
  });

  try {
    console.log('🌱 Seeding quiz questions...\n');

    // Sample quizzes for each video (correct_option: 0=a, 1=b, 2=c, 3=d)
    const quizzes = [
      {
        video_id: 1,
        question: 'What is Python primarily used for?',
        options: ['Web Development', 'Data Science', 'System Administration', 'Game Development'],
        correct_option: 1  // b = index 1
      },
      {
        video_id: 1,
        question: 'Which keyword is used to create a function in Python?',
        options: ['function', 'def', 'func', 'define'],
        correct_option: 1  // b = index 1
      },
      {
        video_id: 1,
        question: 'What is the correct way to create a list in Python?',
        options: ['list = (1, 2, 3)', 'list = [1, 2, 3]', 'list = {1, 2, 3}', 'list = <1, 2, 3>'],
        correct_option: 1
      },
      {
        video_id: 1,
        question: 'What does "PEP 8" refer to in Python?',
        options: ['Python Enhancement Package', 'Python Enhancement Proposal', 'Python Execution Protocol', 'Python Error Prevention'],
        correct_option: 1
      },
      {
        video_id: 1,
        question: 'How do you create a dictionary in Python?',
        options: ['dict = [key: value]', 'dict = {key: value}', 'dict = (key: value)', 'dict = <key: value>'],
        correct_option: 1
      },
      {
        video_id: 2,
        question: 'What does JSX stand for?',
        options: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax Extension', 'JavaScript Execution'],
        correct_option: 0
      },
      {
        video_id: 2,
        question: 'Which hook allows you to manage state in functional components?',
        options: ['useContext', 'useState', 'useEffect', 'useRef'],
        correct_option: 1
      },
      {
        video_id: 2,
        question: 'What is the purpose of the useEffect hook?',
        options: ['To manage state', 'To perform side effects', 'To create components', 'To handle routing'],
        correct_option: 1
      },
      {
        video_id: 2,
        question: 'How do you pass data from parent to child component in React?',
        options: ['Using state', 'Using props', 'Using context', 'Using localStorage'],
        correct_option: 1
      },
      {
        video_id: 2,
        question: 'What is the Virtual DOM in React?',
        options: ['A browser feature', 'An in-memory representation of the UI', 'A database', 'A CSS library'],
        correct_option: 1
      },
      {
        video_id: 3,
        question: 'What is React?',
        options: ['A backend framework', 'A JavaScript library for building UIs', 'A database', 'A CSS preprocessor'],
        correct_option: 1
      },
      {
        video_id: 3,
        question: 'Who created React?',
        options: ['Google', 'Facebook', 'Microsoft', 'Apple'],
        correct_option: 1
      },
      {
        video_id: 3,
        question: 'What is a component in React?',
        options: ['A function that returns HTML', 'A database table', 'A styling tool', 'A router'],
        correct_option: 0
      },
      {
        video_id: 3,
        question: 'What is the difference between state and props?',
        options: ['State is mutable, props are immutable', 'State is immutable, props are mutable', 'No difference', 'State is for classes only'],
        correct_option: 0
      },
      {
        video_id: 3,
        question: 'How do you handle events in React?',
        options: ['Using onclick attribute', 'Using onClick prop', 'Using addEventListener', 'Using event delegation only'],
        correct_option: 1
      },
      {
        video_id: 4,
        question: 'What is a variable in programming?',
        options: ['A fixed value', 'A container to store data', 'A function', 'A class'],
        correct_option: 1
      },
      {
        video_id: 4,
        question: 'What are the basic data types in Python?',
        options: ['String, Number, Object', 'int, float, str, bool, list', 'Array, Object, String', 'All of the above'],
        correct_option: 1
      },
      {
        video_id: 4,
        question: 'What is a loop used for?',
        options: ['To define functions', 'To repeat code multiple times', 'To create variables', 'To handle errors'],
        correct_option: 1
      },
      {
        video_id: 4,
        question: 'What is the difference between == and is in Python?',
        options: ['No difference', '== compares values, is compares identity', 'is compares values, == compares identity', 'Only == is valid'],
        correct_option: 1
      },
      {
        video_id: 4,
        question: 'What is indentation in Python?',
        options: ['Optional spacing', 'Required for code blocks', 'Only for comments', 'A style preference'],
        correct_option: 1
      },
      {
        video_id: 5,
        question: 'What is a data structure?',
        options: ['A function', 'A way to organize and store data', 'A variable type', 'A class definition'],
        correct_option: 1
      },
      {
        video_id: 5,
        question: 'What is the time complexity of linear search?',
        options: ['O(1)', 'O(n)', 'O(n²)', 'O(log n)'],
        correct_option: 1
      },
      {
        video_id: 5,
        question: 'What is the advantage of using a hash table?',
        options: ['Constant time lookup on average', 'Sorted data storage', 'Lower memory usage', 'Easy to implement'],
        correct_option: 0
      },
      {
        video_id: 5,
        question: 'What is a linked list?',
        options: ['An array with pointers', 'A list of connected nodes', 'A type of database', 'A sorting algorithm'],
        correct_option: 1
      },
      {
        video_id: 5,
        question: 'What is the benefit of using a stack?',
        options: ['Random access', 'LIFO (Last In First Out) ordering', 'Automatic sorting', 'Dynamic resizing'],
        correct_option: 1
      }
    ];

    // Insert all quizzes
    for (const quiz of quizzes) {
      const sql = `
        INSERT INTO video_quizzes (video_id, question, options, correct_option)
        VALUES (?, ?, ?, ?)
      `;
      
      await connection.execute(sql, [
        quiz.video_id,
        quiz.question,
        JSON.stringify(quiz.options),
        quiz.correct_option
      ]);
    }

    console.log(`✅ Successfully seeded ${quizzes.length} quiz questions!\n`);

    // Verify the seeding
    const [count] = await connection.execute('SELECT COUNT(*) as total FROM video_quizzes');
    console.log(`📊 Total quizzes now: ${count[0].total}`);

    // Show by video
    const [byVideo] = await connection.execute(
      'SELECT video_id, COUNT(*) as count FROM video_quizzes GROUP BY video_id ORDER BY video_id'
    );
    console.log('\n📝 Quizzes per video:');
    byVideo.forEach(row => {
      console.log(`  - Video ${row.video_id}: ${row.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

seedQuizzes();
