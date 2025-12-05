// ============================================
// COURSES HOOK
// ============================================
// Custom hook for fetching and managing courses
// Demonstrates data fetching patterns in modern React

"use client"

import { useEffect, useState } from "react"
import type { Course, SearchFilters } from "./types"
import { coursesAPI } from "./api-client"

/**
 * useCourses Hook
 * Fetches courses from API with support for filtering and searching
 *
 * Usage:
 * const { courses, loading, error } = useCourses({ category: 'Web Development' });
 */
export function useCourses(filters?: SearchFilters) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        // Call API with filters
        const data = await coursesAPI.getAll(filters)
        setCourses(data)
      } catch (err) {
        console.error("Failed to fetch courses:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch courses")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [filters]) // Updated to use the entire filters object as a dependency

  return { courses, loading, error }
}

/**
 * useCourseById Hook
 * Fetches a single course by ID
 *
 * Usage:
 * const { course, loading } = useCourseById('course-123');
 */
export function useCourseById(courseId: string | null) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(!!courseId)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!courseId) {
      setCourse(null)
      setLoading(false)
      return
    }

    const fetchCourse = async () => {
      try {
        setLoading(true)
        const data = await coursesAPI.getById(courseId)
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course")
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId])

  return { course, loading, error }
}
