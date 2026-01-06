import mysql from 'mysql2/promise';

async function resetAndSeedQuizzes() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gnana@1972',
    database: 'learnix_db'
  });

  try {
    console.log('🗑️ Deleting all existing quizzes...\n');
    await connection.execute('DELETE FROM video_quizzes');
    console.log('✅ All quizzes deleted\n');

    // Get all videos
    const [videos] = await connection.execute('SELECT id, title FROM videos ORDER BY id');
    console.log(`📚 Found ${videos.length} videos. Adding 5 quizzes per video...\n`);

    const quizTemplates = {
      // Cybersecurity videos
      31: [
        {
          question: 'What is cybersecurity?',
          options: 'Protection of computer systems from attacks,Encryption of data,Firewalls only,Network monitoring',
          correct_option: 0
        },
        {
          question: 'What is a firewall?',
          options: 'A wall in a building,Software/hardware that filters network traffic,An antivirus program,A password manager',
          correct_option: 1
        },
        {
          question: 'What does encryption do?',
          options: 'Deletes data,Converts data into unreadable format,Backs up files,Compresses files',
          correct_option: 1
        },
        {
          question: 'What is a vulnerability?',
          options: 'A firewall setting,A weakness in a system that can be exploited,A type of malware,A password',
          correct_option: 1
        },
        {
          question: 'What should you do with a strong password?',
          options: 'Share it with trusted friends,Write it down,Never share it and use unique characters,Use same password everywhere',
          correct_option: 2
        }
      ],
      // Python videos
      1: [
        {
          question: 'What is Python used for?',
          options: 'Only web development,Data science and scripting,Only game development,Only mobile apps',
          correct_option: 1
        },
        {
          question: 'How do you create a function in Python?',
          options: 'function myFunc(),def myFunc(),func myFunc(),define myFunc()',
          correct_option: 1
        },
        {
          question: 'What does len() do in Python?',
          options: 'Returns length of a string or list,Creates a list,Deletes items,Sorts items',
          correct_option: 0
        },
        {
          question: 'How do you create a list in Python?',
          options: 'list = (1,2,3),list = [1,2,3],list = {1,2,3},list = <1,2,3>',
          correct_option: 1
        },
        {
          question: 'What is a loop used for?',
          options: 'Define a function,Repeat code multiple times,Create variables,Import modules',
          correct_option: 1
        }
      ],
      // React videos
      2: [
        {
          question: 'What does JSX stand for?',
          options: 'JavaScript XML,JavaScript Extension,Java Syntax,JavaScript Execution',
          correct_option: 0
        },
        {
          question: 'What is a React component?',
          options: 'A CSS file,A reusable piece of UI,A JavaScript library,A HTML file',
          correct_option: 1
        },
        {
          question: 'What is state in React?',
          options: 'CSS styling,Data that can change over time,Component props,HTML elements',
          correct_option: 1
        },
        {
          question: 'What hook is used to manage state?',
          options: 'useEffect,useState,useContext,useReducer',
          correct_option: 1
        },
        {
          question: 'What are props in React?',
          options: 'CSS properties,Data passed to components,State variables,Event handlers',
          correct_option: 1
        }
      ],
      // Machine Learning videos
      3: [
        {
          question: 'What is machine learning?',
          options: 'Teaching computers to learn from data,Manual programming only,Creating robots,Building websites',
          correct_option: 0
        },
        {
          question: 'What are the types of machine learning?',
          options: 'Frontend and Backend,Supervised and Unsupervised,Static and Dynamic,Input and Output',
          correct_option: 1
        },
        {
          question: 'What is training data?',
          options: 'Code files,Data used to teach the model,Test results,Documentation',
          correct_option: 1
        },
        {
          question: 'What is overfitting?',
          options: 'Model learns noise instead of patterns,Model is too simple,Model is fast,Model uses less data',
          correct_option: 0
        },
        {
          question: 'What is a feature in ML?',
          options: 'A bug,A software function,An input variable,An output',
          correct_option: 2
        }
      ]
    };

    let totalQuizzes = 0;

    // Add quizzes for each video
    for (const video of videos) {
      const videoId = video.id;
      const title = video.title;
      
      // Use template or default questions
      let quizzes = quizTemplates[videoId] || generateDefaultQuizzes(videoId);
      
      for (const quiz of quizzes) {
        const { question, options, correct_option } = quiz;
          const optionsJson = JSON.stringify(options.split(','));
        const sql = `
          INSERT INTO video_quizzes (video_id, question, options, correct_option, created_at)
          VALUES (?, ?, ?, ?, NOW())
        `;
        
          await connection.execute(sql, [videoId, question, optionsJson, correct_option]);
        totalQuizzes++;
      }
      
      console.log(`✅ Added 5 quizzes for video ${videoId}: ${title}`);
    }

    console.log(`\n🎉 Successfully added ${totalQuizzes} quizzes!\n`);
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

function generateDefaultQuizzes(videoId) {
  return [
    {
      question: `What is the main topic of video ${videoId}?`,
      options: 'Option A,Option B,Option C,Option D',
      correct_option: 0
    },
    {
      question: `What did you learn from video ${videoId}?`,
      options: 'First lesson,Second lesson,Third lesson,Fourth lesson',
      correct_option: 1
    },
    {
      question: `How would you apply knowledge from video ${videoId}?`,
      options: 'In projects,In documentation,In testing,In deployment',
      correct_option: 0
    },
    {
      question: `What is an example from video ${videoId}?`,
      options: 'Example 1,Example 2,Example 3,Example 4',
      correct_option: 2
    },
    {
      question: `What is the purpose of video ${videoId}?`,
      options: 'Teaching,Entertainment,Testing,Review',
      correct_option: 0
    }
  ];
}

resetAndSeedQuizzes();
