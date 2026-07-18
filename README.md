
# AI Code Review System

A full-stack AI-powered code review platform built with React, Node.js, Express, Supabase, and Google Gemini.

## Features

- **Static Analysis**: ESLint integration for syntax errors, unused variables, and coding standard violations
- **Code Metrics**: Cyclomatic complexity, lines of code, number of functions/classes, and more
- **AI Reviews**: Google Gemini integration for intelligent code analysis, bug detection, security recommendations, and refactoring suggestions
- **Multiple Input Methods**:
  - Paste code directly
  - Upload JavaScript/JSX files
  - Analyze public GitHub repositories
- **Real Backend & Database**: No mock data! All data persisted in Supabase
- **Authentication**: Supabase Auth integration

## Project Structure

```
Ai code review system/
├── backend/        # Node.js + Express backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── ...
└── front end/      # React frontend
    ├── src/
    └── ...
```

## Setup Instructions

### 1. Backend Setup

1. Go to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory (use `.env.example` as a template)
4. Set up Supabase (see `backend/SUPABASE_SETUP.md` for detailed instructions)
5. Start the backend server: `npm start`

### 2. Frontend Setup

1. Go to the `front end` directory: `cd "front end"`
2. Install dependencies: `npm install`
3. Create a `.env` file in the front end directory (use `.env.example` as a template)
4. Start the frontend dev server: `npm run dev`

## Environment Variables

### Backend (.env)

```env
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3001
```

## How to Use

1. Start both backend and frontend servers
2. Sign up or log in using Supabase Auth
3. Create a new code review using one of the available methods
4. View your review history and detailed analysis reports

## Technologies Used

### Backend
- Node.js
- Express.js
- Supabase (database + auth)
- Google Gemini API
- ESLint (static analysis)
- Espree (AST parsing)
- Simple-git (repo cloning)

### Frontend
- React
- React Router
- Framer Motion (animations)
- Lucide React (icons)
- Monaco Editor (code editor)
- Vite (build tool)

## License

MIT
