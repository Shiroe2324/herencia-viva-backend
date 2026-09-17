# Rifi Rafi Backend

[![NestJS](https://img.shields.io/badge/NestJS-v11.1.18-ea2845?style=flat-square&logo=nestjs)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](LICENSE)
[![Node Version](https://img.shields.io/badge/Node-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org)

A robust, enterprise-grade backend API for personalized AI-powered recommendations. Built with **NestJS**, **TypeORM**, and **Gemini AI**, Rifi Rafi provides intelligent recommendation services with real-time streaming, multi-provider authentication, and comprehensive user management.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Development](#development)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Features

### 🤖 AI-Powered Recommendations
- **Gemini AI Integration**: Leverages Google's Generative AI for intelligent recommendations
- **Vector Search**: Semantic search with Chroma DB for context-aware results
- **Streaming Responses**: Real-time SSE (Server-Sent Events) for interactive chat experience
- **Chat Management**: Create, retrieve, update, and delete recommendation chats

### 🔐 Authentication & Security
- **Multi-Provider OAuth**: Google and Apple Sign-In authentication
- **JWT Sessions**: Secure token-based authentication with refresh support
- **Multi-Factor Authentication (MFA)**: TOTP-based MFA with QR code generation
- **Role-Based Access Control (RBAC)**: Fine-grained permission management

### 👥 User Management
- **User Profiles**: Comprehensive user data management
- **Picture Handling**: Support for profile pictures with S3-compatible storage
- **User Roles**: Configurable user roles and permissions
- **Session Management**: Secure cookie and token-based sessions

### 💾 Data & Storage
- **PostgreSQL**: Reliable relational database with TypeORM
- **Redis Caching**: High-performance caching and session storage
- **MinIO Integration**: S3-compatible object storage for file management
- **Database Migrations**: Automated schema versioning and rollback support

### 🌍 Internationalization
- **Multi-Language Support**: i18n support for English and Spanish
- **Auto-detection**: Language detection from query parameters, headers, or cookies
- **Translated Errors**: Localized error messages throughout the API

### 📊 Monitoring & Reliability
- **Health Checks**: Comprehensive health status endpoints
- **Rate Limiting**: Redis-backed throttling to prevent abuse
- **Request Logging**: Structured logging with Pino for debugging
- **Global Exception Handling**: Centralized error processing and reporting

### 🔧 Developer Experience
- **Swagger UI**: Interactive API documentation with Scalar
- **Data Validation**: Automatic validation with class-validator and class-transformer
- **CORS Enabled**: Cross-origin requests supported
- **Hot Reload**: Fast development with SWC compiler and file watching

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v20 or higher
- **npm** or **yarn**: Package managers
- **Docker & Docker Compose**: For containerized database services (optional but recommended)
- **PostgreSQL**: v14+ (if not using Docker)
- **Redis**: v7+ (if not using Docker)
- **MinIO**: (if not using Docker)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   See [Configuration](#configuration) section for required variables.

### Configuration

Create a `.env` file in the project root with the following variables:

```env
# Application
NODE_ENV=development
BACKEND_PORT=4000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rifi_rafi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=rifi_rafi
DATABASE_PORT=5432

# Redis
REDIS_URL=redis://:password@localhost:6379
REDIS_PASSWORD=redis_password
REDIS_PORT=6379

# MinIO
MINIO_URL=http://localhost:9000
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin
MINIO_BUCKET=rifi-rafi

# JWT
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple OAuth
APPLE_TEAM_ID=your_apple_team_id
APPLE_CLIENT_ID=your_apple_client_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY=your_apple_private_key

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Chroma
CHROMA_URL=http://localhost:8000

# Email
RESEND_API_KEY=your_resend_api_key

# Features
ENABLE_SEEDS=true
DOCS_ENABLED=true
```

For a complete list of configuration options, see [src/common/configs](src/common/configs).

### Running the Application

#### With Docker Compose (Recommended)

Start all services including PostgreSQL, Redis, MinIO, and Chroma:

```bash
# Start all services
docker-compose --profile backend up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Local Development

Start the application in development mode with hot reload:

```bash
# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Start development server (with file watching)
npm run start:dev

# Server runs on http://localhost:4000
```

#### Production Build

Build and run for production:

```bash
# Build the application
npm run build

# Run migrations and start
npm run start:prod
```

## Development

### Available Scripts

```bash
# Development
npm run start:dev        # Start with hot reload
npm run start:debug      # Start with debugger enabled
npm run start            # Start (SWC compiled)

# Building
npm run build            # Compile TypeScript to JavaScript
npm run format           # Format code with Prettier
npm run lint             # Run ESLint with auto-fix

# Testing
npm run test             # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Generate coverage report
npm run test:e2e        # Run end-to-end tests

# Database
npm run migration:generate -- --name=CreateUsersTable
npm run migration:run
npm run migration:revert
npm run migration:show

# Utilities
npm run validate:error-codes  # Validate error codes
npm run check:imports         # Check unused imports with Knip
```

### Project Structure

```
src/
├── common/              # Shared utilities and configurations
│   ├── configs/        # Configuration files for services
│   ├── constants/      # Application constants and error codes
│   ├── decorators/     # Custom decorators (@CurrentUser, @Private, etc.)
│   ├── filters/        # Global exception filters
│   ├── guards/         # Authentication and authorization guards
│   ├── interceptors/   # Request/response interceptors
│   ├── pipes/          # Validation pipes
│   ├── models/         # Shared data models
│   └── utils/          # Utility functions
├── database/           # TypeORM configuration and migrations
│   ├── entities/       # Database entity definitions
│   ├── migrations/     # Database schema migrations
│   └── data-source.ts  # TypeORM configuration
├── modules/            # Feature modules
│   ├── auth/          # Authentication module
│   ├── users/         # User management module
│   ├── recommendations/ # AI recommendations module
│   └── health/        # Health check module
├── locales/           # i18n translation files
├── templates/         # Email templates
└── main.ts            # Application entry point
```

## Architecture

### Core Modules

**Authentication Module** (`auth/`)
- Multi-provider OAuth (Google, Apple)
- JWT-based session management
- MFA support with TOTP
- Email verification flows

**Users Module** (`users/`)
- User profile management
- Role-based access control
- Picture/avatar handling
- User preferences

**Recommendations Module** (`recommendations/`)
- AI-powered recommendation engine
- Real-time streaming responses
- Chat history management
- Vector-based semantic search

**Health Module** (`health/`)
- Service health checks
- Database connectivity verification
- Redis status monitoring

### External Integrations

| Service | Purpose | Configuration |
|---------|---------|---|
| **Gemini AI** | Generative recommendations | `GEMINI_API_KEY` |
| **Chroma DB** | Vector embeddings & search | `CHROMA_URL` |
| **PostgreSQL** | Primary datastore | `DATABASE_URL` |
| **Redis** | Caching & rate limiting | `REDIS_URL` |
| **MinIO** | File storage | `MINIO_URL` |
| **Google OAuth** | Social authentication | `GOOGLE_CLIENT_*` |
| **Apple OAuth** | Social authentication | `APPLE_*` |
| **Resend** | Email delivery | `RESEND_API_KEY` |

## API Documentation

### Interactive Documentation

The API documentation is available through **Swagger UI** and **Scalar**:

- **Swagger UI**: `http://localhost:4000/api/docs` (if `DOCS_ENABLED=true`)
- **Scalar Docs**: `http://localhost:4000/api/reference`

### Example Requests

#### Get Personalized Recommendations

```bash
curl -X POST http://localhost:4000/recommendations/ai/ask \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I want a book recommendation for science fiction",
    "chatId": "uuid-here",
    "preferences": {"genre": "sci-fi"}
  }'
```

#### Stream Recommendations in Real-Time

```bash
curl -X GET "http://localhost:4000/recommendations/ai/ask/stream?query=Tell%20me%20about%20AI" \
  -H "Authorization: Bearer <jwt_token>" \
  -N
```

#### Authenticate with Google

```bash
curl -X POST http://localhost:4000/auth/google \
  -H "Content-Type: application/json" \
  -d '{"idToken": "<google_id_token>"}'
```

#### Get User Profile

```bash
curl -X GET http://localhost:4000/users/me \
  -H "Authorization: Bearer <jwt_token>"
```

### Response Format

All responses follow a consistent format:

**Success Response**:
```json
{
  "id": "uuid",
  "title": "Recommendation title",
  "description": "Detailed description",
  "createdAt": "2025-05-03T10:30:00Z"
}
```

**Error Response**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "BAD_REQUEST",
  "errorCode": "INVALID_INPUT"
}
```

For more details, visit the interactive API documentation at `/api/docs`.

## Contributing

To maintain code quality and consistency:

1. **Format code** before committing:
   ```bash
   npm run format
   ```

2. **Run linting**:
   ```bash
   npm run lint
   ```

3. **Run tests**:
   ```bash
   npm run test
   ```

4. **Validate error codes**:
   ```bash
   npm run validate:error-codes
   ```

For detailed contribution guidelines, see the [CONTRIBUTING.md](CONTRIBUTING.md) file (if available).

## Support

For issues, questions, or support:

1. **Check API Documentation**: Visit `http://localhost:4000/api/docs` for endpoint details
2. **Review Error Codes**: Check [src/common/constants/error-codes.constant.ts](src/common/constants/error-codes.constant.ts) for error definitions
3. **Check Logs**: Enable debug logging in development mode with `npm run start:debug`

## License

This project is proprietary software. All rights are reserved by **Leonard Andrés Ortega González**.

Unauthorized use, reproduction, modification, or distribution is strictly prohibited. For authorization or commercial licensing inquiries, please contact the copyright holder.

See [LICENSE](LICENSE) for full license terms.

---

**Version**: 0.9.1  
**Last Updated**: May 2025  
**Maintainer**: Leonard Andrés Ortega González
