import dotenv from "dotenv";
import db from "../config/db.js";

dotenv.config();

// Course-specific question templates
const courseQuestions = {
  python: [
    { q: "What is the correct way to create a list in Python?", opts: ["[1, 2, 3]", "(1, 2, 3)", "{1, 2, 3}", "list(1,2,3)"], correct: "[1, 2, 3]" },
    { q: "Which keyword is used to define a function in Python?", opts: ["function", "def", "define", "func"], correct: "def" },
    { q: "What does the len() function do in Python?", opts: ["Deletes items", "Returns length", "Splits strings", "Merges lists"], correct: "Returns length" },
    { q: "How do you create a dictionary in Python?", opts: ["{}", "[]", "()", "dict()"], correct: "{}" },
    { q: "Which of these is a mutable data type in Python?", opts: ["String", "Tuple", "List", "Integer"], correct: "List" },
    { q: "What is the output of 5 // 2 in Python?", opts: ["2.5", "2", "3", "Error"], correct: "2" },
    { q: "Which method adds an element to a list?", opts: ["add()", "insert()", "append()", "push()"], correct: "append()" },
    { q: "How do you comment code in Python?", opts: ["//", "#", "/*", "--"], correct: "#" },
    { q: "What is a lambda function in Python?", opts: ["Class", "Anonymous function", "Loop", "Module"], correct: "Anonymous function" },
    { q: "Which library is used for data analysis in Python?", opts: ["Django", "NumPy", "Flask", "Pandas"], correct: "Pandas" }
  ],
  react: [
    { q: "What is React?", opts: ["Backend framework", "JavaScript library", "Database", "CSS preprocessor"], correct: "JavaScript library" },
    { q: "What does JSX stand for?", opts: ["JavaScript Extended", "JavaScript XML", "Java Syntax", "JSON Extra"], correct: "JavaScript XML" },
    { q: "How do you pass data to a component in React?", opts: ["Variables", "Props", "State", "Refs"], correct: "Props" },
    { q: "What is the purpose of state in React?", opts: ["CSS styling", "Storing dynamic data", "HTML structure", "Component imports"], correct: "Storing dynamic data" },
    { q: "Which hook is used for side effects in React?", opts: ["useState", "useEffect", "useContext", "useReducer"], correct: "useEffect" },
    { q: "How do you handle events in React?", opts: ["onclick=", "onClick=", "on-click=", "Onclick="], correct: "onClick=" },
    { q: "What is a React component?", opts: ["CSS class", "HTML element", "Reusable UI piece", "Database table"], correct: "Reusable UI piece" },
    { q: "What is the virtual DOM in React?", opts: ["Browser memory", "In-memory representation", "Server storage", "Cache"], correct: "In-memory representation" },
    { q: "Which method is called when component mounts?", opts: ["componentWillUnmount", "componentDidMount", "render", "constructor"], correct: "componentDidMount" },
    { q: "What is Redux used for?", opts: ["Routing", "State management", "Styling", "Animation"], correct: "State management" }
  ],
  javascript: [
    { q: "What is JavaScript?", opts: ["Programming language", "Markup language", "Styling language", "Database"], correct: "Programming language" },
    { q: "How do you declare a variable in modern JavaScript?", opts: ["var x", "let x", "const x", "All of above"], correct: "All of above" },
    { q: "What is the difference between let and const?", opts: ["No difference", "const is immutable", "let is immutable", "Both are same"], correct: "const is immutable" },
    { q: "What does async/await do?", opts: ["Nothing", "Handles promises", "Creates loops", "Declares variables"], correct: "Handles promises" },
    { q: "What is a closure in JavaScript?", opts: ["Loop", "Function scope", "Object", "Class"], correct: "Function scope" },
    { q: "What does the spread operator (...) do?", opts: ["Nothing", "Spreads array elements", "Creates objects", "Declares functions"], correct: "Spreads array elements" },
    { q: "What is an arrow function?", opts: ["HTML element", "Concise function syntax", "Loop", "Variable"], correct: "Concise function syntax" },
    { q: "What is a Promise in JavaScript?", opts: ["String", "Object representing eventual completion", "Array", "Function"], correct: "Object representing eventual completion" },
    { q: "How do you handle errors in JavaScript?", opts: ["try-catch", "if-else", "switch", "for loop"], correct: "try-catch" },
    { q: "What is destructuring in JavaScript?", opts: ["Removing code", "Unpacking values", "Creating objects", "Loops"], correct: "Unpacking values" }
  ],
  "data structures": [
    { q: "What is a data structure?", opts: ["Programming language", "Way to organize data", "Database", "Algorithm"], correct: "Way to organize data" },
    { q: "What is a stack?", opts: ["FIFO structure", "LIFO structure", "Tree", "Graph"], correct: "LIFO structure" },
    { q: "What is a queue?", opts: ["LIFO structure", "FIFO structure", "Tree", "Hash table"], correct: "FIFO structure" },
    { q: "Time complexity of binary search is:", opts: ["O(n)", "O(n²)", "O(log n)", "O(1)"], correct: "O(log n)" },
    { q: "Which is best for searching in sorted array?", opts: ["Linear search", "Binary search", "Hash search", "Jump search"], correct: "Binary search" },
    { q: "What is a linked list?", opts: ["Array with pointers", "List of links", "Tree structure", "None"], correct: "Array with pointers" },
    { q: "Time complexity of inserting in hash table:", opts: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correct: "O(1)" },
    { q: "What is a tree data structure?", opts: ["Hierarchy of nodes", "List of elements", "Graph", "Array"], correct: "Hierarchy of nodes" },
    { q: "What is an AVL tree?", opts: ["Binary tree", "Self-balancing BST", "Hash table", "List"], correct: "Self-balancing BST" },
    { q: "What is graph traversal?", opts: ["Printing graph", "Visiting all nodes", "Drawing graph", "Creating graph"], correct: "Visiting all nodes" }
  ],
  devops: [
    { q: "What is DevOps?", opts: ["Development only", "Operations only", "Development + Operations", "Database"], correct: "Development + Operations" },
    { q: "What does CI/CD stand for?", opts: ["Continuous Integration/Delivery", "Code Integration/Deploy", "Continuous Install/Dev", "None"], correct: "Continuous Integration/Delivery" },
    { q: "What is Docker?", opts: ["Cloud service", "Containerization platform", "Database", "Programming language"], correct: "Containerization platform" },
    { q: "What is Kubernetes?", opts: ["Language", "Database", "Orchestration platform", "Framework"], correct: "Orchestration platform" },
    { q: "What does Git do?", opts: ["Creates databases", "Version control", "Runs servers", "Compiles code"], correct: "Version control" },
    { q: "What is Jenkins?", opts: ["Programming language", "Automation server", "Database", "Framework"], correct: "Automation server" },
    { q: "What is Infrastructure as Code?", opts: ["Managing via GUI", "Managing via code", "Manual setup", "None"], correct: "Managing via code" },
    { q: "What does monitoring do in DevOps?", opts: ["Tracks performance", "Writes code", "Designs UI", "None"], correct: "Tracks performance" },
    { q: "What is a deployment pipeline?", opts: ["Water pipe", "Build to production", "Code editor", "Database"], correct: "Build to production" },
    { q: "What is logging in DevOps?", opts: ["Cutting trees", "Recording events", "Writing code", "None"], correct: "Recording events" }
  ],
  docker: [
    { q: "What is a Docker image?", opts: ["Picture file", "Blueprint for container", "Video file", "None"], correct: "Blueprint for container" },
    { q: "What is a Docker container?", opts: ["Box", "Running instance of image", "Virtual machine", "Server"], correct: "Running instance of image" },
    { q: "What is Dockerfile?", opts: ["Text document", "Configuration file", "Recipe for image", "Code file"], correct: "Recipe for image" },
    { q: "What is Docker Compose?", opts: ["Software", "Tool for multi-container", "Language", "Framework"], correct: "Tool for multi-container" },
    { q: "What command runs a container?", opts: ["docker build", "docker run", "docker start", "docker create"], correct: "docker run" },
    { q: "What does docker pull do?", opts: ["Creates image", "Downloads image", "Runs container", "Deletes image"], correct: "Downloads image" },
    { q: "What is a Docker volume?", opts: ["Sound system", "Data storage", "Network", "CPU"], correct: "Data storage" },
    { q: "What is Docker registry?", opts: ["Register users", "Image repository", "Database", "Server"], correct: "Image repository" },
    { q: "What is Docker Hub?", opts: ["Public registry", "Social network", "Database", "Payment system"], correct: "Public registry" },
    { q: "What is containerization?", opts: ["Packing", "Isolation method", "Shipping", "Storage"], correct: "Isolation method" }
  ],
  kubernetes: [
    { q: "What is Kubernetes?", opts: ["Language", "Container orchestration", "Database", "Framework"], correct: "Container orchestration" },
    { q: "What is a Pod in Kubernetes?", opts: ["Container", "Smallest deployable unit", "Node", "Cluster"], correct: "Smallest deployable unit" },
    { q: "What is a Deployment in K8s?", opts: ["Ship", "Managing Pod replicas", "Container", "Node"], correct: "Managing Pod replicas" },
    { q: "What is a Service in K8s?", opts: ["Help desk", "Network abstraction", "Pod", "Node"], correct: "Network abstraction" },
    { q: "What is a Namespace in K8s?", opts: ["Name", "Virtual cluster", "Pod", "Node"], correct: "Virtual cluster" },
    { q: "What is kubectl?", opts: ["Language", "K8s command tool", "Database", "Framework"], correct: "K8s command tool" },
    { q: "What is Node in K8s?", opts: ["Data structure", "Machine in cluster", "Container", "Pod"], correct: "Machine in cluster" },
    { q: "What is Ingress in K8s?", opts: ["Entry point", "HTTP routing", "Pod", "Container"], correct: "HTTP routing" },
    { q: "What is ConfigMap?", opts: ["Map data", "Store configs", "Container", "Node"], correct: "Store configs" },
    { q: "What is StatefulSet?", opts: ["Deployment", "Stateful applications", "Pod", "Service"], correct: "Stateful applications" }
  ],
  aws: [
    { q: "What is AWS?", opts: ["Company", "Cloud platform", "Programming language", "Database"], correct: "Cloud platform" },
    { q: "What is EC2?", opts: ["Database", "Compute service", "Storage", "Network"], correct: "Compute service" },
    { q: "What is S3?", opts: ["Database", "Storage service", "Compute", "Network"], correct: "Storage service" },
    { q: "What is RDS?", opts: ["Storage", "Database service", "Compute", "Networking"], correct: "Database service" },
    { q: "What is Lambda?", opts: ["Letter", "Serverless computing", "Database", "Storage"], correct: "Serverless computing" },
    { q: "What is VPC?", opts: ["Video", "Virtual network", "Storage", "Database"], correct: "Virtual network" },
    { q: "What is IAM?", opts: ["Identity management", "Image", "Instance", "Interface"], correct: "Identity management" },
    { q: "What is CloudFormation?", opts: ["Cloud shape", "Infrastructure as Code", "Storage", "Database"], correct: "Infrastructure as Code" },
    { q: "What is SNS?", opts: ["Network", "Messaging service", "Database", "Compute"], correct: "Messaging service" },
    { q: "What is SQS?", opts: ["Storage", "Queue service", "Database", "Compute"], correct: "Queue service" }
  ],
  java: [
    { q: "What is Java?", opts: ["Coffee", "Programming language", "Framework", "Database"], correct: "Programming language" },
    { q: "What is JVM?", opts: ["Machine", "Java Virtual Machine", "Java Version Manager", "Application"], correct: "Java Virtual Machine" },
    { q: "What is inheritance in Java?", opts: ["Money", "Class relationship", "Interface", "Package"], correct: "Class relationship" },
    { q: "What is polymorphism?", opts: ["Many forms", "One method", "Interface", "Abstract"], correct: "Many forms" },
    { q: "What is encapsulation?", opts: ["Wrapping", "Data hiding", "Interface", "Inheritance"], correct: "Data hiding" },
    { q: "What is abstraction?", opts: ["Complex", "Hiding details", "Inheritance", "Class"], correct: "Hiding details" },
    { q: "What is an interface?", opts: ["GUI", "Contract", "Class", "Abstract class"], correct: "Contract" },
    { q: "What is exception handling?", opts: ["Errors", "Error management", "Try-catch", "None"], correct: "Error management" },
    { q: "What are packages in Java?", opts: ["Delivery", "Code organization", "Library", "Framework"], correct: "Code organization" },
    { q: "What is a thread in Java?", opts: ["Yarn", "Execution unit", "Process", "Task"], correct: "Execution unit" }
  ],
  sql: [
    { q: "What is SQL?", opts: ["Language", "Structured Query Language", "Server", "Database"], correct: "Structured Query Language" },
    { q: "What does SELECT do?", opts: ["Choose", "Retrieve data", "Insert", "Delete"], correct: "Retrieve data" },
    { q: "What does JOIN do?", opts: ["Connect", "Combine tables", "Update", "Create"], correct: "Combine tables" },
    { q: "What is a PRIMARY KEY?", opts: ["Password", "Unique identifier", "Foreign key", "Index"], correct: "Unique identifier" },
    { q: "What is normalization?", opts: ["Making normal", "Database organization", "Backup", "Recovery"], correct: "Database organization" },
    { q: "What is an INDEX?", opts: ["Number", "Fast lookup", "Table", "Column"], correct: "Fast lookup" },
    { q: "What is a VIEW?", opts: ["See", "Virtual table", "Report", "Query"], correct: "Virtual table" },
    { q: "What is a TRIGGER?", opts: ["Gun", "Automated action", "Event", "Function"], correct: "Automated action" },
    { q: "What is a transaction?", opts: ["Deal", "Atomic operations", "Process", "Query"], correct: "Atomic operations" },
    { q: "What does GROUP BY do?", opts: ["Organize", "Group rows", "Sort", "Filter"], correct: "Group rows" }
  ],
  machine_learning: [
    { q: "What is Machine Learning?", opts: ["Robots", "Learning from data", "Programming", "Database"], correct: "Learning from data" },
    { q: "What is supervised learning?", opts: ["No labels", "Labeled data", "Clustering", "Rules"], correct: "Labeled data" },
    { q: "What is unsupervised learning?", opts: ["No data", "No labels", "No training", "No testing"], correct: "No labels" },
    { q: "What is regression?", opts: ["Going back", "Predicting values", "Classification", "Clustering"], correct: "Predicting values" },
    { q: "What is classification?", opts: ["Organizing", "Predicting categories", "Clustering", "Regression"], correct: "Predicting categories" },
    { q: "What is clustering?", opts: ["Groups", "Grouping similar data", "Classification", "Prediction"], correct: "Grouping similar data" },
    { q: "What is training in ML?", opts: ["Exercise", "Learning from data", "Testing", "Prediction"], correct: "Learning from data" },
    { q: "What is overfitting?", opts: ["Good fit", "Too good fit", "Bad fit", "No fit"], correct: "Too good fit" },
    { q: "What is underfitting?", opts: ["Good fit", "Too simple", "Too complex", "No fit"], correct: "Too simple" },
    { q: "What is cross-validation?", opts: ["Checking", "Data validation", "Model evaluation", "Testing"], correct: "Model evaluation" }
  ],
  angular: [
    { q: "What is Angular?", opts: ["Math concept", "Framework", "Language", "Library"], correct: "Framework" },
    { q: "What is TypeScript?", opts: ["Script", "Superset of JS", "Language", "Framework"], correct: "Superset of JS" },
    { q: "What is dependency injection?", opts: ["Injecting code", "Design pattern", "Framework", "Component"], correct: "Design pattern" },
    { q: "What is a component in Angular?", opts: ["Part", "Building block", "Module", "Service"], correct: "Building block" },
    { q: "What is a service in Angular?", opts: ["Server", "Reusable code", "Component", "Module"], correct: "Reusable code" },
    { q: "What is a directive?", opts: ["Direction", "DOM instruction", "Component", "Service"], correct: "DOM instruction" },
    { q: "What is data binding?", opts: ["Combining", "Syncing data", "Storing", "Retrieving"], correct: "Syncing data" },
    { q: "What is RxJS?", opts: ["Programming", "Reactive library", "Framework", "Language"], correct: "Reactive library" },
    { q: "What is a module in Angular?", opts: ["Part", "Organizing unit", "Component", "Service"], correct: "Organizing unit" },
    { q: "What is routing?", opts: ["Path", "Navigation", "Module", "Component"], correct: "Navigation" }
  ],
  "cloud computing": [
    { q: "What is cloud computing?", opts: ["Sky", "Internet-based computing", "Storage", "Server"], correct: "Internet-based computing" },
    { q: "What is IaaS?", opts: ["Service", "Infrastructure as Service", "Platform", "Software"], correct: "Infrastructure as Service" },
    { q: "What is PaaS?", opts: ["Service", "Platform as Service", "Infrastructure", "Software"], correct: "Platform as Service" },
    { q: "What is SaaS?", opts: ["Service", "Software as Service", "Platform", "Infrastructure"], correct: "Software as Service" },
    { q: "What is a private cloud?", opts: ["Secret", "Organization-owned", "Public", "Hybrid"], correct: "Organization-owned" },
    { q: "What is a public cloud?", opts: ["Visible", "Internet accessible", "Private", "Hybrid"], correct: "Internet accessible" },
    { q: "What is a hybrid cloud?", opts: ["Mixed", "Private + Public", "All private", "All public"], correct: "Private + Public" },
    { q: "What is cloud migration?", opts: ["Moving people", "Moving to cloud", "Setup", "Deployment"], correct: "Moving to cloud" },
    { q: "What is cloud security?", opts: ["Passwords", "Cloud protection", "Firewalls", "Encryption"], correct: "Cloud protection" },
    { q: "What is auto-scaling?", opts: ["Scaling graphics", "Automatic resource adjustment", "Manual scaling", "Manual setup"], correct: "Automatic resource adjustment" }
  ]
};

