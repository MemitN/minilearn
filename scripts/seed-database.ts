// ============================================
// DATABASE SEEDING SCRIPT
// ============================================
// This script populates the database with sample data for development and testing
// Usage: npx ts-node scripts/seed-database.ts

/**
 * SAMPLE DATA FOR LEARNLY DATABASE
 *
 * This script creates:
 * - Demo users (students and instructors)
 * - Sample courses across different categories
 * - Lessons with content
 * - Quizzes and questions
 * - User enrollments and progress
 *
 * In a real application, you would run this with Prisma:
 * prisma db seed
 */

// Sample instructors
export const seedInstructors = [
  {
    name: "Sarah Johnson",
    email: "sarah.instructor@learnly.com",
    bio: "Expert React developer with 10+ years experience",
  },
  {
    name: "Mike Chen",
    email: "mike.instructor@learnly.com",
    bio: "Full-stack developer specializing in JavaScript & Node.js",
  },
  {
    name: "Emma Wilson",
    email: "emma.instructor@learnly.com",
    bio: "UI/UX designer and web design educator",
  },
]

// Sample courses
export const seedCourses = [
  {
    title: "React Fundamentals",
    description: "Learn React from scratch. Build interactive user interfaces with this comprehensive course.",
    category: "Web Development",
    price: 49.99,
    rating: 4.8,
    instructorEmail: "sarah.instructor@learnly.com",
    lessons: [
      { title: "Introduction to React", duration: 45 },
      { title: "Components & Props", duration: 60 },
      { title: "State & Hooks", duration: 75 },
      { title: "Handling Events", duration: 50 },
      { title: "Conditional Rendering", duration: 55 },
    ],
  },
  {
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts including closures, async/await, and design patterns.",
    category: "Web Development",
    price: 59.99,
    rating: 4.9,
    instructorEmail: "mike.instructor@learnly.com",
    lessons: [
      { title: "Closures & Scope", duration: 50 },
      { title: "Prototypes & Inheritance", duration: 65 },
      { title: "Async Programming", duration: 80 },
      { title: "Promises & Async/Await", duration: 70 },
      { title: "Error Handling", duration: 45 },
    ],
  },
  {
    title: "Web Design Fundamentals",
    description: "Learn design principles and create beautiful, user-friendly websites.",
    category: "Design",
    price: 39.99,
    rating: 4.7,
    instructorEmail: "emma.instructor@learnly.com",
    lessons: [
      { title: "Design Principles", duration: 45 },
      { title: "Color & Typography", duration: 60 },
      { title: "Layout & Composition", duration: 55 },
      { title: "UX Basics", duration: 50 },
      { title: "Responsive Design", duration: 65 },
    ],
  },
  {
    title: "Data Science 101",
    description: "Introduction to data science, machine learning, and data analysis with Python.",
    category: "Data Science",
    price: 69.99,
    rating: 4.6,
    instructorEmail: "mike.instructor@learnly.com",
    lessons: [
      { title: "Introduction to Data Science", duration: 50 },
      { title: "Python Basics", duration: 70 },
      { title: "Data Analysis with Pandas", duration: 80 },
      { title: "Data Visualization", duration: 65 },
      { title: "Machine Learning Intro", duration: 90 },
    ],
  },
]

// Sample quiz questions for lesson assessment
export const seedQuestions = [
  {
    question: "What is React?",
    type: "multiple_choice",
    options: [
      "A JavaScript library for building user interfaces",
      "A testing framework",
      "A database management system",
      "A CSS preprocessor",
    ],
    correctAnswer: 0,
    points: 10,
  },
  {
    question: "What is JSX?",
    type: "multiple_choice",
    options: ["A syntax extension to JavaScript", "A JavaScript framework", "A CSS library", "A backend language"],
    correctAnswer: 0,
    points: 10,
  },
  {
    question: "Are hooks only for functional components?",
    type: "true_false",
    options: ["True", "False"],
    correctAnswer: 0,
    points: 5,
  },
]

/**
 * INSTRUCTIONS FOR USING THIS SEED DATA:
 *
 * 1. With Prisma:
 *    Create a prisma/seed.ts file and import these functions
 *    Add to package.json:
 *    "prisma": {
 *      "seed": "ts-node prisma/seed.ts"
 *    }
 *    Run: npx prisma db seed
 *
 * 2. With direct database queries:
 *    Use this data to manually create INSERT statements
 *
 * 3. For API testing:
 *    Use this sample data in your integration tests
 */

console.log("[v0] Database seed data ready for import")
console.log("Import these constants in your seed script to populate the database")
