# Eatery Management Backend

A production-ready REST API for an Eatery Management System built with Node.js, Express, MongoDB, and Mongoose.

## Overview

This backend powers a food ordering platform with authentication, menu management, cart operations, orders, reviews, favorites, admin controls, and payment integration. It is structured for maintainability, validation, and deployment readiness.

## Backend Responsibilities

The backend is responsible for:

- **User authentication and authorization** — Registering users, managing login sessions, and enforcing role-based access control (customer vs. admin)
- **Password hashing and JWT management** — Securely hashing passwords with bcrypt and issuing signed JWT tokens for stateless authentication
- **Managing users, menu items, and orders** — Full CRUD operations for all core resources in the system
- **Business logic** — Enforcing rules such as order creation from cart, review eligibility based on delivered orders, and delivery fee calculation
- **Database operations with MongoDB** — Persisting and querying all application data via Mongoose schemas and models
- **Exposing RESTful API endpoints** — Providing a structured, versioned API under `/api` for consumption by any client
- **Validating requests** — Using `express-validator` to sanitize and validate all incoming request data before processing
- **Handling errors** — Centralized error handling middleware that catches and formats all errors (validation, auth, database) into consistent JSON responses
- **Securing the application** — Applying Helmet headers, CORS policies, rate limiting, and input sanitization to protect against common attacks
- **Serving data to the React frontend** — Acting as the data layer for the React-based client, responding with structured JSON payloads

## Core Features

- JWT authentication and role-based authorization
- User profile and account management
- Menu CRUD with image uploads
- Shopping cart management
- Order placement, tracking, and status updates
- Review submission and retrieval
- Favorites management
- Admin dashboard endpoints
- Swagger API documentation
- Security hardening with rate limiting, CORS, Helmet, and input validation

## Project Structure

```
src/
├── config/       - Database and Swagger configuration
├── controllers/  - Request handlers
├── middleware/   - Authentication, validation, uploads, and error handling
├── models/       - Mongoose schemas
├── routes/       - API endpoint definitions
├── services/     - Payment and business logic helpers
├── validators/   - Express-validator request validation rules
└── utils/        - Logging, seeding, and shared utilities
uploads/          - Uploaded media files
tests/            - Automated smoke and regression tests
```

## Getting Started

### Prerequisites

Make sure the following are installed on your machine before proceeding:

