# Habit Tracker Application

A full-stack habit tracking application built with **React**, **Express**, and **LowDB**. Create, manage, and visualize your daily habits with beautiful charts.

## Features

- 🔐 JWT-based authentication (register / login)
- ✅ Create, update, and delete habits
- 📊 Visualize daily habit completion using Chart.js
- 📱 Responsive design for mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Tailwind CSS, Chart.js, Axios |
| Backend | Node.js, Express |
| Database | **LowDB** (local JSON file — no external DB required) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |

---

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/HabitTracker.git
cd HabitTracker
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create your `.env` file from the template:

```bash
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`:

```env
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

Start the backend:

```bash
npm run server
```

Backend runs at → `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Habits _(requires Bearer token)_
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/habits` | Get all habits |
| POST | `/api/habits` | Create a new habit |
| PUT | `/api/habits/:id` | Update a habit |
| DELETE | `/api/habits/:id` | Delete a habit |

---

## AWS Deployment Notes

> The backend is designed to be deployed to **AWS Elastic Beanstalk** or **EC2** (or containerized with **AWS ECS/Fargate**).

### Environment Variables on AWS

Set the following in your AWS environment (Elastic Beanstalk → Configuration → Software → Environment Properties, or via SSM Parameter Store):

```
JWT_SECRET   =  <strong random secret>
PORT         =  8080  (EB default HTTP port)
```

### Important
- **Do NOT store `db.json` in the repo** — it contains runtime user data and is gitignored.
- On AWS, the LowDB `db.json` file will persist on the EC2/EB instance disk. For production, consider migrating to **DynamoDB** or **RDS** for durability across deployments.
- Store secrets using **AWS Secrets Manager** or **SSM Parameter Store**, not in source code.

---

## Project Structure

```
HabitTracker/
├── Backend/
│   ├── config/          # DB config (LowDB setup)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # Data models
│   ├── routes/          # Express routes
│   ├── server.js        # Entry point
│   ├── .env.example     # ← Copy to .env and fill values
│   └── package.json
└── Frontend/
    ├── src/             # React source
    ├── public/
    ├── index.html
    └── package.json
```
