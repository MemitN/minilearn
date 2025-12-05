// ============================================
// LEARNLY TYPE DEFINITIONS
// ============================================
// This file contains all TypeScript interfaces and types used throughout the application.
// Understanding these types is crucial as they define the structure of data flowing through the app.

/**
 * User Types - Define different user roles in the system
 * Each role has different permissions and access levels
 */
export enum UserRole {
  STUDENT = "student",
  INSTRUCTOR = "instructor",
  ADMIN = "admin",
}

/**
 * Core User Interface
 * Represents a user in the system with their profile and authentication details
 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  profileImage?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

/**
 * Authentication Response
 * Returned when user logs in or registers successfully
 */
export interface AuthResponse {
  user: User
  token: string
}

/**
 * Course Types - Define course structure and related data
 */
export interface Course {
  id: string
  title: string
  description: string
  category: CourseCategory
  price: number // 0 for free courses
  image?: string
  instructorId: string
  instructor?: User
  rating: number // 0-5 stars
  reviewCount: number
  studentCount: number
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
}

/**
 * Course Category Enum
 * Predefined categories to organize courses
 */
export enum CourseCategory {
  WEB_DEVELOPMENT = "Web Development",
  MOBILE_DEVELOPMENT = "Mobile Development",
  DATA_SCIENCE = "Data Science",
  AI_ML = "AI & Machine Learning",
  DESIGN = "Design",
  BUSINESS = "Business",
  MARKETING = "Marketing",
  OTHER = "Other",
}

/**
 * Lesson Interface
 * A lesson is the smallest unit of content within a course
 */
export interface Lesson {
  id: string
  courseId: string
  title: string
  description: string
  content: string // For text-based lessons
  videoUrl?: string // For video lessons
  duration: number // in minutes
  order: number // Position in course
  resources?: string[] // Links to downloadable resources
  createdAt: string
  updatedAt: string
}

/**
 * Quiz and Question Types
 * Used for assessments and testing student knowledge
 */
export interface Quiz {
  id: string
  lessonId: string
  title: string
  description: string
  questions: Question[]
  passingScore: number // Percentage needed to pass (0-100)
  createdAt: string
  updatedAt: string
}

export interface Question {
  id: string
  quizId: string
  type: QuestionType
  question: string
  options: string[] // For multiple choice
  correctAnswer: string | number // Index for multiple choice, text for essay
  explanation?: string // Why this is correct
  points: number
  order: number
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
  TRUE_FALSE = "true_false",
  SHORT_ANSWER = "short_answer",
  ESSAY = "essay",
}

/**
 * User Progress Types
 * Track student progress through courses and lessons
 */
export interface UserProgress {
  id: string
  userId: string
  courseId: string
  lessonId: string
  completed: boolean
  completedAt?: string
  watchedDuration?: number // in seconds, for video lessons
  score?: number // Quiz score if applicable
  attempts?: number // Number of quiz attempts
}

/**
 * Course Enrollment
 * Links students to courses they're enrolled in
 */
export interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: string
  certificateIssued?: boolean
  certificateIssuedAt?: string
  progress: number // Percentage completed (0-100)
}

/**
 * Quiz Submission
 * Records when a student submits a quiz attempt
 */
export interface QuizSubmission {
  id: string
  userId: string
  quizId: string
  answers: Record<string, string | number>
  score: number
  passed: boolean
  submittedAt: string
}

/**
 * Course Review
 * Allows students to rate and review courses
 */
export interface CourseReview {
  id: string
  courseId: string
  userId: string
  rating: number // 1-5 stars
  title: string
  comment: string
  createdAt: string
  updatedAt: string
}

/**
 * Instructor Analytics
 * Data displayed on instructor dashboard
 */
export interface InstructorAnalytics {
  totalStudents: number
  totalRevenue: number
  averageRating: number
  courseCompletion: number // Percentage
  enrollmentTrend: Array<{ date: string; count: number }>
  topCourse: Course
}

/**
 * Search Filter Options
 * Used when searching and filtering courses
 */
export interface SearchFilters {
  query?: string
  category?: CourseCategory
  minPrice?: number
  maxPrice?: number
  minRating?: number
  sortBy?: "newest" | "popular" | "rating" | "price"
}
