# Frontend API Contract

This contract describes the routes currently mounted by the backend. Base URL: `http://localhost:8000`.

## Common Conventions

Authenticated requests use:

```http
Authorization: Bearer <JWT>
Content-Type: application/json
```

JSON responses use `{ success, message, data }` unless noted otherwise. Validation errors return `400` with `{ success: false, message: "Validation failed", errors: [...] }`. Unknown body fields return `400` with `{ success: false, message: "Unexpected request fields", fields: [...] }`. Missing or invalid authentication returns `401`; role denial returns `403`; missing resources return `404`.

## AUTH

### POST `/api/auth/signup`

- Auth required: No
- Admin required: No
- Headers: `Content-Type: application/json`
- Body: `{ fullName, email, password, phone?, address? }`; `fullName`, `email`, and `password` are required. `role` is rejected and cannot create an administrator.
- Query: None
- Success: `201`
- Response: `{ success, message, data: { user, token } }`; the user does not contain `password`.
- Errors: `400` validation/unknown fields, `409` duplicate email.

### POST `/api/auth/login`

- Auth required: No
- Admin required: No
- Headers: `Content-Type: application/json`
- Body: `{ email, password }`
- Query: None
- Success: `200`, `{ success, message, data: { user, token } }`
- Errors: `400` validation/unknown fields, `401` invalid credentials.

## USER

### GET `/api/users/profile`

- Auth required: Yes
- Admin required: No
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None
- Success: `200`, `{ success, message, data: { user } }`
- Errors: `401` unauthenticated, `404` user not found.

### PUT `/api/users/profile`

- Auth required: Yes
- Admin required: No
- Headers: `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- Body: `{ fullName?, phone?, address? }`
- Query: None
- Success: `200`, `{ success, message, data: { user } }`
- Errors: `400` validation, `401` unauthenticated, `404` user not found.

The equivalent routes `/api/auth/profile` (`GET`, `PUT`, and implemented `DELETE`) are also mounted.

## MENU

### GET `/api/menu`

- Auth/admin required: No
- Headers: None
- Body: None
- Query: `search?`, `category?`, `available?`, `minPrice?`, `maxPrice?`, `priceMin?`, `priceMax?`, `sort?` (`rating`, `newest`, `price-asc`, `price-desc`), `page?`, `limit?`
- Success: `200`, `{ success, message, data: { foods, pagination } }`
- Errors: `400` invalid query.

### GET `/api/menu/:id`

- Auth/admin required: No
- Headers: None
- Body/query: None; path `id` required
- Success: `200`, `{ success, message, data: { food } }`
- Errors: `400` invalid ID, `404` food not found.

### POST `/api/menu`

- Auth required: Yes
- Admin required: Yes (`role: "admin"`)
- Headers: `Authorization: Bearer <JWT>`; `multipart/form-data` with upload field `image`, or accepted body fields
- Body: required `name`, `category`, `price`; optional `description`, `available`, `isAvailable`, `ingredients`, `preparationTime`, `ratings`, `image`
- Query: None
- Success: `201`, `{ success, message, data: { food } }`
- Errors: `400` validation/unknown fields, `401`, `403`, `500` upload/storage errors.

### PUT `/api/menu/:id`

- Auth/admin required: Yes/Yes
- Headers/body/query: Same as menu creation; path `id` required
- Success: `200`, `{ success, message, data: { food } }`
- Errors: `400` validation or invalid ID, `401`, `403`, `404` food not found.

### DELETE `/api/menu/:id`

- Auth/admin required: Yes/Yes
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None; path `id` required
- Success: `200`, `{ success, message }`
- Errors: `400` invalid ID, `401`, `403`, `404` food not found.

## CART

### GET `/api/cart`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None
- Success: `200`, `{ success, message, data: { cart } }`
- Errors: `401`, `404` cart/user not found.

### POST `/api/cart/add`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- Body: `{ foodId, quantity? }`; quantity defaults to `1`
- Query: None
- Success: `200`, `{ success, message, data: { cart } }`
- Errors: `400` validation, invalid/unavailable food, or unknown fields; `401`; `404` food not found.

### PUT `/api/cart/update`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- Body: `{ foodId, quantity }`
- Query: None
- Success: `200`, `{ success, message, data: { cart } }`
- Errors: `400` validation, `401`, `404` cart item/food not found.

### DELETE `/api/cart/remove/:foodId`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None; path `foodId` required
- Success: `200`, `{ success, message, data: { cart } }`
- Errors: `400` invalid ID, `401`, `404` item not found.

### DELETE `/api/cart/clear`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None
- Success: `200`, `{ success, message }`
- Errors: `401`, `404` cart not found.

## ORDERS

### POST `/api/orders`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- Body: `{ deliveryAddress?, phone?, paymentMethod? }`; payment methods are `cash_on_delivery`, `stripe`, and `paypal`. Delivery address and phone fall back to the user's saved address and phone.
- Query: None
- Success: `201`, `{ success, message, data: { order } }`
- Errors: `400` validation, empty cart, unavailable/deleted food, missing address/phone, or invalid payment method; `401`; `500` transaction/database failure.
- Pricing: The backend reads food prices from the database, calculates `totalAmount`, snapshots item prices, and does not trust client pricing fields. A successful transaction clears the cart.

### GET `/api/orders/my-orders`

- Auth required: Yes; admin required: No
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None
- Success: `200`, `{ success, message, data: { orders } }`
- Errors: `401`.

### GET `/api/orders`

- Auth required: Yes
- Admin required: Yes
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None
- Success: `200`, `{ success, message, data: { orders } }`
- Errors: `401` unauthenticated, `403` non-admin.

### GET `/api/orders/:id`

- Auth required: Yes
- Admin required: No; customers may access only their own order
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None; path `id` required
- Success: `200`, `{ success, message, data: { order } }`
- Errors: `400` invalid ID, `401`, `403` another customer's order, `404` order not found.

### PUT or PATCH `/api/orders/:id/status`

- Auth required: Yes
- Admin required: Yes
- Headers: `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- Body: `{ status }`, where status is `Pending`, `Preparing`, `Out for Delivery`, `Delivered`, or `Cancelled`
- Query: None; path `id` required
- Success: `200`, `{ success, message, data: { order } }`
- Errors: `400` invalid status/ID, `401`, `403` non-admin, `404` order not found.

