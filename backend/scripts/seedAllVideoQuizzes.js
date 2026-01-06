import mysql from 'mysql2/promise';

async function seedAllVideoQuizzes() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Gnana@1972',
    database: 'learnix_db'
  });

  try {
    console.log('🌱 Creating knowledge-check quizzes for ALL videos...\n');

    // Knowledge-check questions mapped by video ID
    // Format: { video_id, question, options: [a,b,c,d], correct_option: 0-3 }
    const allQuizzes = [
      // Video 1: Python
      { video_id: 1, question: 'What is Python best known for?', options: ['Web servers only', 'Data science, AI, and scripting', 'Game development exclusively', 'Mobile apps'], correct_option: 1 },
      { video_id: 1, question: 'Which is the correct Python syntax for a function?', options: ['def myFunc():', 'function myFunc()', 'func myFunc():', 'define myFunc()'], correct_option: 0 },
      { video_id: 1, question: 'What is PEP 8?', options: ['A Python library', 'Style guide for Python code', 'A data structure', 'A debugging tool'], correct_option: 1 },
      { video_id: 1, question: 'Which data type is immutable in Python?', options: ['List', 'Dictionary', 'Tuple', 'Set'], correct_option: 2 },
      { video_id: 1, question: 'What does "self" represent in a Python class?', options: ['The class name', 'The current instance of the class', 'The parent class', 'A reserved keyword'], correct_option: 1 },

      // Video 2: React JS - Full Course
      { video_id: 2, question: 'What does JSX stand for?', options: ['Java Syntax Extension', 'JavaScript XML', 'JSON Extra', 'JavaScript Execution'], correct_option: 1 },
      { video_id: 2, question: 'Which hook manages state in functional components?', options: ['useEffect', 'useState', 'useRef', 'useContext'], correct_option: 1 },
      { video_id: 2, question: 'What is the Virtual DOM?', options: ['A browser feature', 'In-memory representation of UI', 'A database', 'A CSS framework'], correct_option: 1 },
      { video_id: 2, question: 'How do you pass data to a child component?', options: ['Through context only', 'Through props', 'Through localStorage', 'Through cookies'], correct_option: 1 },
      { video_id: 2, question: 'What is React Fragment used for?', options: ['Creating fragments of code', 'Grouping elements without a wrapper', 'Styling elements', 'State management'], correct_option: 1 },

      // Video 3: React JS Crash Course
      { video_id: 3, question: 'What is a React component?', options: ['A database table', 'A reusable UI piece', 'A CSS class', 'A server'], correct_option: 1 },
      { video_id: 3, question: 'When does useEffect run by default?', options: ['Only on mount', 'After every render', 'Never', 'Only on unmount'], correct_option: 1 },
      { video_id: 3, question: 'What is the purpose of the dependency array in useEffect?', options: ['To manage state', 'To control when effect runs', 'To fetch data only', 'Optional parameter'], correct_option: 1 },
      { video_id: 3, question: 'Which is NOT a React hook?', options: ['useState', 'useCallback', 'useStyle', 'useContext'], correct_option: 2 },
      { video_id: 3, question: 'How do you handle events in React?', options: ['onclick attribute', 'onClick prop with camelCase', 'addEventListener', 'onEvent binding'], correct_option: 1 },

      // Video 4: Python for Beginners
      { video_id: 4, question: 'What is a variable?', options: ['A fixed value', 'A container to store data', 'A function', 'A class'], correct_option: 1 },
      { video_id: 4, question: 'Which is the correct way to create a list?', options: ['list = (1,2,3)', 'list = [1,2,3]', 'list = {1,2,3}', 'list = <1,2,3>'], correct_option: 1 },
      { video_id: 4, question: 'What is indentation used for in Python?', options: ['Comments', 'Code blocks and structure', 'Variable declaration', 'Function naming'], correct_option: 1 },
      { video_id: 4, question: 'Which loop repeats a block of code?', options: ['if loop', 'for loop', 'class loop', 'def loop'], correct_option: 1 },
      { video_id: 4, question: 'What does the range() function do?', options: ['Finds text', 'Generates sequence of numbers', 'Creates a list', 'Sorts data'], correct_option: 1 },

      // Video 5: Data Structures
      { video_id: 5, question: 'What is Big O notation used for?', options: ['Mathematical operations', 'Algorithm complexity analysis', 'Data formatting', 'Database queries'], correct_option: 1 },
      { video_id: 5, question: 'What is the time complexity of linear search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correct_option: 1 },
      { video_id: 5, question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correct_option: 1 },
      { video_id: 5, question: 'What is a linked list?', options: ['An array with links', 'Nodes connected with pointers', 'A sorted list', 'A tree structure'], correct_option: 1 },
      { video_id: 5, question: 'What advantage does a hash table provide?', options: ['Sorting', 'O(1) average lookup', 'Memory efficiency', 'Easy traversal'], correct_option: 1 },

      // Video 6: Algorithms
      { video_id: 6, question: 'What is a sorting algorithm?', options: ['A search method', 'Method to arrange data in order', 'A database query', 'A data type'], correct_option: 1 },
      { video_id: 6, question: 'Which sorting algorithm has O(n log n) average complexity?', options: ['Bubble sort', 'Merge sort', 'Insertion sort', 'Selection sort'], correct_option: 1 },
      { video_id: 6, question: 'What is a greedy algorithm?', options: ['Complex algorithm', 'Makes locally optimal choices', 'Recursive approach', 'Parallel algorithm'], correct_option: 1 },
      { video_id: 6, question: 'What is dynamic programming?', options: ['Fast programming', 'Solving by breaking into subproblems', 'Web programming', 'Real-time coding'], correct_option: 1 },
      { video_id: 6, question: 'What is graph traversal?', options: ['Drawing graphs', 'Visiting all nodes in a graph', 'Creating graphs', 'Sorting graphs'], correct_option: 1 },

      // Video 7: DevOps
      { video_id: 7, question: 'What is DevOps?', options: ['Development only', 'Integration of development and operations', 'Operations only', 'A programming language'], correct_option: 1 },
      { video_id: 7, question: 'What is CI/CD?', options: ['Computer Interface/Cloud Database', 'Continuous Integration/Continuous Deployment', 'Code Integration/Code Development', 'Cloud Infrastructure/Cloud Deployment'], correct_option: 1 },
      { video_id: 7, question: 'What does version control do?', options: ['Controls versions of software', 'Tracks changes in code', 'Manages deployment', 'Handles security'], correct_option: 1 },
      { video_id: 7, question: 'What is Infrastructure as Code (IaC)?', options: ['Coding servers', 'Managing infrastructure through code', 'Code that fixes bugs', 'Testing framework'], correct_option: 1 },
      { video_id: 7, question: 'What is the purpose of monitoring in DevOps?', options: ['Testing code', 'Tracking system performance', 'Security scanning', 'Backup creation'], correct_option: 1 },

      // Video 8: Docker + Kubernetes
      { video_id: 8, question: 'What is Docker?', options: ['A warehouse', 'Containerization platform', 'A database', 'A web server'], correct_option: 1 },
      { video_id: 8, question: 'What is a Docker container?', options: ['A storage box', 'Isolated environment for applications', 'A virtual machine', 'A hard drive'], correct_option: 1 },
      { video_id: 8, question: 'What is Kubernetes?', options: ['A programming language', 'Container orchestration platform', 'A web framework', 'A database'], correct_option: 1 },
      { video_id: 8, question: 'What is a Kubernetes pod?', options: ['A group of containers', 'Smallest deployable unit', 'A storage volume', 'A network'], correct_option: 1 },
      { video_id: 8, question: 'What does Kubernetes provide?', options: ['Storage only', 'Automatic deployment and scaling', 'Networking only', 'Security only'], correct_option: 1 },

      // Video 9: UI/UX Design
      { video_id: 9, question: 'What is the difference between UI and UX?', options: ['Same thing', 'UI is visual, UX is experience', 'UX is visual, UI is experience', 'No difference'], correct_option: 1 },
      { video_id: 9, question: 'What is user research?', options: ['Testing websites', 'Understanding user needs', 'Marketing strategy', 'Design software'], correct_option: 1 },
      { video_id: 9, question: 'What is wireframing?', options: ['Networking', 'Blueprint of layout', 'Final design', 'Programming'], correct_option: 1 },
      { video_id: 9, question: 'What is information architecture?', options: ['Building structures', 'Organizing content and structure', 'Web design', 'Coding structure'], correct_option: 1 },
      { video_id: 9, question: 'What is usability testing?', options: ['Testing code', 'Observing user interactions', 'Marketing test', 'Security test'], correct_option: 1 },

      // Video 10: Advanced UX
      { video_id: 10, question: 'What is accessibility in UX?', options: ['Affordable design', 'Usable by everyone', 'Easy to use', 'Beautiful design'], correct_option: 1 },
      { video_id: 10, question: 'What is a user persona?', options: ['A real user', 'Fictional representation of target user', 'A design style', 'A testing method'], correct_option: 1 },
      { video_id: 10, question: 'What is interaction design?', options: ['Social design', 'How users interact with products', 'Visual design', 'Product strategy'], correct_option: 1 },
      { video_id: 10, question: 'What is a design system?', options: ['Operating system', 'Reusable components and guidelines', 'Design software', 'Design school'], correct_option: 1 },
      { video_id: 10, question: 'What does WCAG stand for?', options: ['Web Content Access Guidelines', 'Web Content Accessibility Guidelines', 'Web Coding Access Guidelines', 'Web Component Archive Guidelines'], correct_option: 1 },

      // Video 11: Flutter
      { video_id: 11, question: 'What is Flutter?', options: ['A JavaScript framework', 'Mobile app development framework', 'A design tool', 'A database'], correct_option: 1 },
      { video_id: 11, question: 'What language does Flutter use?', options: ['Java', 'Kotlin', 'Dart', 'Python'], correct_option: 2 },
      { video_id: 11, question: 'What is a Widget in Flutter?', options: ['A tool', 'Building block of UI', 'A library', 'A database'], correct_option: 1 },
      { video_id: 11, question: 'What is hot reload in Flutter?', options: ['Temperature control', 'See changes instantly', 'Restart app', 'Bug fix'], correct_option: 1 },
      { video_id: 11, question: 'Can Flutter create cross-platform apps?', options: ['Only Android', 'Only iOS', 'Android and iOS both', 'Web only'], correct_option: 2 },

      // Video 12: React Native
      { video_id: 12, question: 'What is React Native?', options: ['A design framework', 'Mobile app framework using React', 'A database', 'A native language'], correct_option: 1 },
      { video_id: 12, question: 'What language does React Native use?', options: ['Java', 'Python', 'JavaScript', 'C++'], correct_option: 2 },
      { video_id: 12, question: 'What is a React Native component?', options: ['A design element', 'Reusable UI piece', 'A style', 'A function'], correct_option: 1 },
      { video_id: 12, question: 'What is the React Native Bridge?', options: ['A network', 'Connects JS and native code', 'A library', 'A tool'], correct_option: 1 },
      { video_id: 12, question: 'Can React Native run on both Android and iOS?', options: ['Android only', 'iOS only', 'Both platforms', 'Neither'], correct_option: 2 },

      // Video 13: DBMS
      { video_id: 13, question: 'What is a database?', options: ['A folder', 'Organized collection of data', 'A file', 'A server'], correct_option: 1 },
      { video_id: 13, question: 'What is SQL?', options: ['A language', 'Structured Query Language', 'A database', 'A server'], correct_option: 1 },
      { video_id: 13, question: 'What is a table in a database?', options: ['Furniture', 'Structured data collection', 'A spreadsheet', 'A report'], correct_option: 1 },
      { video_id: 13, question: 'What is a primary key?', options: ['A password', 'Unique identifier for a row', 'A column name', 'A constraint'], correct_option: 1 },
      { video_id: 13, question: 'What are ACID properties?', options: ['Chemical properties', 'Database transaction guarantees', 'Data types', 'Query operations'], correct_option: 1 },

      // Video 14: Advanced Database Design
      { video_id: 14, question: 'What is database normalization?', options: ['Making databases normal', 'Organizing data to reduce redundancy', 'Backup process', 'Security measure'], correct_option: 1 },
      { video_id: 14, question: 'What is the First Normal Form (1NF)?', options: ['No primary key', 'Atomic values only', 'No foreign keys', 'Indexed tables'], correct_option: 1 },
      { video_id: 14, question: 'What is an index?', options: ['A table of contents', 'Structure to speed up queries', 'A column name', 'A data type'], correct_option: 1 },
      { video_id: 14, question: 'What is a foreign key?', options: ['A backup key', 'Reference to primary key in another table', 'An encryption key', 'A unique key'], correct_option: 1 },
      { video_id: 14, question: 'What does query optimization do?', options: ['Makes queries pretty', 'Improves query performance', 'Fixes bugs', 'Secures data'], correct_option: 1 },

      // Video 15: Machine Learning Basics
      { video_id: 15, question: 'What is Machine Learning?', options: ['Machines learning to read', 'Systems learning from data', 'Computer science', 'Programming'], correct_option: 1 },
      { video_id: 15, question: 'What are the types of ML?', options: ['Fast and slow', 'Supervised, Unsupervised, Reinforcement', 'Online and offline', 'Simple and complex'], correct_option: 1 },
      { video_id: 15, question: 'What is supervised learning?', options: ['Learning with supervision', 'Learning from labeled data', 'Learning with rules', 'Learning without data'], correct_option: 1 },
      { video_id: 15, question: 'What is a training dataset?', options: ['Data for testing', 'Data for model learning', 'Data for validation', 'All data'], correct_option: 1 },
      { video_id: 15, question: 'What is overfitting?', options: ['Too much data', 'Model memorizes data instead of learning', 'Underfitting', 'Good fit'], correct_option: 1 },

      // Video 16: ML Algorithms
      { video_id: 16, question: 'What is regression?', options: ['Going backward', 'Predicting continuous values', 'Classification', 'Clustering'], correct_option: 1 },
      { video_id: 16, question: 'What is linear regression?', options: ['Regression in a line', 'Finding linear relationship', 'Multiple variables', 'Non-linear'], correct_option: 1 },
      { video_id: 16, question: 'What is logistic regression used for?', options: ['Continuous prediction', 'Binary classification', 'Clustering', 'Dimensionality reduction'], correct_option: 1 },
      { video_id: 16, question: 'What is decision tree?', options: ['A real tree', 'Tree structure for decisions', 'A graph', 'A network'], correct_option: 1 },
      { video_id: 16, question: 'What is Random Forest?', options: ['A real forest', 'Ensemble of decision trees', 'A single tree', 'A clustering algorithm'], correct_option: 1 },

      // Video 17: jQuery Basics
      { video_id: 17, question: 'What is jQuery?', options: ['A query tool', 'JavaScript library for DOM manipulation', 'A database', 'A server'], correct_option: 1 },
      { video_id: 17, question: 'What is the jQuery selector?', options: ['Selects files', 'Selects HTML elements', 'Selects functions', 'Selects variables'], correct_option: 1 },
      { video_id: 17, question: 'How do you select element with ID in jQuery?', options: ['$(".id")', '$("#id")', '$("[id]")', '$(id)'], correct_option: 1 },
      { video_id: 17, question: 'What does .html() do in jQuery?', options: ['Create HTML', 'Get/set HTML content', 'Style elements', 'Hide elements'], correct_option: 1 },
      { video_id: 17, question: 'What is event handling in jQuery?', options: ['Handling events', 'Responding to user interactions', 'Creating events', 'Storing events'], correct_option: 1 },

      // Video 18: jQuery Advanced
      { video_id: 18, question: 'What is jQuery animation?', options: ['Creating movies', 'Smooth visual effects', 'Image processing', 'Video handling'], correct_option: 1 },
      { video_id: 18, question: 'What does .animate() do?', options: ['Creates animations', 'Changes CSS smoothly', 'Shows elements', 'Hides elements'], correct_option: 1 },
      { video_id: 18, question: 'What is jQuery AJAX?', options: ['A tool', 'Asynchronous data loading', 'Synchronous loading', 'Error handling'], correct_option: 1 },
      { video_id: 18, question: 'What does .load() do in jQuery?', options: ['Loads pages', 'Loads content into element', 'Loads images', 'Loads scripts'], correct_option: 1 },
      { video_id: 18, question: 'What is chaining in jQuery?', options: ['Linking elements', 'Multiple methods on same object', 'Creating chains', 'Connecting data'], correct_option: 1 },

      // Video 19: Backend Development
      { video_id: 19, question: 'What is backend development?', options: ['Design of websites', 'Server-side application development', 'Client-side coding', 'UI design'], correct_option: 1 },
      { video_id: 19, question: 'What is a server?', options: ['A computer', 'Computer that handles requests', 'A database', 'A client'], correct_option: 1 },
      { video_id: 19, question: 'What is an API?', options: ['A tool', 'Interface for applications to communicate', 'A server', 'A database'], correct_option: 1 },
      { video_id: 19, question: 'What does REST mean?', options: ['Relaxing', 'Representational State Transfer', 'Web protocol', 'API style'], correct_option: 1 },
      { video_id: 19, question: 'What is authentication?', options: ['Authorization', 'Verifying user identity', 'Permission checking', 'Security protocol'], correct_option: 1 },

      // Video 20: Scalable Backend
      { video_id: 20, question: 'What is scalability?', options: ['Size of application', 'Ability to handle growth', 'Speed', 'Security'], correct_option: 1 },
      { video_id: 20, question: 'What is caching?', options: ['Storing data', 'Fast data retrieval', 'Memory management', 'Database backup'], correct_option: 1 },
      { video_id: 20, question: 'What is load balancing?', options: ['Balancing weights', 'Distributing requests', 'Managing databases', 'Handling errors'], correct_option: 1 },
      { video_id: 20, question: 'What is database sharding?', options: ['Breaking database into pieces', 'Partitioning data', 'Backup method', 'Encryption'], correct_option: 1 },
      { video_id: 20, question: 'What is microservices?', options: ['Small services', 'Architecture of independent services', 'Single service', 'Monolithic app'], correct_option: 1 },

      // Video 21: JavaScript Basics
      { video_id: 21, question: 'What is JavaScript?', options: ['Java language', 'Programming language for web', 'Scripting for servers', 'Database language'], correct_option: 1 },
      { video_id: 21, question: 'What are variables in JavaScript?', options: ['Fixed values', 'Containers for data', 'Functions', 'Objects'], correct_option: 1 },
      { video_id: 21, question: 'What is the difference between var, let, const?', options: ['Same thing', 'Different scopes and reassignment rules', 'Just naming', 'Performance differences'], correct_option: 1 },
      { video_id: 21, question: 'What is a JavaScript function?', options: ['A variable', 'Reusable block of code', 'A constant', 'An operator'], correct_option: 1 },
      { video_id: 21, question: 'What is the DOM?', options: ['Database Object Model', 'Document Object Model', 'Developer Operations', 'Data Organization Model'], correct_option: 1 },

      // Video 22: Advanced JavaScript
      { video_id: 22, question: 'What are closures in JavaScript?', options: ['Closed functions', 'Functions with access to outer scope', 'Nested functions', 'Anonymous functions'], correct_option: 1 },
      { video_id: 22, question: 'What is the event loop?', options: ['Looping events', 'Mechanism for executing callbacks', 'Event handler', 'Loop in events'], correct_option: 1 },
      { video_id: 22, question: 'What is async/await?', options: ['Asynchronous functions', 'Modern promise handling', 'Callbacks', 'Error handling'], correct_option: 1 },
      { video_id: 22, question: 'What is prototype in JavaScript?', options: ['Original', 'Object inheritance mechanism', 'A function', 'A variable type'], correct_option: 1 },
      { video_id: 22, question: 'What is this in JavaScript?', options: ['Current object', 'Context of execution', 'A variable', 'A function'], correct_option: 1 },

      // Video 23: Software Testing
      { video_id: 23, question: 'What is software testing?', options: ['Using software', 'Verifying software quality', 'Coding software', 'Deploying software'], correct_option: 1 },
      { video_id: 23, question: 'What is unit testing?', options: ['Testing entire app', 'Testing individual components', 'Testing servers', 'Testing databases'], correct_option: 1 },
      { video_id: 23, question: 'What is integration testing?', options: ['Testing units', 'Testing combined components', 'Testing interfaces', 'Testing code'], correct_option: 1 },
      { video_id: 23, question: 'What is a test case?', options: ['A case with tests', 'Set of conditions to test', 'Test file', 'Testing tool'], correct_option: 1 },
      { video_id: 23, question: 'What is regression testing?', options: ['Going backward', 'Testing after changes', 'Initial testing', 'Random testing'], correct_option: 1 },

      // Video 24: Advanced QA Testing
      { video_id: 24, question: 'What is automation testing?', options: ['Automatic', 'Using tools to automate tests', 'Manual testing', 'Real users'], correct_option: 1 },
      { video_id: 24, question: 'What is performance testing?', options: ['Testing excellence', 'Testing speed and efficiency', 'Load testing', 'Stress testing'], correct_option: 1 },
      { video_id: 24, question: 'What is penetration testing?', options: ['Entering data', 'Testing security vulnerabilities', 'Load testing', 'Performance testing'], correct_option: 1 },
      { video_id: 24, question: 'What is usability testing?', options: ['Testing usefulness', 'Testing user experience', 'Interface testing', 'Functionality testing'], correct_option: 1 },
      { video_id: 24, question: 'What is a test suite?', options: ['A room', 'Collection of test cases', 'Testing tool', 'Testing method'], correct_option: 1 },

      // Video 25: Java Basics
      { video_id: 25, question: 'What is Java?', options: ['A coffee', 'Object-oriented programming language', 'JavaScript', 'A framework'], correct_option: 1 },
      { video_id: 25, question: 'What is the JVM?', options: ['Java Virtual Machine', 'Virtual environment for Java', 'Java compiler', 'Java debugger'], correct_option: 1 },
      { video_id: 25, question: 'What is a Java class?', options: ['A classroom', 'Blueprint for objects', 'A method', 'A variable'], correct_option: 1 },
      { video_id: 25, question: 'What is an object in Java?', options: ['A thing', 'Instance of a class', 'A method', 'A variable'], correct_option: 1 },
      { video_id: 25, question: 'What are primitive data types in Java?', options: ['Complex types', 'int, double, boolean, char', 'String, List', 'All types'], correct_option: 1 },

      // Video 26: Java OOP
      { video_id: 26, question: 'What is inheritance in OOP?', options: ['Getting money', 'Deriving from existing class', 'Creating objects', 'Encapsulation'], correct_option: 1 },
      { video_id: 26, question: 'What is polymorphism?', options: ['Many shapes', 'Many forms of methods', 'Multiple inheritance', 'Method overloading only'], correct_option: 1 },
      { video_id: 26, question: 'What is encapsulation?', options: ['Wrapping in envelope', 'Bundling data and methods', 'Hiding code', 'Data protection'], correct_option: 1 },
      { video_id: 26, question: 'What is abstraction?', options: ['Abstract thinking', 'Hiding complexity', 'Creating interfaces', 'Simplifying code'], correct_option: 1 },
      { video_id: 26, question: 'What is a design pattern?', options: ['A pattern for design', 'Reusable solution to problems', 'Code style', 'Architecture'], correct_option: 1 },

      // Video 27: Angular Basics
      { video_id: 27, question: 'What is Angular?', options: ['An angle', 'TypeScript-based framework', 'A library', 'A tool'], correct_option: 1 },
      { video_id: 27, question: 'What is TypeScript?', options: ['Type of script', 'JavaScript with types', 'Typing tool', 'Type language'], correct_option: 1 },
      { video_id: 27, question: 'What is a component in Angular?', options: ['A part', 'Basic building block', 'A service', 'A module'], correct_option: 1 },
      { video_id: 27, question: 'What is dependency injection?', options: ['Injecting dependencies', 'Providing required dependencies', 'Managing modules', 'Importing files'], correct_option: 1 },
      { video_id: 27, question: 'What is data binding in Angular?', options: ['Binding data', 'Synchronizing between view and component', 'Connecting services', 'Linking modules'], correct_option: 1 },

      // Video 28: Advanced Angular
      { video_id: 28, question: 'What is RxJS?', options: ['A library', 'Reactive extensions for JavaScript', 'A framework', 'A tool'], correct_option: 1 },
      { video_id: 28, question: 'What is an Observable?', options: ['Something observable', 'Stream of asynchronous data', 'A variable', 'A function'], correct_option: 1 },
      { video_id: 28, question: 'What is lazy loading?', options: ['Slow loading', 'Loading on demand', 'Fast loading', 'Preloading'], correct_option: 1 },
      { video_id: 28, question: 'What is change detection?', options: ['Detecting changes', 'Tracking component changes', 'Comparing objects', 'Updating view'], correct_option: 1 },
      { video_id: 28, question: 'What is a service in Angular?', options: ['Customer service', 'Reusable business logic', 'Component', 'Module'], correct_option: 1 },

      // Video 29: Cloud Computing
      { video_id: 29, question: 'What is cloud computing?', options: ['Computing in clouds', 'On-demand computing services', 'Internet services', 'Remote servers'], correct_option: 1 },
      { video_id: 29, question: 'What are cloud providers?', options: ['People providing clouds', 'AWS, Azure, GCP', 'ISPs', 'Hosting companies'], correct_option: 1 },
      { video_id: 29, question: 'What is IaaS?', options: ['Internet as Service', 'Infrastructure as Service', 'Information as Service', 'Integration as Service'], correct_option: 1 },
      { video_id: 29, question: 'What is PaaS?', options: ['Path', 'Platform as Service', 'Program as Service', 'Package as Service'], correct_option: 1 },
      { video_id: 29, question: 'What is SaaS?', options: ['Safe', 'Software as Service', 'Server as Service', 'Storage as Service'], correct_option: 1 },

      // Video 30: Cloud Architecture
      { video_id: 30, question: 'What is cloud architecture?', options: ['Building clouds', 'Design of cloud systems', 'Cloud infrastructure', 'Cloud services'], correct_option: 1 },
      { video_id: 30, question: 'What is availability zone?', options: ['A zone', 'Isolated data center', 'Region', 'Server location'], correct_option: 1 },
      { video_id: 30, question: 'What is auto-scaling?', options: ['Automatic sizing', 'Adjusting resources based on demand', 'Manual scaling', 'Downsizing'], correct_option: 1 },
      { video_id: 30, question: 'What is CDN?', options: ['Content Distribution Network', 'Centralized Data Network', 'Cloud Delivery Network', 'Computing Distribution Node'], correct_option: 0 },
      { video_id: 30, question: 'What is cloud security?', options: ['Securing clouds', 'Protecting cloud resources', 'Network security', 'Data encryption'], correct_option: 1 },

      // Video 31: Cybersecurity
      { video_id: 31, question: 'What is cybersecurity?', options: ['Security of computers', 'Protection from digital attacks', 'Network security', 'Firewalls'], correct_option: 1 },
      { video_id: 31, question: 'What is encryption?', options: ['Encoding data', 'Converting data to secure form', 'Securing networks', 'Protecting passwords'], correct_option: 1 },
      { video_id: 31, question: 'What is a firewall?', options: ['A wall', 'System to filter traffic', 'Security software', 'Encryption tool'], correct_option: 1 },
      { video_id: 31, question: 'What is SSL/TLS?', options: ['Secure Socket Layer/Transport Layer Security', 'Server Side Language', 'Secure Software Library', 'System Testing Language'], correct_option: 0 },
      { video_id: 31, question: 'What is a vulnerability?', options: ['A weak point', 'Security weakness', 'Bug', 'Error'], correct_option: 1 },

      // Video 32: Network Security
      { video_id: 32, question: 'What is network security?', options: ['Securing networks', 'Protecting network infrastructure', 'Firewalls', 'Encryption'], correct_option: 1 },
      { video_id: 32, question: 'What is penetration testing?', options: ['Entering networks', 'Simulating attacks to test security', 'Hacking', 'Security audit'], correct_option: 1 },
      { video_id: 32, question: 'What is DDoS attack?', options: ['Data Denial Service', 'Distributed Denial of Service', 'Direct Denial Service', 'Database Denial Service'], correct_option: 1 },
      { video_id: 32, question: 'What is VPN?', options: ['Very Private Network', 'Virtual Private Network', 'Virtual Public Network', 'Visible Private Network'], correct_option: 1 },
      { video_id: 32, question: 'What is a proxy server?', options: ['A server', 'Intermediary server', 'Web server', 'Backup server'], correct_option: 1 },

      // Video 33: Software Engineering
      { video_id: 33, question: 'What is SDLC?', options: ['Software Development Lifecycle', 'System Design Language', 'Software Design Code', 'System Development Language'], correct_option: 0 },
      { video_id: 33, question: 'What is requirement gathering?', options: ['Gathering requirements', 'Understanding project needs', 'Collecting data', 'Planning phase'], correct_option: 1 },
      { video_id: 33, question: 'What is design phase?', options: ['Designing UI', 'Planning system architecture', 'Implementation', 'Testing phase'], correct_option: 1 },
      { video_id: 33, question: 'What is deployment?', options: ['Removing software', 'Releasing software to production', 'Installing software', 'Testing software'], correct_option: 1 },
      { video_id: 33, question: 'What is maintenance?', options: ['Fixing hardware', 'Ongoing support after deployment', 'Updates', 'Upgrades'], correct_option: 1 },

      // Video 34: Agile Development
      { video_id: 34, question: 'What is Agile?', options: ['Quick', 'Iterative development methodology', 'Framework', 'Process'], correct_option: 1 },
      { video_id: 34, question: 'What is a Sprint?', options: ['Running', 'Fixed time period for development', 'Phase', 'Release'], correct_option: 1 },
      { video_id: 34, question: 'What is a user story?', options: ['A story', 'Feature described from user perspective', 'Requirements', 'Specification'], correct_option: 1 },
      { video_id: 34, question: 'What is a scrum master?', options: ['A master', 'Facilitates agile process', 'Project manager', 'Team lead'], correct_option: 1 },
      { video_id: 34, question: 'What is continuous improvement?', options: ['Always improving', 'Regular process enhancement', 'Debugging', 'Version updates'], correct_option: 1 },

      // Video 35: C Programming
      { video_id: 35, question: 'What is C language?', options: ['A letter', 'Low-level programming language', 'High-level language', 'Scripting language'], correct_option: 1 },
      { video_id: 35, question: 'What is a pointer in C?', options: ['A point', 'Variable storing memory address', 'Variable', 'Data type'], correct_option: 1 },
      { video_id: 35, question: 'What is memory management in C?', options: ['Managing computers', 'Manual allocation and deallocation', 'Automatic', 'OS-handled'], correct_option: 1 },
      { video_id: 35, question: 'What is a struct in C?', options: ['Structure', 'User-defined composite data type', 'Function', 'Variable'], correct_option: 1 },
      { video_id: 35, question: 'What is the main() function?', options: ['Importance', 'Entry point of program', 'Main program', 'Required function'], correct_option: 1 },

      // Video 36: Advanced C
      { video_id: 36, question: 'What is pointer arithmetic?', options: ['Math with pointers', 'Operations on pointers', 'Calculation', 'Logic'], correct_option: 1 },
      { video_id: 36, question: 'What is dynamic memory allocation?', options: ['Allocating memory', 'Runtime memory allocation', 'Static allocation', 'Stack allocation'], correct_option: 1 },
      { video_id: 36, question: 'What is malloc()?', options: ['Making arrays', 'Memory allocation function', 'Memory free', 'Memory check'], correct_option: 1 },
      { video_id: 36, question: 'What is free()?', options: ['Making free', 'Deallocate memory', 'Allocate memory', 'Check memory'], correct_option: 1 },
      { video_id: 36, question: 'What is segmentation fault?', options: ['A fault', 'Memory access violation', 'Compilation error', 'Syntax error'], correct_option: 1 },

      // Video 37: Digital Logic
      { video_id: 37, question: 'What is digital logic?', options: ['Logic that is digital', 'Study of binary logic circuits', 'Programming logic', 'Mathematical logic'], correct_option: 1 },
      { video_id: 37, question: 'What is a logic gate?', options: ['A physical gate', 'Basic electronic circuit', 'Circuit element', 'Switch'], correct_option: 1 },
      { video_id: 37, question: 'What is AND gate?', options: ['A gate', 'Gate with both inputs high outputs high', 'Output gate', 'Input gate'], correct_option: 1 },
      { video_id: 37, question: 'What is OR gate?', options: ['A gate', 'If any input high then output high', 'AND gate', 'NOT gate'], correct_option: 1 },
      { video_id: 37, question: 'What is boolean algebra?', options: ['Algebra by bool', 'Algebra of binary variables', 'Mathematical algebra', 'Number system'], correct_option: 1 },

      // Video 38: Computer Organization
      { video_id: 38, question: 'What is computer architecture?', options: ['Building computers', 'Design of computer systems', 'Organization', 'Structure'], correct_option: 1 },
      { video_id: 38, question: 'What is CPU?', options: ['Computer Processing Unit', 'Central Processing Unit', 'Central Program Unit', 'Computer Program Utility'], correct_option: 1 },
      { video_id: 38, question: 'What is memory hierarchy?', options: ['Hierarchical memory', 'Levels of memory from fast to slow', 'Memory organization', 'Cache levels'], correct_option: 1 },
      { video_id: 38, question: 'What is cache?', options: ['Money', 'Fast temporary memory', 'Storage', 'RAM'], correct_option: 1 },
      { video_id: 38, question: 'What is pipelining?', options: ['Pipes', 'Executing multiple instructions', 'Parallel processing', 'Serial processing'], correct_option: 1 },
    ];

    // Clear existing quizzes
    await connection.execute('DELETE FROM video_quizzes');
    console.log('🗑️  Cleared existing quizzes\n');

    // Insert all quizzes
    let count = 0;
    for (const quiz of allQuizzes) {
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
      count++;
    }

    console.log(`✅ Successfully seeded ${count} knowledge-check questions!\n`);

    // Verify the seeding
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM video_quizzes');
    console.log(`📊 Total quizzes now: ${countResult[0].total}`);

    // Show by video
    const [byVideo] = await connection.execute(
      'SELECT video_id, COUNT(*) as count FROM video_quizzes GROUP BY video_id ORDER BY video_id'
    );
    console.log('\n📝 Knowledge-check questions per video:');
    byVideo.forEach(row => {
      console.log(`  - Video ${row.video_id}: ${row.count} questions`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

seedAllVideoQuizzes();
