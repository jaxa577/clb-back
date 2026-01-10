# SNG LoadBoard Backend

A production-ready backend API for SNG LoadBoard (SLB), a B2B logistics marketplace platform for SNG (CIS) countries.

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens and role-based access control (RBAC)
- **User Management**: Multi-role system (Shipper, Broker, Driver, Admin)
- **Load Management**: Complete CRUD operations for logistics loads
- **Application System**: Drivers and brokers can apply to loads
- **Deal Management**: Automated deal creation and commission calculation
- **Real-time Chat**: WebSocket-based messaging system
- **Review System**: User ratings and feedback
- **API Documentation**: Complete Swagger/OpenAPI documentation
- **Production Ready**: Docker, health checks, rate limiting, and security middleware

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Refresh Tokens
- **Validation**: Zod + class-validator
- **Real-time**: WebSocket (Socket.IO)
- **Documentation**: Swagger/OpenAPI

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sng-loadboard-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database and JWT configuration
```

4. Set up the database
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npm run seed
```

5. Start the development server
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api/docs`

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Manual Docker Build

```bash
# Build the image
docker build -t sng-loadboard-backend .

# Run the container
docker run -p 3000:3000 --env-file .env sng-loadboard-backend
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user profile

### Users
- `GET /api/v1/users/:id` - Get user by ID (Admin)
- `GET /api/v1/users` - Get all users (Admin)
- `PUT /api/v1/users/:id` - Update user (Admin)

### Loads
- `POST /api/v1/loads` - Create new load (Shipper)
- `GET /api/v1/loads` - Get all loads
- `GET /api/v1/loads/my` - Get user's loads
- `GET /api/v1/loads/:id` - Get load by ID
- `PUT /api/v1/loads/:id` - Update load (Shipper)
- `DELETE /api/v1/loads/:id` - Delete load (Shipper)
- `GET /api/v1/loads/:id/applications` - Get load applications

### Applications
- `POST /api/v1/applications` - Apply to load
- `PATCH /api/v1/applications/:id/accept` - Accept application (Shipper)
- `PATCH /api/v1/applications/:id/reject` - Reject application (Shipper)
- `GET /api/v1/applications/my` - Get user's applications

### Deals
- `POST /api/v1/deals/confirm` - Confirm deal completion
- `GET /api/v1/deals/my` - Get user's deals

### Chat
- `GET /api/v1/chat/:userId` - Get chat with user
- `POST /api/v1/chat/send` - Send message

### Reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/:userId` - Get user reviews

### Health Check
- `GET /health` - Health check endpoint

## User Roles

- **SHIPPER**: Can create and manage loads
- **BROKER**: Can apply to loads and earn commission
- **DRIVER**: Can apply to loads for transportation
- **ADMIN**: Full system access and user management

## Database Schema

The application uses the following main entities:
- **User**: System users with roles and ratings
- **Load**: Transportation requests with origin/destination details
- **Application**: Applications from drivers/brokers to loads
- **Deal**: Confirmed agreements between parties
- **Message**: Chat messages between users
- **Review**: User ratings and feedback

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sng_loadboard?schema=public"

# JWT Configuration
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NODE_ENV="development"
PORT=3000
CORS_ORIGIN="http://localhost:3000"
```

## Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start development server with hot reload
npm run build             # Build the application
npm run start:prod        # Start production server

# Database
npx prisma studio         # Open Prisma Studio
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate Prisma client

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Run tests with coverage

# Linting
npm run lint              # Run ESLint
```

### Project Structure

```
src/
├── auth/                 # Authentication module
├── users/                # User management
├── loads/                # Load management
├── applications/         # Application handling
├── deals/                # Deal management
├── messages/             # Chat system
├── reviews/              # Review system
├── prisma/               # Database service
└── app.module.ts         # Main application module
```

## Security Features

- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Rate limiting (10 requests per minute)
- Input validation and sanitization
- CORS configuration
- Password hashing with bcrypt
- SQL injection protection via Prisma ORM

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@sngloadboard.com or join our Discord community.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
