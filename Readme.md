# Polling Application

A full-stack real-time polling platform where users can create polls, share them publicly, collect responses, and view live analytics instantly.

Built with modern technologies like React, Node.js, Express, PostgreSQL, Drizzle ORM, TypeScript, and Socket.io.

---

# Features

- User Authentication (Register/Login)
- Create dynamic polls with multiple questions
- Required / Optional questions support
- Share poll using unique public link
- Anonymous or authenticated responses
- Poll expiration support
- Real-time analytics using Socket.io
- Live response updates
- Responsive modern UI
- Type-safe backend using TypeScript
- PostgreSQL database with Drizzle ORM
- Fast frontend with React + Vite

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form

## Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Drizzle ORM
- Socket.io
- JWT Authentication
- Docker

---

# Project Structure

```bash
Polling-Application/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── db/
│   │   ├── schema/
│   │   ├── socket/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── drizzle/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── layouts/
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
