import toast from 'react-hot-toast';

export const INITIAL_REVIEWS = [
  {
    id: 'REV-2983',
    projectName: 'Authentication Service',
    language: 'JavaScript',
    date: '2026-07-05T14:30:00Z',
    status: 'Completed',
    score: 68,
    creditsUsed: 10,
    securityScore: 45,
    performanceScore: 78,
    maintainabilityScore: 65,
    readabilityScore: 84,
    summary: 'The review detected a critical security vulnerability: credentials stored in plain text and vulnerability to SQL injection in query parsing. Furthermore, minor optimization can be achieved by utilizing cached connections in the auth middleware.',
    issues: [
      {
        id: 'ISS-001',
        title: 'Hardcoded Secret API Key',
        severity: 'critical',
        category: 'Security',
        file: 'auth.js:L12',
        description: 'Storing secrets in plaintext in the codebase allows anyone with code access to compromise the production API credentials. Use environment variables (process.env) instead.',
        beforeCode: `// Hardcoded API Token configuration
const API_TOKEN = "sk_test_MOCK_KEY_DO_NOT_USE_IN_PRODUCTION";
function fetchUserData() {
  return fetch(\`https://api.external.com/user\`, {
    headers: { 'Authorization': \`Bearer \${API_TOKEN}\` }
  });
}`,
        afterCode: `// Load token safely from environment variables
const API_TOKEN = process.env.EXTERNAL_API_TOKEN;
if (!API_TOKEN) {
  throw new Error("EXTERNAL_API_TOKEN configuration is missing!");
}

function fetchUserData() {
  return fetch(\`https://api.external.com/user\`, {
    headers: { 'Authorization': \`Bearer \${API_TOKEN}\` }
  });
}`
      },
      {
        id: 'ISS-002',
        title: 'Potential SQL Injection Vulnerability',
        severity: 'critical',
        category: 'Security',
        file: 'auth.js:L34',
        description: 'User input from req.body.username is directly interpolated into the SQL query string. This enables malicious users to alter query logic and view unauthorized accounts.',
        beforeCode: `async function findUser(req, res) {
  const query = \`SELECT * FROM users WHERE username = '\${req.body.username}' AND password = '\${req.body.password}'\`;
  const result = await db.query(query);
  return result.rows[0];
}`,
        afterCode: `async function findUser(req, res) {
  // Use parameterized queries to sanitize inputs automatically
  const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
  const values = [req.body.username, req.body.password];
  const result = await db.query(query, values);
  return result.rows[0];
}`
      },
      {
        id: 'ISS-003',
        title: 'Synchronous File Access in Request Handler',
        severity: 'warning',
        category: 'Performance',
        file: 'auth.js:L58',
        description: 'Using fs.readFileSync blocks the Node.js event loop for all concurrent requests. Use asynchronous promises (fs.promises.readFile) instead.',
        beforeCode: `const fs = require('fs');

function loadConfig(req, res) {
  const data = fs.readFileSync('./config.json', 'utf8');
  res.json(JSON.parse(data));
}`,
        afterCode: `const fs = require('fs').promises;

async function loadConfig(req, res) {
  try {
    const data = await fs.readFile('./config.json', 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Config file not found' });
  }
}`
      }
    ]
  },
  {
    id: 'REV-2980',
    projectName: 'FastAPI Data Parser',
    language: 'Python',
    date: '2026-07-02T10:15:00Z',
    status: 'Completed',
    score: 87,
    creditsUsed: 8,
    securityScore: 90,
    performanceScore: 74,
    maintainabilityScore: 92,
    readabilityScore: 92,
    summary: 'Excellent security and coding standards. The primary feedback involves memory utilization issues under high concurrency due to loading massive CSV files fully in memory. Recommendation is to parse files as generators.',
    issues: [
      {
        id: 'ISS-201',
        title: 'Inefficient Large File Ingestion',
        severity: 'warning',
        category: 'Performance',
        file: 'parser.py:L18',
        description: 'Calling df.to_dict() on dataframes containing over 100k rows spikes memory utilization. Stream chunks or process data in a generator style.',
        beforeCode: `import pandas as pd

def parse_large_csv(file_path):
    df = pd.read_csv(file_path)
    # Spikes memory by converting entire dataframe
    return df.to_dict(orient='records')`,
        afterCode: `import pandas as pd

def parse_large_csv_generator(file_path):
    # Process file in manageable chunks (e.g. 5000 rows at a time)
    for chunk in pd.read_csv(file_path, chunksize=5000):
        for index, row in chunk.iterrows():
            yield row.to_dict()`
      }
    ]
  },
  {
    id: 'REV-2975',
    projectName: 'Go Web Server Router',
    language: 'Go',
    date: '2026-06-28T18:45:00Z',
    status: 'Completed',
    score: 95,
    creditsUsed: 12,
    securityScore: 98,
    performanceScore: 95,
    maintainabilityScore: 92,
    readabilityScore: 95,
    summary: 'High-quality, production-ready router. Code adheres strictly to Go standards, featuring goroutine leak preventions and proper context propagation. A minor optimization: reduce allocation in path parameter parsing.',
    issues: [
      {
        id: 'ISS-301',
        title: 'Unnecessary String Allocation in Hot Path',
        severity: 'info',
        category: 'Performance',
        file: 'router.go:L77',
        description: 'Repeated conversion of string bytes in routing loop allocations memory. Compare string slices directly to lower garbage collection overhead.',
        beforeCode: `func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    path := string([]byte(req.URL.Path)) // Unnecessary allocation
    if path == "/health" {
        w.Write([]byte("ok"))
    }
}`,
        afterCode: `func (r *Router) ServeHTTP(w http.ResponseWriter, req *http.Request) {
    path := req.URL.Path // Avoid byte slicing and allocation
    if path == "/health" {
        w.Write([]byte("ok"))
    }
}`
      }
    ]
  },
  {
    id: 'REV-2964',
    projectName: 'React Profile Card',
    language: 'JavaScript',
    date: '2026-06-25T09:00:00Z',
    status: 'Completed',
    score: 82,
    creditsUsed: 5,
    securityScore: 100,
    performanceScore: 68,
    maintainabilityScore: 78,
    readabilityScore: 82,
    summary: 'The dashboard component runs fine but contains performance bottlenecks caused by excessive and unnecessary re-renders of list items due to missing stable keys, along with inline handlers in lists.',
    issues: [
      {
        id: 'ISS-401',
        title: 'Index Used as Key in Map Loop',
        severity: 'warning',
        category: 'Maintainability',
        file: 'ProfileList.jsx:L14',
        description: 'Using list index as key causes React to re-render all children when items are reordered or removed. Always use a unique identifier.',
        beforeCode: `export default function ProfileList({ users }) {
  return (
    <ul>
      {users.map((user, idx) => (
        <li key={idx} onClick={() => alert(user.name)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}`,
        afterCode: `export default function ProfileList({ users }) {
  // Use unique user.id and memoize handlers if needed
  const handleClick = (name) => {
    alert(name);
  };
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id} onClick={() => handleClick(user.name)}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}`
      }
    ]
  }
];

