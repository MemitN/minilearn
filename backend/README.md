# Learnly Backend Setup Guide

## Overview
This is the backend API for the Learnly learning platform. It handles authentication, course management, progress tracking, and more.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (recommended) with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### 1. Clone or create the backend directory
\`\`\`bash
mkdir learnly-backend
cd learnly-backend
\`\`\`

### 2. Initialize Node project
\`\`\`bash
npm init -y
\`\`\`

### 3. Install dependencies
\`\`\`bash
# Core dependencies
npm install express cors dotenv bcryptjs jsonwebtoken

# Development dependencies
npm install -D typescript ts-node @types/express @types/node @types/bcryptjs

# Database (optional but recommended)
npm install @prisma/client
npm install -D prisma
\`\`\`

### 4. Initialize TypeScript
\`\`\`bash
npx tsc --init
\`\`\`

### 5. Create environment file
Create `.env` file in root:
\`\`\`
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/learnly
JWT_SECRET=your-secret-key-here
NODE_ENV=development
\`\`\`

### 6. Set up database with Prisma (optional)
\`\`\`bash
npx prisma init
# Update DATABASE_URL in .env
# Create your schema.prisma file
npx prisma migrate dev --name init
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor only)
- `PUT /api/courses/:id` - Update course (instructor only)
- `DELETE /api/courses/:id` - Delete course (instructor only)

### Lessons
- `GET /api/courses/:courseId/lessons` - Get course lessons
- `GET /api/lessons/:id` - Get lesson details
- `POST /api/courses/:courseId/lessons` - Create lesson
- `PUT /api/lessons/:id` - Update lesson
- `DELETE /api/lessons/:id` - Delete lesson

### Progress
- `GET /api/progress/courses/:courseId` - Get course progress
- `POST /api/progress/lessons/:lessonId/complete` - Mark lesson complete
- `PUT /api/progress/lessons/:lessonId` - Update lesson progress

### Quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `GET /api/quizzes/:id/submission` - Get user submission

## Database Schema (Prisma)

\`\`\`prisma
// User Model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   // 'student', 'instructor', 'admin'
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Course Model
model Course {
  id          String   @id @default(cuid())
  title       String
  description String
  category    String
  price       Float    @default(0)
  rating      Float    @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// Lesson Model
model Lesson {
  id        String   @id @default(cuid())
  courseId  String
  title     String
  content   String?
  videoUrl  String?
  duration  Int      // in minutes
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
\`\`\`

## Running the Server

### Development mode
\`\`\`bash
npm run dev
\`\`\`

### Production build
\`\`\`bash
npm run build
npm start
\`\`\`

## Deployment Options

1. **Vercel**: Deploy with a Node.js runtime
2. **Railway**: One-click deployment from GitHub
3. **Heroku**: Traditional Node.js hosting
4. **AWS**: EC2 or App Runner
5. **DigitalOcean**: Simple VPS deployment

## Learning Resources

- **Express.js**: https://expressjs.com/
- **TypeScript**: https://www.typescriptlang.org/
- **Prisma**: https://www.prisma.io/docs/
- **JWT**: https://jwt.io/
- **bcryptjs**: https://www.npmjs.com/package/bcryptjs

## Common Issues & Solutions

**CORS Error?**
- Make sure CORS is properly configured in server.ts
- Update NEXT_PUBLIC_API_URL environment variable

**Database Connection Failed?**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify credentials are correct

**JWT Token Invalid?**
- Ensure JWT_SECRET is the same on both frontend and backend
- Check if token has expired

## Next Steps

1. Implement database with Prisma
2. Add input validation with zod or joi
3. Implement role-based access control
4. Add rate limiting
5. Set up logging and monitoring
6. Add comprehensive error handling
7. Create API documentation with Swagger
