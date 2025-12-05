// ============================================
// API CLIENT UTILITY
// ============================================
// This file provides functions to communicate with the backend API.
// It handles authentication tokens, error handling, and common HTTP patterns.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

/**
 * Generic fetch wrapper that handles:
 * - Adding authentication tokens
 * - Error handling and status checking
 * - JSON serialization/deserialization
 */
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get token from localStorage if it exists
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add authentication token to requests if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Check if response is ok (200-299 status codes)
    if (!response.ok) {
      // Log error for debugging
      console.error(`[API Error] ${response.status}: ${response.statusText}`)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    // Parse and return JSON response
    const data = await response.json()
    return data
  } catch (error) {
    console.error("[API Client Error]", error)
    throw error
  }
}

/**
 * Authentication API calls
 */
export const authAPI = {
  // Register a new user
  register: async (email: string, password: string, name: string, role: string) => {
    return apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, role }),
    })
  },

  // Login existing user
  login: async (email: string, password: string) => {
    return apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  // Get current user profile
  getCurrentUser: async () => {
    return apiCall("/auth/me")
  },

  // Logout user
  logout: async () => {
    localStorage.removeItem("token")
  },
}

/**
 * Courses API calls
 */
export const coursesAPI = {
  // Get all courses with optional filtering
  getAll: async (filters?: any) => {
    const params = new URLSearchParams()
    if (filters?.query) params.append("query", filters.query)
    if (filters?.category) params.append("category", filters.category)
    if (filters?.sortBy) params.append("sortBy", filters.sortBy)

    return apiCall(`/courses?${params.toString()}`)
  },

  // Get single course by ID
  getById: async (id: string) => {
    return apiCall(`/courses/${id}`)
  },

  // Create new course (instructor only)
  create: async (data: any) => {
    return apiCall("/courses", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update course (instructor only)
  update: async (id: string, data: any) => {
    return apiCall(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete course (instructor only)
  delete: async (id: string) => {
    return apiCall(`/courses/${id}`, {
      method: "DELETE",
    })
  },
}

/**
 * Lessons API calls
 */
export const lessonsAPI = {
  // Get all lessons for a course
  getByCourse: async (courseId: string) => {
    return apiCall(`/courses/${courseId}/lessons`)
  },

  // Get single lesson
  getById: async (lessonId: string) => {
    return apiCall(`/lessons/${lessonId}`)
  },

  // Create new lesson
  create: async (courseId: string, data: any) => {
    return apiCall(`/courses/${courseId}/lessons`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update lesson
  update: async (lessonId: string, data: any) => {
    return apiCall(`/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Delete lesson
  delete: async (lessonId: string) => {
    return apiCall(`/lessons/${lessonId}`, {
      method: "DELETE",
    })
  },
}

/**
 * Progress API calls
 */
export const progressAPI = {
  // Get user's progress in a course
  getCourseProgress: async (courseId: string) => {
    return apiCall(`/progress/courses/${courseId}`)
  },

  // Mark lesson as completed
  markLessonComplete: async (lessonId: string) => {
    return apiCall(`/progress/lessons/${lessonId}/complete`, {
      method: "POST",
    })
  },

  // Update lesson progress (e.g., watch time)
  updateProgress: async (lessonId: string, data: any) => {
    return apiCall(`/progress/lessons/${lessonId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

/**
 * Enrollment API calls
 */
export const enrollmentAPI = {
  // Enroll in a course
  enroll: async (courseId: string) => {
    return apiCall(`/courses/${courseId}/enroll`, {
      method: "POST",
    })
  },

  // Get user's enrollments
  getMyEnrollments: async () => {
    return apiCall("/enrollments")
  },

  // Check if user is enrolled in a course
  isEnrolled: async (courseId: string) => {
    return apiCall(`/enrollments/check/${courseId}`)
  },
}

/**
 * Quiz API calls
 */
export const quizAPI = {
  // Get quiz details
  getById: async (quizId: string) => {
    return apiCall(`/quizzes/${quizId}`)
  },

  // Submit quiz answers
  submit: async (quizId: string, answers: Record<string, any>) => {
    return apiCall(`/quizzes/${quizId}/submit`, {
      method: "POST",
      body: JSON.stringify({ answers }),
    })
  },

  // Get user's quiz submission
  getUserSubmission: async (quizId: string) => {
    return apiCall(`/quizzes/${quizId}/submission`)
  },
}
