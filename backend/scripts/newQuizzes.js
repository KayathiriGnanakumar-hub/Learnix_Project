/**
 * Professional Quiz Questions for all courses
 * 10 questions per video
 * Topics: React, Python, Data Structures, DevOps, UI/UX, Mobile Dev, DBMS, ML, jQuery, Backend, JavaScript, Testing, Java, Angular, Cloud, C Language
 */

const quizzes = [
  // ========== REACT FUNDAMENTALS (Course 1) ==========
  // Video 2: React JS - Full Course for Beginners
  {
    videoId: 2,
    questions: [
      {
        q: "What is JSX?",
        a: "JavaScript XML - a syntax extension for writing HTML-like code in JavaScript",
        b: "Java Server XML - a Java-based templating language",
        c: "JavaScript Extension - a newer version of JavaScript",
        d: "JSON Syntax Extension - used for API responses",
        correct: "a"
      },
      {
        q: "Which hook is used to manage state in functional components?",
        a: "useEffect",
        b: "useState",
        c: "useContext",
        d: "useReducer",
        correct: "b"
      },
      {
        q: "What is the purpose of useEffect in React?",
        a: "To handle side effects like data fetching, subscriptions, and DOM updates",
        b: "To manage component state",
        c: "To style React components",
        d: "To optimize component rendering",
        correct: "a"
      },
      {
        q: "How do you pass data from parent to child component in React?",
        a: "Using state",
        b: "Using props",
        c: "Using context API",
        d: "Using localStorage",
        correct: "b"
      },
      {
        q: "What is a virtual DOM in React?",
        a: "A lightweight copy of the actual DOM kept in memory to improve performance",
        b: "An API for accessing the DOM",
        c: "A browser feature",
        d: "A styling mechanism",
        correct: "a"
      },
      {
        q: "Which method is used to update state in class components?",
        a: "setState()",
        b: "updateState()",
        c: "changeState()",
        d: "modifyState()",
        correct: "a"
      },
      {
        q: "What is React Fragment used for?",
        a: "To group multiple elements without adding extra DOM nodes",
        b: "To create reusable code snippets",
        c: "To manage component state",
        d: "To optimize CSS performance",
        correct: "a"
      },
      {
        q: "How is conditional rendering done in React?",
        a: "Using if-else statements directly in JSX",
        b: "Using ternary operators, logical AND (&&), or conditional methods",
        c: "Using switch-case statements",
        d: "Using CSS display property",
        correct: "b"
      },
      {
        q: "What is the key prop used for in React lists?",
        a: "To uniquely identify elements in a list for better performance and stability",
        b: "To encrypt data",
        c: "To store authentication tokens",
        d: "To add CSS styling",
        correct: "a"
      },
      {
        q: "What is the React Router library used for?",
        a: "Managing server-side routing",
        b: "Managing client-side routing and navigation",
        c: "Handling form submissions",
        d: "Managing global state",
        correct: "b"
      }
    ]
  },
  // Video 3: React JS Crash Course
  {
    videoId: 3,
    questions: [
      {
        q: "What is the difference between state and props?",
        a: "State is mutable and managed within component; props are immutable and passed from parent",
        b: "Props are mutable; state is immutable",
        c: "They are the same thing",
        d: "State is used in class components only",
        correct: "a"
      },
      {
        q: "How do you handle events in React?",
        a: "Using inline onclick attributes like HTML",
        b: "Using camelCase event handlers passed as function references",
        c: "Using addEventListener method",
        d: "Using event attributes in strings",
        correct: "b"
      },
      {
        q: "What is controlled component in React?",
        a: "A component that manages its own state independently",
        b: "A component whose form elements state is controlled by React",
        c: "A component with complex logic",
        d: "A component that uses API calls",
        correct: "b"
      },
      {
        q: "Which lifecycle method runs after render in class components?",
        a: "componentWillMount",
        b: "componentDidMount",
        c: "shouldComponentUpdate",
        d: "componentWillUpdate",
        correct: "b"
      },
      {
        q: "What is code splitting in React?",
        a: "Dividing code into multiple files",
        b: "Dynamically loading code chunks when needed to improve performance",
        c: "Separating frontend and backend code",
        d: "Breaking code into functions",
        correct: "b"
      },
      {
        q: "How do you prevent unnecessary re-renders in React?",
        a: "Using useMemo, useCallback, React.memo, or shouldComponentUpdate",
        b: "Deleting state properties",
        c: "Using setTimeout",
        d: "Using CSS to hide components",
        correct: "a"
      },
      {
        q: "What is the Context API used for?",
        a: "Making HTTP requests",
        b: "Sharing state across multiple components without prop drilling",
        c: "Managing database connections",
        d: "Styling components",
        correct: "b"
      },
      {
        q: "What is a custom hook in React?",
        a: "A built-in React hook",
        b: "A reusable function that contains React hooks logic",
        c: "A browser feature",
        d: "A type of state management library",
        correct: "b"
      },
      {
        q: "How do you handle async operations in useEffect?",
        a: "Making useEffect async directly",
        b: "Creating an async function inside useEffect and calling it",
        c: "Using async/await in component body",
        d: "Using useAsync hook",
        correct: "b"
      },
      {
        q: "What is Suspense in React?",
        a: "A feature to pause rendering until a condition is met (like data loading)",
        b: "A method to suspend component lifecycle",
        c: "A way to pause user interactions",
        d: "A debugging tool",
        correct: "a"
      }
    ]
  },

  // ========== PYTHON FOR BEGINNERS (Course 2) ==========
  // Video 1: Python
  {
    videoId: 1,
    questions: [
      {
        q: "Which of the following is a mutable data type in Python?",
        a: "Tuple",
        b: "String",
        c: "List",
        d: "Integer",
        correct: "c"
      },
      {
        q: "What is the output of print(type([]))?",
        a: "<class 'list'>",
        b: "<class 'array'>",
        c: "<class 'tuple'>",
        d: "<class 'dict'>",
        correct: "a"
      },
      {
        q: "Which keyword is used to create a function in Python?",
        a: "function",
        b: "def",
        c: "define",
        d: "func",
        correct: "b"
      },
      {
        q: "What does the range(5) function return?",
        a: "Numbers from 5 to 10",
        b: "Numbers from 0 to 4",
        c: "Numbers from 1 to 5",
        d: "Numbers from 5 to infinity",
        correct: "b"
      },
      {
        q: "Which method removes an item from a list?",
        a: "delete()",
        b: "remove()",
        c: "pop()",
        d: "Both b and c",
        correct: "d"
      },
      {
        q: "What is a dictionary in Python?",
        a: "An ordered collection of items with indices",
        b: "An unordered collection of key-value pairs",
        c: "A collection that only stores strings",
        d: "A data type for storing large files",
        correct: "b"
      },
      {
        q: "How do you handle errors in Python?",
        a: "Using try-except blocks",
        b: "Using if-else statements",
        c: "Using while loops",
        d: "Using decorators",
        correct: "a"
      },
      {
        q: "What is list comprehension?",
        a: "A way to read from files",
        b: "A concise way to create lists using a single line of code",
        c: "A method for sorting lists",
        d: "A function for filtering data",
        correct: "b"
      },
      {
        q: "Which keyword is used to create a variable with global scope?",
        a: "extern",
        b: "global",
        c: "declare",
        d: "public",
        correct: "b"
      },
      {
        q: "What is a lambda function in Python?",
        a: "A class method",
        b: "An anonymous function defined with the lambda keyword",
        c: "A type of loop",
        d: "A string formatting method",
        correct: "b"
      }
    ]
  },
  // Video 4: Python for Beginners
  {
    videoId: 4,
    questions: [
      {
        q: "What is the difference between == and is in Python?",
        a: "== compares identity, is compares value",
        b: "== compares value, is compares identity (memory address)",
        c: "They are the same",
        d: "is is used for numbers only",
        correct: "b"
      },
      {
        q: "How do you import a module in Python?",
        a: "include module_name",
        b: "import module_name",
        c: "require module_name",
        d: "load module_name",
        correct: "b"
      },
      {
        q: "What is pip in Python?",
        a: "A programming language",
        b: "A package manager for installing Python libraries",
        c: "A built-in Python function",
        d: "A debugging tool",
        correct: "b"
      },
      {
        q: "How do you slice a list in Python?",
        a: "list[1, 3]",
        b: "list[1:3]",
        c: "list.slice(1, 3)",
        d: "list.substring(1, 3)",
        correct: "b"
      },
      {
        q: "What does the zip() function do?",
        a: "Compresses files",
        b: "Combines multiple iterables element-wise",
        c: "Sorts data",
        d: "Removes duplicates",
        correct: "b"
      },
      {
        q: "What is the difference between append() and extend()?",
        a: "append() adds a single element; extend() adds multiple elements from an iterable",
        b: "extend() adds a single element; append() adds multiple elements",
        c: "They do the same thing",
        d: "extend() is used for strings only",
        correct: "a"
      },
      {
        q: "How do you check if a key exists in a dictionary?",
        a: "dict.hasKey(key)",
        b: "key in dict",
        c: "dict.contains(key)",
        d: "dict.exists(key)",
        correct: "b"
      },
      {
        q: "What is a tuple in Python?",
        a: "An ordered, immutable collection of items",
        b: "A mutable list",
        c: "A dictionary with one key",
        d: "A function parameter",
        correct: "a"
      },
      {
        q: "How do you reverse a list in Python?",
        a: "list.reverse() or list[::-1]",
        b: "list.flip()",
        c: "reverse(list)",
        d: "list.invert()",
        correct: "a"
      },
      {
        q: "What is the purpose of __init__ in a Python class?",
        a: "To initialize instance variables when creating an object",
        b: "To end a class definition",
        c: "To create static variables",
        d: "To import modules",
        correct: "a"
      }
    ]
  },

  // ========== DATA STRUCTURES & ALGORITHMS (Course 4) ==========
  // Video 5: Data Structures Easy to Advanced
  {
    videoId: 5,
    questions: [
      {
        q: "What is the time complexity of binary search?",
        a: "O(n)",
        b: "O(log n)",
        c: "O(n²)",
        d: "O(1)",
        correct: "b"
      },
      {
        q: "Which data structure uses LIFO (Last In First Out)?",
        a: "Queue",
        b: "Stack",
        c: "Array",
        d: "Tree",
        correct: "b"
      },
      {
        q: "What is the advantage of using a hash table?",
        a: "Fast insertion and lookup in average O(1) time",
        b: "Maintains sorted order",
        c: "Low memory usage",
        d: "Works with any data type",
        correct: "a"
      },
      {
        q: "How many edges does a tree with n nodes have?",
        a: "n edges",
        b: "n - 1 edges",
        c: "n + 1 edges",
        d: "2n edges",
        correct: "b"
      },
      {
        q: "What is the space complexity of merge sort?",
        a: "O(1)",
        b: "O(log n)",
        c: "O(n)",
        d: "O(n²)",
        correct: "c"
      },
      {
        q: "What is a linked list?",
        a: "A linear data structure where elements are stored contiguously",
        b: "A linear data structure of nodes where each node points to the next",
        c: "A tree-like structure",
        d: "A method to search elements",
        correct: "b"
      },
      {
        q: "Which sorting algorithm is stable?",
        a: "Quick Sort",
        b: "Heap Sort",
        c: "Merge Sort",
        d: "Selection Sort",
        correct: "c"
      },
      {
        q: "What is the time complexity of insertion in an unsorted array?",
        a: "O(1)",
        b: "O(log n)",
        c: "O(n)",
        d: "O(n²)",
        correct: "a"
      },
      {
        q: "What is a binary tree?",
        a: "A tree where each node has at most 2 children",
        b: "A tree with only 2 nodes",
        c: "A tree with 2 levels",
        d: "A tree with binary values",
        correct: "a"
      },
      {
        q: "What does DFS (Depth First Search) use?",
        a: "Queue",
        b: "Stack",
        c: "Array",
        d: "Linked List",
        correct: "b"
      }
    ]
  },
  // Video 6: Algorithms and Data Structures
  {
    videoId: 6,
    questions: [
      {
        q: "What is the time complexity of quick sort in average case?",
        a: "O(n log n)",
        b: "O(n²)",
        c: "O(n)",
        d: "O(log n)",
        correct: "a"
      },
      {
        q: "Which data structure is used to implement BFS (Breadth First Search)?",
        a: "Stack",
        b: "Queue",
        c: "Linked List",
        d: "Tree",
        correct: "b"
      },
      {
        q: "What is the maximum height of a binary tree with n nodes?",
        a: "log n",
        b: "n/2",
        c: "n - 1",
        d: "2n",
        correct: "c"
      },
      {
        q: "What is dynamic programming?",
        a: "A programming language feature",
        b: "A technique to solve problems by breaking them into overlapping subproblems",
        c: "A method to optimize RAM usage",
        d: "A type of sorting algorithm",
        correct: "b"
      },
      {
        q: "What is the difference between stack and queue?",
        a: "Stack is LIFO, Queue is FIFO",
        b: "They are the same",
        c: "Stack is FIFO, Queue is LIFO",
        d: "Stack is for numbers, Queue is for strings",
        correct: "a"
      },
      {
        q: "What is an AVL tree?",
        a: "A binary search tree that is not balanced",
        b: "A self-balancing binary search tree",
        c: "A tree with variable node values",
        d: "A tree used only for sorting",
        correct: "b"
      },
      {
        q: "What is Dijkstra's algorithm used for?",
        a: "Sorting arrays",
        b: "Finding shortest path in a weighted graph",
        c: "Searching elements",
        d: "Balancing trees",
        correct: "b"
      },
      {
        q: "What is time complexity of linear search?",
        a: "O(1)",
        b: "O(log n)",
        c: "O(n)",
        d: "O(n²)",
        correct: "c"
      },
      {
        q: "What is a graph?",
        a: "A data structure with nodes and edges connecting them",
        b: "A mathematical equation",
        c: "A type of array",
        d: "A sorting method",
        correct: "a"
      },
      {
        q: "What is the worst case time complexity of insertion sort?",
        a: "O(1)",
        b: "O(n)",
        c: "O(n log n)",
        d: "O(n²)",
        correct: "d"
      }
    ]
  }
];

export default quizzes;
