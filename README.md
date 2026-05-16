# TaskFlow - Team Task Manager

TaskFlow is a full-stack task management application for teams. It includes user authentication, role-based access, project management, task assignment, task status updates, and a dashboard with task statistics.

## Tech Stack

**Frontend**
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- Framer Motion
- Lucide React

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs

## Features

- User signup and login
- Admin and Member roles
- JWT-protected API routes
- Admin-only project creation
- Admin-only task creation
- Task assignment to members
- Members can view and update only their assigned tasks
- Dashboard task statistics
- Light and dark theme support
- Responsive UI with animated dashboard cards and charts

## Project Structure

```text
Task manager/
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Project.js
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB database, local or MongoDB Atlas

### Backend Setup

1. Go to the backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

1. Go to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

Vite will show the local frontend URL in the terminal, usually:

```text
http://localhost:5173
```

## API Base URL

The frontend Axios instance is currently configured in:

```text
frontend/src/api/axios.js
```

It uses this production API URL:

```text
https://task-manager-production-f5b1.up.railway.app/api
```

For local development, change the `baseURL` to:

```js
baseURL: "http://localhost:5000/api",
```

## Available Scripts

### Backend

```bash
npm start
```

Runs the backend with Node.

```bash
npm run dev
```

Runs the backend with Nodemon.

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the frontend for production.

```bash
npm run preview
```

Previews the production build.

```bash
npm run lint
```

Runs ESLint.

## API Routes

### Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/members` | Get members, admin only |

### Projects

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/projects` | Create a project, admin only |
| GET | `/api/projects` | Get projects for current user |

### Tasks

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/tasks` | Create a task, admin only |
| GET | `/api/tasks` | Get tasks for current user |
| PUT | `/api/tasks/:id/status` | Update task status |
| GET | `/api/tasks/dashboard/stats` | Get dashboard task stats |

## Roles

**Admin**
- Can create projects
- Can create tasks
- Can assign tasks to members
- Can view all projects and tasks
- Can view member list

**Member**
- Can view projects they belong to
- Can view tasks assigned to them
- Can update their assigned task status

## Environment Variables

Create these variables in `backend/.env`:

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

## Deployment Notes

- The backend can be deployed to services like Railway, Render, or Heroku.
- The frontend can be deployed to Vercel, Netlify, or any static hosting service.
- Make sure the frontend `baseURL` points to the deployed backend API.
- Configure `MONGO_URI` and `JWT_SECRET` in the backend hosting provider.

## Author

Sanjeev Kumar
