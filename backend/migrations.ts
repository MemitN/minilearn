// ============================================
// DATABASE MIGRATIONS
// ============================================
// SQL schema creation and table definitions for Learnly
// Run this once to set up the database structure

import { query } from "./db.js"

export async function runMigrations() {
  console.log("Running database migrations...")

  try {
    // Users table - stores all user accounts (students, instructors, admins)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) CHECK (role IN ('student', 'instructor', 'admin')) DEFAULT 'student',
        bio TEXT,
        avatar_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Courses table - all available courses
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100),
        price DECIMAL(10, 2) DEFAULT 0.00,
        instructor_id INTEGER NOT NULL REFERENCES users(id),
        rating DECIMAL(3, 1) DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        student_count INTEGER DEFAULT 0,
        thumbnail_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_instructor FOREIGN KEY(instructor_id) REFERENCES users(id)
      );
    `)

    // Lessons table - individual lessons within courses
    await query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER NOT NULL REFERENCES courses(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        video_url VARCHAR(500),
        duration INTEGER,
        position INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_course FOREIGN KEY(course_id) REFERENCES courses(id)
      );
    `)

    // Enrollments table - tracks which students are enrolled in which courses
    await query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        course_id INTEGER NOT NULL REFERENCES courses(id),
        enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completion_percentage INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        UNIQUE(user_id, course_id),
        CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
        CONSTRAINT fk_course FOREIGN KEY(course_id) REFERENCES courses(id)
      );
    `)

    // Lesson Progress table - tracks individual lesson completion per student
    await query(`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        lesson_id INTEGER NOT NULL REFERENCES lessons(id),
        completed BOOLEAN DEFAULT FALSE,
        progress_percentage INTEGER DEFAULT 0,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id),
        CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
        CONSTRAINT fk_lesson FOREIGN KEY(lesson_id) REFERENCES lessons(id)
      );
    `)

    // Quizzes table - assessments within lessons
    await query(`
      CREATE TABLE IF NOT EXISTS quizzes (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER NOT NULL REFERENCES lessons(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        passing_score INTEGER DEFAULT 70,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_lesson FOREIGN KEY(lesson_id) REFERENCES lessons(id)
      );
    `)

    // Quiz Questions table
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id SERIAL PRIMARY KEY,
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id),
        question TEXT NOT NULL,
        question_type VARCHAR(50) CHECK (question_type IN ('multiple_choice', 'true_false', 'essay')),
        options JSONB,
        correct_answer TEXT,
        position INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_quiz FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
      );
    `)

    // Quiz Attempts table - tracks user quiz submissions
    await query(`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        quiz_id INTEGER NOT NULL REFERENCES quizzes(id),
        score INTEGER,
        passed BOOLEAN,
        answers JSONB,
        attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
        CONSTRAINT fk_quiz FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
      );
    `)

    // Create indexes for better query performance
    await query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`)
    await query(`CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);`)
    await query(`CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);`)
    await query(`CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);`)
    await query(`CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);`)
    await query(`CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);`)

    console.log("✓ Database migrations completed successfully!")
  } catch (error) {
    console.error("Migration error:", error)
    throw error
  }
}
