# Leave Management System Backend API

This is the backend API for a simple Leave Management System. It is built using Node.js, Express, MongoDB, and Mongoose. The API handles user authentication, role-based access control, and leave request management for both employees and employers.

## Features

- **User Authentication:** Registration and Login using JWT (Access and Refresh tokens).
- **Role-Based Access Control (RBAC):** Distinct permissions for `employee` and `employer` roles.
- **Leave Management (Employee):**
  - Apply for various types of leaves.
  - View personal leave request history.
- **Leave Management (Employer):**
  - View all leave requests across the company.
  - Approve or reject leave requests.
  - **Dashboard Analytics:** View aggregate data on total leaves, statuses, leave types, and recent requests requiring attention.
- **API Documentation:** Interactive Swagger UI documentation.
- **Postman Collection:** A ready-to-use Postman collection for testing API endpoints.
- **Modern Syntax:** Fully refactored to use ES6 Modules (`import`/`export`).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You need Node.js installed (v14+ recommended).
- **MongoDB**: You need a running instance of MongoDB (either locally or via MongoDB Atlas).

## Installation

1. Clone the repository (if applicable) and navigate to the backend folder:
   ```bash
   cd path/to/backend
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and configure the following environment variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/leave-management  # Or your MongoDB Atlas URI
   JWT_KEY=your_super_secret_jwt_key
   JWT_EXPIRY=15m
   REFRESH_KEY=your_super_secret_refresh_key
   REFRESH_EXPIRY=7d
   ```

## Running the Project

To start the server in development mode (using nodemon for hot-reloading):

```bash
npm run dev
```

To start the server in production mode:

```bash
npm start
```

Once the server is running, the API will be available at:
`http://localhost:3000` (or whatever `PORT` you specified in `.env`).

## API Documentation

An interactive Swagger UI is available to explore and test the API endpoints.

- **URL:** `http://localhost:3000/api-docs`

## Postman Collection

A `Leave_Management_API.postman_collection.json` file is included in the root directory.

1. Import this file into Postman.
2. The collection leverages Postman Environment Variables. When you hit the "Login User" or "Refresh Token" endpoints successfully, Postman scripts will automatically save the `accessToken` into your active environment, allowing subsequent authenticated requests to run seamlessly.
