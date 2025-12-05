# PostgreSQL Setup Guide for Learnly

## Prerequisites
- Node.js 16+
- PostgreSQL 12+ installed on your local machine
- npm or yarn

## Step 1: Install PostgreSQL (Windows)

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. PostgreSQL will be installed and started automatically
5. Default port is 5432

## Step 2: Create Database

### Option A: Using pgAdmin GUI (Easiest)
1. Open pgAdmin (comes with PostgreSQL)
2. Right-click on "Databases" → Create → Database
3. Name it: `learnly`
4. Click Save

### Option B: Using Command Line
1. Open Command Prompt
2. Run: `psql -U postgres` (enter the password you set during installation)
3. Run this command in psql:
   \`\`\`sql
   CREATE DATABASE learnly;
   \`\`\`
4. Type `\q` to exit

## Step 3: Install Backend Dependencies

\`\`\`bash
# Navigate to backend folder
cd backend

# Install all required packages
npm install express cors dotenv bcryptjs jsonwebtoken pg

# Install dev dependencies
npm install -D typescript ts-node @types/express @types/node
\`\`\`

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit `.env` file with your database credentials:
   \`\`\`
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_NAME=learnly
   SEED_DB=true
   \`\`\`

## Step 5: Start Backend Server

\`\`\`bash
# From backend folder
npm run dev
# or
node --loader ts-node/esm server.ts
\`\`\`

### Expected Output:
\`\`\`
[DB Query] Xms - CREATE TABLE IF NOT EXISTS users...
✓ Database migrations completed successfully!
✓ Database seeding completed successfully!

========================================
Learnly Backend Server
========================================
Server running at http://localhost:3001
API Base URL: http://localhost:3001/api
Health Check: http://localhost:3001/api/health
========================================
\`\`\`

## Step 6: Verify Database Connection

1. Open your browser and visit:
   \`\`\`
   http://localhost:3001/api/health
   \`\`\`
   Should return: `{"status":"Learnly Backend Server is running!"}`

2. Check database in pgAdmin:
   - Expand the `learnly` database
   - You should see tables: users, courses, lessons, enrollments, etc.

## Testing the API

### Login Test
\`\`\`bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"student123"}'
\`\`\`

### Get Courses
\`\`\`bash
curl http://localhost:3001/api/courses
\`\`\`

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"
- PostgreSQL is not running. Start it:
  - Windows: Services → PostgreSQL → Right-click → Start
  - Or: `net start postgresql-x64-14` (replace 14 with your version)

### Error: "Database 'learnly' does not exist"
- Create the database using pgAdmin or psql (see Step 2)

### Error: "password authentication failed"
- Wrong password in `.env` file
- Check your PostgreSQL password and update `.env`

### Port 5432 already in use
- Change PostgreSQL port in `.env`: `DB_PORT=5433`
- Or kill the process using that port

## Common Commands

\`\`\`bash
# Connect to PostgreSQL
psql -U postgres

# List all databases
\l

# Connect to learnly database
\c learnly

# List all tables
\dt

# View table structure
\d table_name

# View all data in table
SELECT * FROM users;

# Exit psql
\q
\`\`\`

## Next Steps

1. Start the backend: `npm run dev`
2. Start the frontend: `npm run dev` (in main project folder)
3. Visit http://localhost:3000
4. Login with: student@example.com / student123

Your Learnly app is now connected to PostgreSQL!
