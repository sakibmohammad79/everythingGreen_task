This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Next.js API & Webhook Implementation

Overview:

This project implements a user management API and a secure webhook endpoint using Next.js, Prisma, SQLite, and JWT authentication. Additionally, a login system is included for user authentication.

Features:

Task 1: API Development & Authentication

GET /api/users - Fetch all users.

POST /api/users - Add a new user (name, email, password fields, hashed password storage).

GET /api/users/:id - Fetch a user by ID.

Authentication: JWT authentication for secured API routes.

Database: Prisma + SQLite for user management.

Login System: Implemented at app/auth/login/routes.ts with email and password authentication.

Task 2: Webhook Implementation

POST /api/webhook - Processes webhook requests.

Signature Validation - Uses HMAC SHA-256 to verify request authenticity.

Data Storage - Stores received events in db.json.

Response: { "success": true, "message": "Received" }.

API Usage

1️⃣ Register a User

POST /api/users
{
"name": "John Doe",
"email": "john@example.com",
"password": "securepassword"
}

2️⃣ Login (Get Token)
POST /api/auth/login
{
"password": "123456",
"email": "sakib@gmail.com"
}

3️⃣ Fetch Users (Protected Route)
GET /api/users
Authorization: jwt_token

4️⃣ Fetch Single User By ID (Protected Route)
GET /api/users/id
Authorization: jwt_token

4️⃣ Webhook Endpoint
POST /api/webhook
Headers: { "x-signature": "hmac_signature" }
Body: { "eventType": "order_created", "data": { ... } }
