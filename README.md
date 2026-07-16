# Eatery Management Backend

A production-ready REST API for an Eatery Management System built with Node.js, Express, MongoDB, and Mongoose.

## Overview

This backend powers a food ordering platform with authentication, menu management, cart operations, orders, reviews, favorites, admin controls, and payment integration. It is structured for maintainability, validation, and deployment readiness.

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

- src/config - database and Swagger configuration
- src/controllers - request handlers
- src/middleware - authentication, validation, uploads, and error handling
- src/models - Mongoose schemas
- src/routes - API endpoints
- src/services - payment and business logic helpers
- src/validators - request validation rules
- src/utils - logging, seeding, and shared utilities
- uploads - uploaded media files
- tests - automated smoke and regression tests

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance
- npm

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create your environment file
   ```bash
   copy .env.example .env
   ```
4. Update the values in .env
5. Start the server
   ```bash
   npm run dev
   ```

### Environment Variables

- PORT - server port (default: 2026)
- NODE_ENV - environment mode
- MONGO_URI - MongoDB connection string
- JWT_SECRET - JWT signing secret
- CLIENT_URL - frontend URL allowed by CORS
- LOG_LEVEL - optional logging level

## API Overview

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Menu
- GET /api/menu
- GET /api/menu/:id
- POST /api/menu (admin)
- PUT /api/menu/:id (admin)
- DELETE /api/menu/:id (admin)

### Cart
- GET /api/cart
- POST /api/cart/add
- PUT /api/cart/update
- DELETE /api/cart/remove/:foodId
- DELETE /api/cart/clear

### Orders
- POST /api/orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status (admin)
- DELETE /api/orders/:id (admin)

### Reviews
- POST /api/reviews
- GET /api/reviews/:foodId
- DELETE /api/reviews/:id

### Favorites
- GET /api/favorites
- POST /api/favorites/:foodId
- DELETE /api/favorites/:foodId

### Admin
- GET /api/admin/dashboard

## Documentation

Swagger documentation is available at:
- /api/docs

## Testing

Run the automated test suite:
```bash
npm test
```

Seed sample data:
```bash
npm run seed
```

## Docker

Build and run the API using Docker Compose:
```bash
docker compose up --build
```
