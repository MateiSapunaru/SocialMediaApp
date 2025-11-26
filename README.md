
```markdown
# Social Media App (Node.js + MySQL)

A simple yet complete **social media-style application** built from scratch using **Node.js**, **Express**, and **MySQL**.  
The project demonstrates a modern backend architecture, RESTful API design, authentication with JWTs, and a simple frontend interface for showcasing the app.

---

## 🚀 Overview

This project was designed to demonstrate practical backend development skills and full-stack integration.  
It includes user authentication, role-based authorization, posts, comments, likes, and secure token-based session handling.

The codebase follows **MVC principles**, uses **Dependency Injection** for structure and testability, and applies **SOLID** design practices for maintainability.

---

## 🧩 Features

### 🔐 Authentication & Authorization
- Secure user registration and login using **bcrypt** password hashing.
- **JWT-based authentication** with short-lived access tokens and refresh tokens.
- Role-based access control (**USER**, **ADMIN**) for protected routes.

### 📰 Social Features
- Users can create, view, like, and comment on posts.
- Each post shows like counts and comment threads.
- Clean separation between public and protected endpoints.

### ⚙️ Backend Architecture
- Built using **Express** and follows a layered design:
```

Controller → Service → Repository → MySQL Database

```
- **Dependency Injection container** for decoupling business logic from data access.
- Centralized **error handling middleware** for cleaner request flow.

### 🧠 Design Patterns & Principles
- **MVC architecture** (Model–View–Controller)
- **SOLID principles** for maintainable and extensible code
- **Asynchronous programming** with `async/await`
- Separation of concerns across routes, controllers, services, and repositories

### 🧱 Database Schema
The MySQL schema includes:
- `users` – user accounts (with hashed passwords)
- `roles` and `user_roles` – role-based access
- `posts`, `comments`, `post_likes` – core social features
- `refresh_tokens` – token persistence for authentication

All relationships are normalized, with **foreign keys**, **indexes**, and **cascade rules** for consistency and performance.

---

## 💻 Tech Stack

**Backend:**
- Node.js  
- Express  
- MySQL (via `mysql2` driver)  
- bcrypt (password hashing)  
- jsonwebtoken (JWT authentication)  
- dotenv (environment management)  
- cors (CORS policy handling)

**Frontend:**
- Vanilla JavaScript (ES6+)
- Fetch API for async communication with backend
- Simple responsive UI built with HTML, CSS, and JS

**Development Tools:**
- Nodemon for auto-restart during development
- MySQL Workbench for schema management
- Postman for API testing

---

## 📁 Project Structure

```

backend/
│
├── src/
│   ├── config/          # DB connection and environment variables
│   ├── controllers/     # Route handlers (controllers)
│   ├── services/        # Business logic
│   ├── repositories/    # Database queries
│   ├── middlewares/     # Auth, role, and error handlers
│   ├── routes/          # Express routers
│   ├── di/              # Dependency Injection container
│   ├── utils/           # JWT, password helpers
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
│
├── database/
│   └── schema.sql       # MySQL database schema
│
└── .env                 # Environment configuration

frontend/
│
├── index.html
├── style.css
└── js/
├── api.js
├── auth.js
├── feed.js
└── main.js

````

---

## 🧪 API Testing (Postman)

The backend includes full Postman-tested endpoints for:

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate and receive tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `GET`  | `/posts` | Retrieve feed (public) |
| `POST` | `/posts` | Create a post (requires token) |
| `POST` | `/posts/:id/like` | Toggle like (requires token) |
| `POST` | `/posts/:id/comments` | Add a comment (requires token) |
| `GET`  | `/auth/users` | Get all users (ADMIN only) |

All responses are JSON-formatted and include proper HTTP status codes.

---

## 🔐 Security Considerations
- Passwords are **hashed** before storage.
- JWT secrets are stored in environment variables.
- Refresh tokens are persisted securely in the database.
- CORS policy enabled for safe frontend-backend communication.

---

## ⚙️ Setup & Usage

### 1. Clone the repository
```bash
git clone https://github.com/<yourusername>/social-media-app.git
cd social-media-app/backend
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure `.env`

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=socialmedia_app
ACCESS_TOKEN_SECRET=yourSecretKey
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_TTL_DAYS=7
```

### 4. Import the database schema

```bash
mysql -u root -p < database/schema.sql
```

### 5. Run the backend

```bash
npm run dev
```

### 6. Serve the frontend

```bash
cd ../frontend
npx serve .
```

---

## 🧠 Key Learning Outcomes

This project demonstrates:

* Real-world backend architecture design.
* Building a secure authentication system with JWT and refresh tokens.
* Structuring scalable Node.js applications.
* Designing normalized relational schemas in MySQL.
* Integrating backend and frontend through RESTful APIs.
* Following best practices in modularity, security, and clean code.

---

