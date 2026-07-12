# Project Tracker — Frontend

React frontend for a project & task tracking micro-app: authentication,
projects, tasks, notifications, and search. Pairs with
[Project-Tracker-Micro-App-backend](https://github.com/123yogin/Project-Tracker-Micro-App-backend).

## Features

- **Auth** — register/login with protected routes
- **Projects** — dashboard of project cards and project details
- **Tasks** — task list and a task drawer for details/editing
- **Notifications** — in-app notification bell
- **Search** across projects/tasks
- **Settings**
- Reusable UI kit (Button, Card, Input, Select, Badge) and toast notifications
- Component tests (Vitest) for auth, protected routes, and registration

## Tech stack

- React + Vite
- Axios, Context API (Auth, Toast)
- Vitest (tests)
- Dockerfile + nginx for production

> The app lives in the `frontend/` directory.

## Getting started

```bash
cd frontend
npm install
cp .env.example .env       # API base URL
npm run dev
```

## Project structure

```
frontend/src/
├─ pages/       Dashboard, ProjectDetails, Search, Settings, Login, Register
├─ components/  Layout, Navbar, ProjectCard, TaskItem, TaskDrawer, NotificationBell,
│               ProtectedRoute, ui/ (Button, Card, Input, Select, Badge)
├─ context/     AuthContext, ToastContext
└─ api/         axios.js
```
