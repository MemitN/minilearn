// ============================================
// LEARNLY BACKEND API SERVER
// ============================================
// Express.js server with PostgreSQL integration
// All endpoints connected to real database

import express, { type Express, type Request, type Response } from "express"
import cors from "cors"
import dotenv from "dotenv"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { query } from "./db.js"
import { runMigrations } from "./migrations.js"
import { seedDatabase } from "./seed.js"

dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Middleware
app.use(cors())
app.use(express.json())

async function initializeDatabase() {
  try {
    console.log("Initializing database...")
    await runMigrations()

    // Optional: Seed database if SEED_DB environment variable is true
    if (process.env.SEED_DB === "true") {
      await seedDatabase()
    }
    console.log("Database initialized successfully!")
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  }
}

/**
 * ============================================
 * AUTHENTICATION ROUTES
 * ============================================
 */

// Register endpoint - create new user account
app.post("/api/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check if user already exists
    const existingUser = await query("SELECT id FROM users WHERE email = $1", [email])
    if (existingUser.rowCount > 0) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10)

    // Insert new user into database
    const result = await query(
      `INSERT INTO users (email, password, name, role) 
       VALUES ($1, $2, $3, $4) RETURNING id, email, name, role`,
      [email, hashedPassword, name, role || "student"],
    )

    const newUser = result.rows[0]

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: "7d" })

    res.json({ user: newUser, token })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ error: "Registration failed" })
  }
})

// Login endpoint - authenticate user
app.post("/api/auth/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    // Find user by email
    const userResult = await query("SELECT * FROM users WHERE email = $1", [email])
    if (userResult.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = userResult.rows[0]

    // Verify password
    const isValidPassword = bcryptjs.compareSync(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Login failed" })
  }
})

// Get current user
app.get("/api/auth/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "No token provided" })
    }

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userResult = await query("SELECT id, email, name, role, bio FROM users WHERE id = $1", [decoded.userId])

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(userResult.rows[0])
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
})

/**
 * ============================================
 * COURSE ROUTES
 * ============================================
 */

// Get all courses with optional filtering
app.get("/api/courses", async (req: Request, res: Response) => {
  try {
    let sqlQuery = "SELECT * FROM courses"
    const params: any[] = []
    const conditions: string[] = []

    // Filter by search query
    if (req.query.query) {
      conditions.push(`(title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`)
      params.push(`%${req.query.query}%`)
    }

    // Filter by category
    if (req.query.category) {
      conditions.push(`category = $${params.length + 1}`)
      params.push(req.query.category)
    }

    if (conditions.length > 0) {
      sqlQuery += " WHERE " + conditions.join(" AND ")
    }

    // Sort results
    if (req.query.sortBy === "rating") {
      sqlQuery += " ORDER BY rating DESC"
    } else if (req.query.sortBy === "price") {
      sqlQuery += " ORDER BY price ASC"
    } else {
      sqlQuery += " ORDER BY created_at DESC"
    }

    const result = await query(sqlQuery, params)
    res.json(result.rows)
  } catch (error) {
    console.error("Get courses error:", error)
    res.status(500).json({ error: "Failed to fetch courses" })
  }
})

// Get single course with lessons
app.get("/api/courses/:id", async (req: Request, res: Response) => {
  try {
    const courseResult = await query("SELECT * FROM courses WHERE id = $1", [req.params.id])
    if (courseResult.rowCount === 0) {
      return res.status(404).json({ error: "Course not found" })
    }

    const course = courseResult.rows[0]

    // Get lessons for this course
    const lessonsResult = await query("SELECT * FROM lessons WHERE course_id = $1 ORDER BY position", [course.id])
    course.lessons = lessonsResult.rows

    res.json(course)
  } catch (error) {
    console.error("Get course error:", error)
    res.status(500).json({ error: "Failed to fetch course" })
  }
})

// Create new course (instructor only)
app.post("/api/courses", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const { title, description, category, price } = req.body

    const result = await query(
      `INSERT INTO courses (title, description, category, price, instructor_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, category, price || 0, decoded.userId],
    )

    res.json(result.rows[0])
  } catch (error) {
    console.error("Create course error:", error)
    res.status(500).json({ error: "Failed to create course" })
  }
})

/**
 * ============================================
 * ENROLLMENT ROUTES
 * ============================================
 */

// Enroll in course
app.post("/api/courses/:courseId/enroll", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const { courseId } = req.params

    // Check if already enrolled
    const existingEnrollment = await query("SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2", [
      decoded.userId,
      courseId,
    ])

    if (existingEnrollment.rowCount > 0) {
      return res.status(400).json({ error: "Already enrolled in this course" })
    }

    // Create enrollment
    const result = await query("INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *", [
      decoded.userId,
      courseId,
    ])

    res.json({ success: true, enrollment: result.rows[0] })
  } catch (error) {
    console.error("Enroll error:", error)
    res.status(500).json({ error: "Failed to enroll" })
  }
})

/**
 * ============================================
 * PROGRESS ROUTES
 * ============================================
 */

// Mark lesson as complete
app.post("/api/progress/lessons/:lessonId/complete", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const { lessonId } = req.params

    // Update or insert lesson progress
    const result = await query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, progress_percentage) 
       VALUES ($1, $2, true, 100)
       ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed = true, progress_percentage = 100
       RETURNING *`,
      [decoded.userId, lessonId],
    )

    res.json({ success: true, progress: result.rows[0] })
  } catch (error) {
    console.error("Progress update error:", error)
    res.status(500).json({ error: "Failed to update progress" })
  }
})

// Get user progress for course
app.get("/api/progress/courses/:courseId", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const decoded: any = jwt.verify(token, JWT_SECRET)
    const { courseId } = req.params

    // Get all lessons in course and user's progress
    const result = await query(
      `SELECT l.id, l.title, COALESCE(lp.completed, false) as completed
       FROM lessons l
       LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = $1
       WHERE l.course_id = $2
       ORDER BY l.position`,
      [decoded.userId, courseId],
    )

    // Calculate completion percentage
    const completed = result.rows.filter((r: any) => r.completed).length
    const total = result.rows.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    res.json({
      lessons: result.rows,
      completed,
      total,
      completionPercentage: percentage,
    })
  } catch (error) {
    console.error("Get progress error:", error)
    res.status(500).json({ error: "Failed to fetch progress" })
  }
})

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "Learnly Backend Server is running!" })
})

// Start server and initialize database
app.listen(PORT, async () => {
  console.log(`\n========================================`)
  console.log(`Learnly Backend Server`)
  console.log(`========================================`)
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`API Base URL: http://localhost:${PORT}/api`)
  console.log(`Health Check: http://localhost:${PORT}/api/health`)
  console.log(`========================================\n`)

  // Initialize database when server starts
  await initializeDatabase()
})

export default app