The backend currently mounts both methods and they perform the same update.

## ADMIN

### GET `/api/admin/dashboard`

- Auth required: Yes
- Admin required: Yes
- Headers: `Authorization: Bearer <JWT>`
- Body/query: None
- Success: `200`, `{ success, message, data: { totalUsers, totalOrders, pendingOrders, deliveredOrders, cancelledOrders, totalRevenue, revenue, recentOrders, mostOrderedFoods, salesByMonth, reviews } }`
- Errors: `401`, `403`, `500` database failure.

## PAYMENT

Supported order payment methods are exactly:

- `cash_on_delivery`
- `stripe`
- `paypal`

The obsolete values `card` and `mobile_money` are rejected.

## FRONTEND INTEGRATION RULES

- Base URL: `http://localhost:8000`
- Send `Authorization: Bearer <JWT>` on authenticated requests.
- Login returns the JWT in `data.token`; store it and send it as a Bearer token.
- The admin role is represented by `user.role === "admin"`. Public signup cannot assign that role.
- Fetch menu with `GET /api/menu`; fetch one item with `GET /api/menu/:id`.
- Cart operations use `GET /api/cart`, `POST /api/cart/add`, `PUT /api/cart/update`, `DELETE /api/cart/remove/:foodId`, and `DELETE /api/cart/clear`.
- Checkout uses `POST /api/orders`; the backend obtains authoritative prices from the database and clears the cart after a successful transaction.
- Fetch a user's orders with `GET /api/orders/my-orders`; administrators use `GET /api/orders` for all orders.
- Fetch administrator statistics with `GET /api/admin/dashboard`.
- Administrators change order status with `PUT` or `PATCH /api/orders/:id/status`.
- Payment methods are `cash_on_delivery`, `stripe`, and `paypal`.
- Order statuses are `Pending`, `Preparing`, `Out for Delivery`, `Delivered`, and `Cancelled`.
