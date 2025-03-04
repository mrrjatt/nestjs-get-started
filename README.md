# Get Started with NestJS, Sequelize, and JWT Authentication

This repository provides a complete starter template for building a NestJS application with Sequelize ORM and JWT-based authentication.

## Features

- NestJS framework
- Sequelize ORM with MySQL/PostgreSQL support
- JWT-based authentication
- User registration and login system
- Role-based access control
- Environment configuration using `.env`

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MySQL or PostgreSQL database

### Steps

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Configure the `.env` file (create one if not exists) and set your database credentials:

   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=yourpassword
   DATABASE_NAME=yourdatabase
   JWT_SECRET=your_secret_key
   ```



5. Start the application:

   ```sh
   npm run start
   ```

## API Endpoints

### Authentication

#### Register a new user

```http
POST /auth/register
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "your_jwt_token"
}
```

### Protected Routes

Add the `Authorization: Bearer <token>` header to access protected routes.

```http
GET /profile
Authorization: Bearer <token>
```

## Running in Development Mode

```sh
npm run start:dev
```

## Running in Production Mode

```sh
npm run start:prod
```

## License

This project is licensed under the MIT License.