function getCourseCategory(courseTitle) {
  const title = courseTitle.toLowerCase();
  
  if (title.includes("python")) return "python";
  if (title.includes("react")) return "react";
  if (title.includes("javascript") || title.includes("js")) return "javascript";
  if (title.includes("data structure")) return "data structures";
  if (title.includes("devops")) return "devops";
  if (title.includes("docker")) return "docker";
  if (title.includes("kubernetes")) return "kubernetes";
  if (title.includes("aws") || title.includes("cloud")) return "aws";
  if (title.includes("java")) return "java";
  if (title.includes("sql") || title.includes("database")) return "sql";
  if (title.includes("machine learning") || title.includes("ml")) return "machine_learning";
  if (title.includes("angular")) return "angular";
  if (title.includes("cloud")) return "cloud computing";
  
  // fallback to general web dev questions
  return "react";
}

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

const selectSql = `
  SELECT v.id AS video_id, v.course_id, c.title AS course_title
  FROM videos v
  LEFT JOIN courses c ON v.course_id = c.id
  ORDER BY v.course_id, v.id
`;

const insertSql = `
  INSERT INTO quizzes
  (video_id, question, option_a, option_b, option_c, option_d, correct_option)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

db.query(selectSql, (err, rows) => {
  if (err) {
    console.error("Error selecting videos:", err);
    db.end();
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log("No videos found.");
    db.end();
    process.exit(0);
  }

  let pending = 0;
  let totalInserted = 0;

  for (const r of rows) {
    const category = getCourseCategory(r.course_title);
    const questions = courseQuestions[category] || courseQuestions.react;

    for (let i = 0; i < 10; i++) {
      pending++;
      const qData = questions[i];
      const shuffledOpts = shuffleArray(qData.opts);
      
      const insertQuery = `
        INSERT INTO quizzes
        (video_id, question, option_a, option_b, option_c, option_d, correct_option)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        insertQuery,
        [r.video_id, qData.q, shuffledOpts[0], shuffledOpts[1], shuffledOpts[2], shuffledOpts[3], qData.correct],
        (ieErr, res) => {
          if (ieErr) console.error(`Error for video ${r.video_id}:`, ieErr);
          else {
            totalInserted++;
            console.log(`Inserted quiz ${i + 1}/10 for video ${r.video_id}`);
          }

          pending--;
          if (pending === 0) {
            console.log(`\n✓ Done! Total quizzes inserted: ${totalInserted}`);
            db.end();
            process.exit(0);
          }
        }
      );
    }
  }
});
