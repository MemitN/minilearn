// ============================================
// DATABASE SEEDING
// ============================================
// Populates the database with sample data for testing and development
// Run this after migrations to seed demo courses, users, and lessons

import bcryptjs from "bcryptjs"
import { query } from "./db.js"

export async function seedDatabase() {
  console.log("Seeding database with sample data...")

  try {
    console.log("Clearing existing data...")
    await query("DELETE FROM quiz_attempts")
    await query("DELETE FROM quiz_questions")
    await query("DELETE FROM quizzes")
    await query("DELETE FROM lesson_progress")
    await query("DELETE FROM lessons")
    await query("DELETE FROM enrollments")
    await query("DELETE FROM courses")
    await query("DELETE FROM users")

    console.log("Creating sample users...")
    const studentPassword = bcryptjs.hashSync("student123", 10)
    const instructorPassword = bcryptjs.hashSync("instructor123", 10)

    const studentResult = await query(
      `INSERT INTO users (email, password, name, role, bio) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ["student@example.com", studentPassword, "John Student", "student", "Passionate learner"],
    )
    const studentId = studentResult.rows[0].id

    const instructorResult = await query(
      `INSERT INTO users (email, password, name, role, bio) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      ["instructor@example.com", instructorPassword, "Jane Instructor", "instructor", "Expert React Developer"],
    )
    const instructorId = instructorResult.rows[0].id

    console.log("Creating sample courses...")
    const course1Result = await query(
      `INSERT INTO courses (title, description, category, price, instructor_id, rating, student_count) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        "React Fundamentals",
        "Learn the basics of React including components, hooks, and state management",
        "Web Development",
        49.99,
        instructorId,
        4.8,
        1250,
      ],
    )
    const course1Id = course1Result.rows[0].id

    const course2Result = await query(
      `INSERT INTO courses (title, description, category, price, instructor_id, rating, student_count) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [
        "Advanced TypeScript",
        "Master TypeScript for building scalable applications with type safety",
        "Web Development",
        59.99,
        instructorId,
        4.9,
        890,
      ],
    )
    const course2Id = course2Result.rows[0].id

    console.log("Creating sample lessons...")
    const lesson1Result = await query(
      `INSERT INTO lessons (course_id, title, description, duration, position) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [course1Id, "Introduction to React", "Get started with React basics", 45, 1],
    )
    const lesson1Id = lesson1Result.rows[0].id

    const lesson2Result = await query(
      `INSERT INTO lessons (course_id, title, description, duration, position) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [course1Id, "Components and Props", "Understand React components and props", 60, 2],
    )
    const lesson2Id = lesson2Result.rows[0].id

    console.log("Creating sample enrollment...")
    await query(`INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)`, [studentId, course1Id])

    console.log("Adding lesson progress...")
    await query(
      `INSERT INTO lesson_progress (user_id, lesson_id, completed, progress_percentage) 
       VALUES ($1, $2, $3, $4)`,
      [studentId, lesson1Id, true, 100],
    )

    console.log("✓ Database seeding completed successfully!")
    console.log(`\nSample Credentials:\n`)
    console.log(`Student: student@example.com / student123`)
    console.log(`Instructor: instructor@example.com / instructor123`)
  } catch (error) {
    console.error("Seeding error:", error)
    throw error
  }
}
