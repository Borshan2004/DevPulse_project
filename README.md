
# DevPulse

**Internal Tech Issue & Feature Tracker** — A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.



**Live URL:** [devpulse-api-ruby.vercel.app](https://devpulse-api-ruby.vercel.app)




## Features

- User registration and login with JWT-based authentication
- Role-based access control (`contributor` and `maintainer`)
- Create, read, update, and delete issue reports
- Filter issues by `type` and `status`
- Sort issues by newest or oldest
- Secure password hashing with bcrypt
- Modular architecture with TypeScript
 
 
---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js (LTS) | Runtime environment |
| TypeScript | Type-safe development |
| Express.js | HTTP server & routing |
| PostgreSQL (NeonDB) | Relational database |
| Raw SQL (`pg` driver) | Direct database queries |
| bcrypt | Password hashing |
| jsonwebtoken | JWT auth tokens |
| Vercel        |(Deployment)     |
---



---

## Getting Started (Local Setup)

### Prerequisites

- Node.js 24.x or higher
- PostgreSQL database (or NeonDB connection string)

### 1. Clone the repository

```bash
git clone https://github.com/Borshan2004/DevPulse_project.git
cd devpulse
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=3000
CONNECTIONSTRING=your_postgresql_connection_string
SECRET=your_jwt_secret_key
CORS_ORIGIN = your_origin
```

### 4. Set up the database

Run the following SQL to create the required tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE issues (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  reporter_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Start the development server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

##  API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login is possible if first register and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues (with filters) |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

#### Query Parameters for `GET /api/issues`

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

---

##  Database Schema

### `users`

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Unique, required |
| password | TEXT | Hashed, never returned in responses |
| role | VARCHAR(20) | `contributor` or `maintainer`, default `contributor` |
| created_at | TIMESTAMPTZ | Auto-generated |
| updated_at | TIMESTAMPTZ | Auto-updated |

### `issues`

| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required, max 150 chars |
| description | TEXT | Required, min 20 chars |
| type | VARCHAR(20) | `bug` or `feature_request` |
| status | VARCHAR(20) | `open`, `in_progress`, `resolved`, default `open` |
| reporter_id | INTEGER | References `users.id` (app-level validation) |
| created_at | TIMESTAMPTZ | Auto-generated |
| updated_at | TIMESTAMPTZ | Auto-updated |

---

##  Authorization Rules

| Action | contributor | maintainer |
|---|---|---|
| Register / Login | ✅ | ✅ |
| Create issue | ✅ | ✅ |
| View all/single issue | ✅ | ✅ |
| Update own issue (status: open) | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Delete any issue | ❌ | ✅ |
| Change issue status | ❌ | ✅ |

---





