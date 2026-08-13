# Expense Tracker API

A RESTful API for tracking personal expenses, built with Node.js, Express, and MongoDB. Each user has their own account and their own set of expenses, protected via JWT-based authentication.

Built as a solution to the [roadmap.sh Expense Tracker API](https://roadmap.sh/projects/expense-tracker-api) project.

## Features

- User sign up and login
- JWT-based authentication with short-lived access tokens and long-lived refresh tokens (via httpOnly cookie)
- Token refresh and logout endpoints
- Create, read, update, and delete expenses
- Each user can only access their own expenses
- Filter expenses by:
  - Past week
  - Past month
  - Last 3 months
  - Custom date range (`start` / `end`)
- Expense categories restricted to a fixed set: `groceries`, `leisure`, `electronics`, `utilities`, `clothing`, `health`, `others`
- Request validation with `express-validator`

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Auth:** JSON Web Tokens (`jsonwebtoken`), password hashing with `bcrypt`
- **Validation:** `express-validator`
- **Testing:** Vitest, Supertest, `mongodb-memory-server`

## Project Structure

```
.
├── app.js                   # Express app setup
├── index.js                 # Entry point, connects DB and starts server
├── controllers/
│   ├── auth.controller.js   # register, login, refresh, logout
│   └── expense.controller.js# CRUD + filtering logic
├── lib/
│   └── mongo.js             # MongoDB connection
├── middleware/
│   └── verifyToken.js       # JWT auth middleware
├── models/
│   ├── User.model.js
│   └── Expense.model.js
├── routes/
│   ├── auth.route.js
│   └── expense.route.js
├── validators/
│   ├── auth.validator.js
│   ├── expense.validator.js
│   └── validate.js
└── tests/
    └── integration/         # auth.test.js, expense.test.js
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A MongoDB Atlas cluster (or update `lib/mongo.js` to point at a local MongoDB instance)

### Installation

```bash
git clone https://github.com/Hicham-Hal/Expense-Tracker-API.git
cd Expense-Tracker-API
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_USERNAME=your_mongodb_username
DB_PASSWORD=your_mongodb_password
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

### Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000` (or the port set in `.env`).

### Running Tests

```bash
npm test          # run once
npm run test:watch # watch mode
```

## API Reference

All expense routes require an `Authorization: Bearer <accessToken>` header.

### Auth

| Method | Endpoint | Description | Body |
|---|---|---|---|
| POST | `/register` | Create a new user account | `{ "name", "email", "password" }` |
| POST | `/login` | Log in and receive an access token | `{ "email", "password" }` |
| POST | `/refresh-token` | Get a new access token using the refresh token cookie | — |
| POST | `/logout` | Clear the refresh token cookie | — |

`register` and `login` return an access token in the response body and set a `refreshToken` httpOnly cookie.

### Expenses

| Method | Endpoint | Description | Body / Query |
|---|---|---|---|
| GET | `/expense` | List expenses, optionally filtered | Query: `filter=past week \| past month \| last 3 month`, or `start` & `end` (ISO dates) |
| POST | `/expense` | Add a new expense | `{ "description", "amount", "category" }` |
| PUT | `/expense/:id` | Update an existing expense | `{ "description", "amount", "category" }` |
| DELETE | `/expense/:id` | Delete an expense | — |

#### Valid categories

`groceries`, `leisure`, `electronics`, `utilities`, `clothing`, `health`, `others`

#### Example: Filter expenses from the past week

```
GET /expense?filter=past week
Authorization: Bearer <accessToken>
```

#### Example: Custom date range

```
GET /expense?start=2026-07-01&end=2026-07-31
Authorization: Bearer <accessToken>
```

## Example Requests

<details>
<summary>Register</summary>

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }'
```
</details>

<details>
<summary>Login</summary>

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```
</details>

<details>
<summary>Add an expense</summary>

```bash
curl -X POST http://localhost:3000/expense \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{
    "description": "Weekly grocery shopping",
    "amount": 54.30,
    "category": "groceries"
  }'
```
</details>

## License

ISC