| Tool | Minimum Version | Notes |
|------|----------------|-------|
| [Node.js](https://nodejs.org) | **18.x LTS** or higher | Check with `node -v` |
| [npm](https://www.npmjs.com) | **8.x** or higher | Bundled with Node.js. Check with `npm -v` |
| [MongoDB](https://www.mongodb.com) | **6.x** or higher | Local install **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster |
| [Git](https://git-scm.com) | Any recent version | For cloning the repository |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/emesekiniovo123/Eatery-Backend-App.git
cd eatery-server
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

This installs all production and development dependencies listed in `package.json`.

---

### Step 3 — Configure Environment Variables

Copy the example environment file and fill in your values:

**Windows:**
```bash
copy .env.example .env
```

**Mac / Linux:**
```bash
cp .env.example .env
```

Open the newly created `.env` file and update each variable:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
MONGO_URI=mongodb://127.0.0.1:27017/eaterydb

# Authentication
JWT_SECRET=replace_this_with_a_strong_secret_key

# CORS — set to your frontend URL (comma-separated for multiple origins)
CLIENT_URL=http://localhost:3000

# Logging (optional)
LOG_LEVEL=info
```

#### Environment Variable Reference

| Variable     | Required | Description                                                          | Example Value |
|--------------|----------|----------------------------------------------------------------------|---------------|
| `PORT`       | No       | Port the server listens on                                           |  |
| `NODE_ENV`   | Yes      | Runtime environment: `development`, `production`, or `test`          | `development` |
| `MONGO_URI`  | Yes      | Full MongoDB connection string (local or Atlas SRV)                  | `mongodb://user:pass@cluster.mongodb.net/eaterydb` |
| `JWT_SECRET` | Yes      | Secret key used to sign and verify JWT tokens — keep this private    | `my api jwt` |
| `CLIENT_URL` | No       | Allowed CORS origin(s). Separate multiple URLs with a comma          | `http://localhost:3000` |
| `LOG_LEVEL`  | No       | Logging verbosity level (`error`, `warn`, `info`, `debug`)           | `info` |

> **Tip — MongoDB Atlas:** If you are using a cloud database, your `MONGO_URI` will look like:
> ```
> mongodb://<username>:<password>@cluster0.abcde.mongodb.net/eaterydb?retryWrites=true&w=majority
> ```
> Get this string from your Atlas cluster under **Connect → Drivers**.

---

### Step 4 — Seed the Database (Optional)

Populate the database with sample food items and a test admin user:

```bash
npm run seed
```

This creates realistic sample data so you can test the API immediately without manually adding records.

---

### Step 5 — Start the Server

**Development mode** (auto-restarts on file changes via nodemon):
```bash
npm run dev
```

**Production mode** (standard Node.js, no auto-restart):
```bash
npm start
```

Once running, you should see:
```
connecting to MongoDB...
✅ Connected to MongoDB
Server is listening on http://localhost:8000
```

Visit `http://localhost:8000` to confirm the API is live.

---

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Start (dev) | `npm run dev` | Starts the server with nodemon (hot reload) |
| Start (prod) | `npm start` | Starts the server with plain Node.js |
| Test | `npm test` | Runs the full automated test suite |
| Seed | `npm run seed` | Seeds the database with sample data |


---

## API Reference

> **Base URL:** `http://localhost:8000`
>
> **Authentication:** Protected routes require a Bearer token in the `Authorization` header:
> ```
> Authorization: Bearer <your_jwt_token>
> ```
> 🔒 = requires authentication &nbsp;&nbsp; 👑 = requires admin
### Authentication — `/api/auth`

| Method | Endpoint          | Description                          | Auth |
|--------|-------------------|--------------------------------------|------|
| `POST` | `/api/auth/signup`  | Register a new user account          | —    |
| `POST` | `/api/auth/login`   | Login and receive a JWT token        | —    |
| `GET`  | `/api/auth/profile` | Get the authenticated user's profile | 🔒   |
| `PUT`  | `/api/auth/profile` | Update the authenticated user's profile | 🔒 |
| `DELETE` | `/api/auth/profile` | Delete the authenticated user's account | 🔒 |

#### POST `/api/auth/signup` — Request Body
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "phone": "+2348012345678",
  "address": "12 Broad Street, Lagos, Nigeria"
}
```

#### POST `/api/auth/login` — Request Body
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### PUT `/api/auth/profile` — Request Body (all fields optional)
```json
{
  "fullName": "John Doe",
  "phone": "+2348012345678",
  "address": "12 Broad Street, Lagos"
}
```

---

### Menu — `/api/menu`

| Method   | Endpoint        | Description                          | Auth |
|----------|-----------------|--------------------------------------|------|
| `GET`    | `/api/menu`     | Get all menu items (with filters)    | —    |
| `GET`    | `/api/menu/:id` | Get a single menu item by ID         | —    |
| `POST`   | `/api/menu`     | Create a new food item               | 🔒 👑 |
| `PUT`    | `/api/menu/:id` | Update an existing food item         | 🔒 👑 |
| `DELETE` | `/api/menu/:id` | Delete a food item                   | 🔒 👑 |

#### GET `/api/menu` — Query Parameters

| Parameter  | Type    | Description                                             |
|------------|---------|---------------------------------------------------------|
| `search`   | string  | Search food by name (case-insensitive)                  |
| `category` | string  | Filter by food category                                 |
| `available`| boolean | Filter by availability (`true` / `false`)               |
| `priceMin` | number  | Minimum price filter                                    |
| `priceMax` | number  | Maximum price filter                                    |
| `sort`     | string  | Sort order: `rating`, `newest`, `price-asc`, `price-desc` |
| `page`     | integer | Page number (default: `1`)                              |
| `limit`    | integer | Items per page (default: `10`, max: `100`)              |

#### POST/PUT `/api/menu` — Form Data (`multipart/form-data`)

| Field             | Type    | Required | Description                   |
|-------------------|---------|----------|-------------------------------|
| `name`            | string  | Yes      | Food item name                |
| `category`        | string  | Yes      | Food category                 |
| `price`           | number  | Yes      | Price                         |
| `description`     | string  | No       | Food description              |
| `available`       | boolean | No       | Availability status           |
| `preparationTime` | integer | No       | Preparation time in minutes   |
| `ingredients`     | array   | No       | List of ingredients           |
| `image`           | file    | No       | Food image (binary upload)    |

---

### Cart — `/api/cart`

| Method   | Endpoint                    | Description                          | Auth |
|----------|-----------------------------|--------------------------------------|------|
| `GET`    | `/api/cart`                 | Get the authenticated user's cart    | 🔒   |
| `POST`   | `/api/cart/add`             | Add a food item to the cart          | 🔒   |
| `PUT`    | `/api/cart/update`          | Update quantity of a cart item       | 🔒   |
| `DELETE` | `/api/cart/remove/:foodId`  | Remove a specific item from the cart | 🔒   |
| `DELETE` | `/api/cart/clear`           | Clear all items from the cart        | 🔒   |

#### POST `/api/cart/add` — Request Body
```json
{
  "foodId": "6870ab12cd34ef5678901234",
  "quantity": 2
}
```

#### PUT `/api/cart/update` — Request Body
```json
{
  "foodId": "6870ab12cd34ef5678901234",
  "quantity": 3
}
```

---

### Orders — `/api/orders`

| Method   | Endpoint                  | Description                                           | Auth     |
|----------|---------------------------|-------------------------------------------------------|----------|
| `POST`   | `/api/orders`             | Create a new order from the user's cart               | 🔒       |
| `GET`    | `/api/orders`             | Get orders (user sees own; admin sees all)            | 🔒       |
| `GET`    | `/api/orders/my-orders`   | Get all orders belonging to the authenticated user    | 🔒       |
| `GET`    | `/api/orders/:id`         | Get a single order by ID                              | 🔒       |
| `PUT`    | `/api/orders/:id/status`  | Update an order's status                              | 🔒 👑    |
| `PATCH`  | `/api/orders/:id/status`  | Update an order's status (alias)                      | 🔒 👑    |
| `DELETE` | `/api/orders/:id`         | Permanently delete an order                           | 🔒 👑    |

#### POST `/api/orders` — Request Body
```json
{
  "deliveryAddress": "15 Admiralty Way, Lekki, Lagos",
  "paymentMethod": "cash_on_delivery"
}
```

> **Payment Methods:** `cash_on_delivery`, `stripe`, `paypal`

#### PUT/PATCH `/api/orders/:id/status` — Request Body
```json
{
  "status": "Delivered"
}
```

> **Order Statuses:** `Pending`, `Confirmed`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`

---

### Reviews — `/api/reviews`

| Method   | Endpoint               | Description                                                        | Auth  |
|----------|------------------------|--------------------------------------------------------------------|-------|
| `POST`   | `/api/reviews`         | Submit a review for a food item (only for delivered orders)        | 🔒    |
| `GET`    | `/api/reviews/:foodId` | Get all reviews for a specific food item                           | —     |
| `DELETE` | `/api/reviews/:id`     | Delete a review (owner or admin only)                              | 🔒    |

#### POST `/api/reviews` — Request Body
```json
{
  "foodId": "6870ab12cd34ef5678901234",
  "rating": 5,
  "comment": "The food was delicious and arrived hot."
}
```

> `rating` must be an integer between `1` and `5`.
> A user can only review a food item they have received in a **Delivered** order, and only once per food item.

---

### Favorites — `/api/favorites`

| Method   | Endpoint                  | Description                                    | Auth |
|----------|---------------------------|------------------------------------------------|------|
| `GET`    | `/api/favorites`          | Get the authenticated user's favorite foods    | 🔒   |
| `POST`   | `/api/favorites/:foodId`  | Add a food item to favorites                   | 🔒   |
| `DELETE` | `/api/favorites/:foodId`  | Remove a food item from favorites              | 🔒   |

---

### Admin — `/api/admin`

All admin endpoints require both 🔒 authentication and 👑 admin role.

| Method   | Endpoint                      | Description                                           | Auth     |
|----------|-------------------------------|-------------------------------------------------------|----------|
| `GET`    | `/api/admin/dashboard`        | Get dashboard statistics (users, orders, revenue)     | 🔒 👑    |

#### Dashboard Response Data

The dashboard endpoint returns:

| Field             | Description                              |
|-------------------|------------------------------------------|
| `totalUsers`      | Total registered users                   |
| `totalOrders`     | Total orders placed                      |
| `revenue`         | Total revenue from all orders            |
| `pendingOrders`   | Count of orders in `Pending` status      |
| `mostOrderedFoods`| Top 5 most ordered food items            |
| `salesByMonth`    | Monthly sales aggregation                |
| `reviews`         | Total number of reviews                  |

---

## Swagger Documentation

Interactive API documentation is available at:

```
http://localhost:8000/api/docs
```

---

## Testing

Run the full automated test suite:

```bash
npm test
```

Seed the database with sample data:

```bash
npm run seed
```

---

## Docker

Build and run the API using Docker Compose:

```bash
docker compose up --build
```

---

## Project Scope & Compliance

This section documents how the backend meets every requirement from the **Online Eatery App – Backend Project Specification**.

---

### 1. Technology Stack

| Technology | Required | Status | Notes |
|---|---|---|---|
| Node.js | ✅ | ✅ Met | Runtime environment |
| Express.js | ✅ | ✅ Met | `app.js`, `server.js` |
| MongoDB Atlas | ✅ | ✅ Met | Connected via `MONGO_URI` in `.env` |
| Mongoose | ✅ | ✅ Met | All models use Mongoose schemas |
| JSON Web Token (JWT) | ✅ | ✅ Met | `jsonwebtoken` — token sign & verify |
| bcryptjs | ✅ | ✅ Met | `bcrypt` package used (functionally identical to `bcryptjs`) |
| dotenv | ✅ | ✅ Met | `.env` loaded at startup |
| express-validator | ✅ | ✅ Met | All routes validated via `src/validators/` |
| helmet | ✅ | ✅ Met | Applied globally in `app.js` |
| cors | ✅ | ✅ Met | Configured with `CLIENT_URL` origin whitelist |
| morgan | ✅ | ✅ Met | HTTP request logging in `app.js` |

---

### 2. Folder Structure

| Required Path | Status | Actual Path |
|---|---|---|
| `config/db.js` | ✅ Met | `src/config/db.js` |
| `controllers/` | ✅ Met | `src/controllers/` — 7 controller files |
| `middleware/` | ✅ Met | `src/middleware/` — auth, errorHandler, upload, validate |
| `models/` | ✅ Met | `src/models/` — User, Food, Cart, Order, Review |
| `routes/` | ✅ Met | `src/routes/` — 8 route files + index |
| `validators/` | ✅ Met | `src/validators/` — auth, menu, cart, order, review |
| `utils/` | ✅ Met | `src/utils/` — logger, seed |
| `.env` | ✅ Met | `.env` (root) |
| `app.js` | ✅ Met | `src/app.js` |
| `server.js` | ✅ Met | `src/server.js` |
| `package.json` | ✅ Met | `package.json` (root) |

> All paths sit under `src/` — a clean separation of source files from project root config.

---

### 3. Database Collections

#### Users Collection

| Required Field | Status | Actual Field | Notes |
|---|---|---|---|
| `name` | ✅ Met | `fullName` | Trimmed, 2–100 chars |
| `email` | ✅ Met | `email` | Unique, lowercase, validated |
| `password` | ✅ Met | `password` | Hashed with bcrypt, `select: false` |
| `phone` | ✅ Met | `phone` | Optional, max 20 chars |
| `role` (customer \| admin) | ✅ Met | `role` | Enum: `customer`, `admin` |
| `timestamps` | ✅ Met | `timestamps: true` | Auto `createdAt`, `updatedAt` |

#### Menu (Food) Collection

| Required Field | Status | Actual Field | Notes |
|---|---|---|---|
| `name` | ✅ Met | `name` | Required, indexed |
| `description` | ✅ Met | `description` | Optional, max 1000 chars |
| `price` | ✅ Met | `price` | Required, min 0, rounded to 2dp |
| `category` | ✅ Met | `category` | Required, indexed |
| `imageUrl` | ✅ Met | `image` | Stored as URL path string |
| `isAvailable` | ✅ Met | `available` | Boolean, default `true` |
| `timestamps` | ✅ Met | `timestamps: true` | Auto `createdAt`, `updatedAt` |

#### Orders Collection

| Required Field | Status | Actual Field | Notes |
|---|---|---|---|
| `user` (ObjectId → User) | ✅ Met | `customer` | Ref: `User`, indexed |
| `items` | ✅ Met | `items` | Array of `{ food, quantity, price }` |
| `totalAmount` | ✅ Met | `total` | Calculated: subtotal + deliveryFee |
| `deliveryAddress` | ✅ Met | `deliveryAddress` | Required, trimmed |
| `status` — Pending | ✅ Met | `orderStatus: 'Pending'` | Default status |
| `status` — Preparing | ✅ Met | `orderStatus: 'Preparing'` | In enum |
| `status` — Out for Delivery | ✅ Met | `orderStatus: 'Out for Delivery'` | In enum |
| `status` — Delivered | ✅ Met | `orderStatus: 'Delivered'` | In enum |
| `status` — Cancelled | ✅ Met | `orderStatus: 'Cancelled'` | In enum |
| `timestamps` | ✅ Met | `timestamps: true` | Auto `createdAt`, `updatedAt` |

---

### 4. Authentication

| Requirement | Status | Implementation |
|---|---|---|
| User Registration | ✅ Met | `POST /api/auth/signup` → `authController.signup` |
| User Login | ✅ Met | `POST /api/auth/login` → `authController.login` |
| Password Hashing | ✅ Met | `bcrypt.hash()` in `User.js` pre-save hook |
| JWT Token Generation | ✅ Met | `jwt.sign()` in `authController.js` — 30-day expiry |
| JWT Verification | ✅ Met | `jwt.verify()` in `middleware/auth.js` |
| Protected Routes | ✅ Met | `protect` middleware applied to all private routes |
| Role-Based Authorization | ✅ Met | `authorizeRoles('admin')` middleware on admin routes |

---

### 5. RESTful API Endpoints

#### Authentication

| Requirement | Status | Endpoint |
|---|---|---|
| Register user | ✅ Met | `POST /api/auth/signup` |
| Login user | ✅ Met | `POST /api/auth/login` |

#### Users

| Requirement | Status | Endpoint |
|---|---|---|
| Get user profile | ✅ Met | `GET /api/auth/profile` |
| Update user profile | ✅ Met | `PUT /api/auth/profile` |

#### Menu

| Requirement | Status | Endpoint |
|---|---|---|
| Get all meals | ✅ Met | `GET /api/menu` |
| Get meal by ID | ✅ Met | `GET /api/menu/:id` |
| Create meal (Admin) | ✅ Met | `POST /api/menu` |
| Update meal (Admin) | ✅ Met | `PUT /api/menu/:id` |
| Delete meal (Admin) | ✅ Met | `DELETE /api/menu/:id` |

#### Orders

| Requirement | Status | Endpoint |
|---|---|---|
| Create order | ✅ Met | `POST /api/orders` |
| Get customer orders | ✅ Met | `GET /api/orders/my-orders` |
| Get all orders (Admin) | ✅ Met | `GET /api/orders` (admin role gets all) |
| Update order status (Admin) | ✅ Met | `PUT /api/orders/:id/status` + `PATCH /api/orders/:id/status` |

---

### 6. Business Logic

| Requirement | Status | Location |
|---|---|---|
| Validate credentials | ✅ Met | `authController.login` — checks email + comparePassword |
| Hash passwords | ✅ Met | `User.js` pre-save hook using bcrypt |
| Compare passwords | ✅ Met | `userSchema.methods.comparePassword` using `bcrypt.compare` |
| Generate JWT | ✅ Met | `createToken()` in `authController.js` |
| Create menu item | ✅ Met | `menuController.createFood` |
| Update menu item | ✅ Met | `menuController.updateFood` |
| Delete menu item | ✅ Met | `menuController.deleteFood` |
| Retrieve menu items | ✅ Met | `menuController.getMenu` + `getFoodById` |
| Create new order | ✅ Met | `orderController.createOrder` |
| Calculate total amount | ✅ Met | `subtotal + deliveryFee` computed in `createOrder` |
| Save order | ✅ Met | `Order.create()` in `orderController.createOrder` |
| Update order status | ✅ Met | `orderController.updateOrderStatus` |
| Retrieve customer orders | ✅ Met | `orderController.getMyOrders` |

---

### 7. Middleware

| Requirement | Status | File | Responsibility |
|---|---|---|---|
| Authentication Middleware | ✅ Met | `src/middleware/auth.js` → `protect` | Verifies JWT, decodes token, attaches `req.user` |
| Authorization Middleware | ✅ Met | `src/middleware/auth.js` → `authorizeRoles` | Restricts admin-only routes by role check |
| Error Handling Middleware | ✅ Met | `src/middleware/errorHandler.js` | Returns consistent JSON error responses |
| Validation Middleware | ✅ Met | `src/middleware/validate.js` | Runs express-validator results, returns 400 on failure |

---

### 8. Input Validation

#### Authentication (`src/validators/auth.js`)

| Field | Status |
|---|---|
| Full Name | ✅ Validated — required, trimmed |
| Email | ✅ Validated — `isEmail()` format check |
| Password | ✅ Validated — minimum 6 characters |
| Phone Number | ✅ Validated — optional, trimmed |

#### Menu (`src/validators/menu.js`)

| Field | Status |
|---|---|
| Meal Name | ✅ Validated — required, trimmed |
| Description | ✅ Validated — optional, trimmed |
| Price | ✅ Validated — `isFloat({ min: 0 })` |
| Category | ✅ Validated — required, trimmed |
| Availability | ✅ Validated — optional boolean |

#### Orders (`src/validators/order.js`)

| Field | Status |
|---|---|
| Delivery Address | ✅ Validated — required, trimmed |
| Payment Method | ✅ Validated — must be one of allowed values |
| Order Status | ✅ Validated — must match allowed status enum |

---

### 9. Security

| Requirement | Status | Implementation |
|---|---|---|
| Password hashing (bcryptjs) | ✅ Met | `bcrypt` with 12 salt rounds in `User.js` |
| JWT Authentication | ✅ Met | Signed tokens with `JWT_SECRET`, verified on every protected route |
| Helmet | ✅ Met | `app.use(helmet())` in `app.js` |
| CORS | ✅ Met | `app.use(cors({ origin: allowedOrigins }))` in `app.js` |
| Rate Limiting | ✅ Met | `express-rate-limit` — 100 requests per 15 minutes |
| Environment Variables | ✅ Met | All secrets stored in `.env`, loaded via `dotenv` |

---

### 10. Environment Variables

| Required Variable | Status | Actual Variable |
|---|---|---|
| `PORT` | ✅ Met | `PORT` |
| `MONGODB_URI` | ✅ Met | `MONGO_URI` (same purpose) |
| `JWT_SECRET` | ✅ Met | `JWT_SECRET` |

---

### 11. Database Connection

| Requirement | Status | Implementation |
|---|---|---|
| Establish connection | ✅ Met | `mongoose.connect()` in `src/config/db.js` |
| Handle connection success | ✅ Met | `logger.info('MongoDB connected')` on success |
| Handle connection failure | ✅ Met | Retry logic — 4 attempts with 3s delay, throws on final failure |

> The DB connection includes **automatic retry** (up to 4 attempts, 3-second delay between each) before failing — going beyond the basic requirement.

---

### 12. Error Handling

| Requirement | Status | Implementation |
|---|---|---|
| Invalid requests | ✅ Met | `express-validator` catches and returns `400` |
| Unauthorized access | ✅ Met | `protect` middleware returns `401` / `403` |
| Resource not found | ✅ Met | `notFound` middleware returns `404` |
| Validation errors | ✅ Met | Mongoose `ValidationError` caught in `errorHandler.js` |
| Internal server errors | ✅ Met | Global `errorHandler` catches all unhandled errors as `500` |
| JSON responses | ✅ Met | All error responses return `{ success: false, message }` |

---

### 13. Logging

| Requirement | Status | Implementation |
|---|---|---|
| Request logging | ✅ Met | `morgan('combined')` in `app.js` |
| API monitoring | ✅ Met | Winston logger (`src/utils/logger.js`) for structured server-side logs |

---

### 14. Deployment Readiness

| Requirement | Status | Notes |
|---|---|---|
| Deployable to Render / Railway | ✅ Ready | `npm start` runs `node src/server.js` — no build step needed |
| Environment variable configuration | ✅ Ready | All config via `.env` — set in hosting dashboard |
| MongoDB Atlas connection | ✅ Ready | Accepts any `mongodb://` URI via `MONGO_URI` |
| CORS configured for frontend | ✅ Ready | Set `CLIENT_URL` to your deployed frontend URL |
| Docker support | ✅ Ready | `Dockerfile` and `docker-compose.yml` included |

## Backend Deployment URL
https://online-eatery-server.onrender.com