export const mockCreateReview = async (reviewInput) => {
  // Simulates creating a review
  // Generates scores and mock analysis content
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulated processing delay

  const reviewId = `REV-${Math.floor(1000 + Math.random() * 9000)}`;
  const languages = ['JavaScript', 'Python', 'Go', 'HTML/CSS', 'TypeScript', 'Java'];
  const lang = reviewInput.language || languages[Math.floor(Math.random() * languages.length)];
  
  // Calculate randomized but realistic scores
  const score = Math.floor(60 + Math.random() * 38); // 60 - 98
  const securityScore = Math.floor(50 + Math.random() * 49);
  const performanceScore = Math.floor(55 + Math.random() * 44);
  const maintainabilityScore = Math.floor(60 + Math.random() * 39);
  const readabilityScore = Math.floor(65 + Math.random() * 34);

  const mockNewReview = {
    id: reviewId,
    projectName: reviewInput.projectName || 'Pasted Code Chunk',
    language: lang,
    date: new Date().toISOString(),
    status: 'Completed',
    score: score,
    creditsUsed: 10,
    securityScore,
    performanceScore,
    maintainabilityScore,
    readabilityScore,
    summary: `This review evaluated the user-submitted code in ${lang}. PulsarAI detected multiple critical points of improvement. Focus on reducing heap allocations and securing sensitive data storage. Overall structural layout is coherent.`,
    issues: [
      {
        id: `ISS-${Math.floor(100 + Math.random() * 899)}`,
        title: 'Vulnerable Library or Outdated Dependency',
        severity: 'warning',
        category: 'Security',
        file: 'index.js:L5',
        description: 'Using outdated or insecure functions can lead to cross-site scripting (XSS) or prototype pollution. Consider upgrading or using recommended safe methods.',
        beforeCode: `// Deprecated unsafe parser
function parseInput(raw) {
  return eval("(" + raw + ")"); // DANGEROUS!
}`,
        afterCode: `// Standard JSON Parser
function parseInput(raw) {
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON content");
    return null;
  }
}`
      },
      {
        id: `ISS-${Math.floor(100 + Math.random() * 899)}`,
        title: 'Unoptimized Array Map-Reduce Loop',
        severity: 'info',
        category: 'Performance',
        file: 'utils.js:L42',
        description: 'Combining multiple array operations (.filter followed by .map and .reduce) results in multiple array iterations. Combine them into a single loop for performance gains on larger data.',
        beforeCode: `const sumOfActiveAge = users
  .filter(u => u.active)
  .map(u => u.age)
  .reduce((sum, age) => sum + age, 0);`,
        afterCode: `const sumOfActiveAge = users.reduce((sum, u) => {
  if (u.active) {
    return sum + u.age;
  }
  return sum;
}, 0);`
      }
    ]
  };

  return mockNewReview;
};
