// ============================================
// COURSES LISTING PAGE
// ============================================
// Displays all available courses with filtering, search, and sorting options

"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useCourses } from "@/lib/use-courses"
import { CourseCategory, type SearchFilters } from "@/lib/types"
import { Star, Users, Clock, Loader2, Search } from "lucide-react"

export default function CoursesPage() {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch courses with current filters
  const { courses, loading, error } = useCourses(filters)

  /**
   * Handle search submission
   * Updates filters with search query
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({ ...prev, query: searchQuery }))
  }

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === "all" ? undefined : (category as CourseCategory),
    }))
  }

  /**
   * Handle sort option change
   */
  const handleSort = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as any,
    }))
  }

  const categories = Object.values(CourseCategory)
  const sortOptions = ["newest", "popular", "rating", "price"]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Explore Courses</h1>
          <p className="text-lg text-muted-foreground">Discover thousands of courses in various categories</p>
        </div>

        {/* Search and Filters */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-semibold mb-4">Search Courses</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm" type="submit">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className="block w-full text-left px-3 py-2 rounded hover:bg-primary/10 transition-colors text-sm font-medium"
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-primary/10 transition-colors text-sm"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <h3 className="font-semibold mb-4">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSort(option)}
                    className="block w-full text-left px-3 py-2 rounded hover:bg-primary/10 transition-colors text-sm capitalize"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              // Loading state
              <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading courses...</p>
                </div>
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Error loading courses: {error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            ) : courses.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No courses found. Try adjusting your filters.</p>
              </div>
            ) : (
              // Courses grid
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <Card className="h-full border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer">
                      {/* Course Image */}
                      <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden">
                        {course.image && (
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            {course.category}
                          </span>
                          {course.price === 0 && (
                            <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Instructor */}
                        <div className="text-sm">
                          <p className="text-muted-foreground">
                            by <span className="font-medium text-foreground">{course.instructor?.name}</span>
                          </p>
                        </div>

                        {/* Course Stats */}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{course.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{course.studentCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{course.lessons?.length || 0} lessons</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="border-t border-border pt-4">
                          {course.price === 0 ? (
                            <p className="text-lg font-bold text-green-600">Free</p>
                          ) : (
                            <p className="text-lg font-bold">${course.price}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
