// ============================================
// CREATE/EDIT COURSE PAGE
// ============================================
// Form for instructors to create new courses or edit existing ones
// Includes course title, description, category, price, and lesson management

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseCategory } from "@/lib/types"
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"

export default function CreateCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Course form state
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: CourseCategory.WEB_DEVELOPMENT,
    price: 0,
    image: "",
  })

  // Lessons array state
  const [lessons, setLessons] = useState<any[]>([{ id: 1, title: "", duration: 0, content: "", videoUrl: "" }])

  /**
   * Handle course input change
   * Updates the course state when form fields change
   */
  const handleCourseChange = (field: string, value: any) => {
    setCourse((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Handle lesson input change
   * Updates specific lesson in the lessons array
   */
  const handleLessonChange = (index: number, field: string, value: string) => {
    const newLessons = [...lessons]
    newLessons[index] = { ...newLessons[index], [field]: value }
    setLessons(newLessons)
  }

  /**
   * Add new lesson to course
   */
  const addLesson = () => {
    const newId = Math.max(...lessons.map((l) => l.id), 0) + 1
    setLessons([...lessons, { id: newId, title: "", duration: 0, content: "", videoUrl: "" }])
  }

  /**
   * Remove lesson from course
   */
  const removeLesson = (index: number) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index))
    }
  }

  /**
   * Handle course creation/update submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Filter out empty lessons
      const validLessons = lessons.filter((l) => l.title.trim())

      if (!course.title.trim() || validLessons.length === 0) {
        alert("Please fill in course title and at least one lesson")
        return
      }

      // In a real app, this would send to backend API
      console.log("[v0] Creating course:", { course, lessons: validLessons })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      alert("Course created successfully!")
      router.push("/instructor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Course</h1>
            <p className="text-muted-foreground">Set up your course with lessons and content</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Information */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
              <CardDescription>Basic details about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-2 block">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g., Advanced React Patterns"
                  value={course.title}
                  onChange={(e) => handleCourseChange("title", e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <textarea
                  placeholder="Describe what students will learn..."
                  value={course.description}
                  onChange={(e) => handleCourseChange("description", e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              {/* Category and Price */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={course.category}
                    onChange={(e) => handleCourseChange("category", e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    {Object.values(CourseCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price ($)</label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0 for free"
                      value={course.price}
                      onChange={(e) => handleCourseChange("price", Number.parseFloat(e.target.value))}
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons */}
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Course Lessons</CardTitle>
                <CardDescription>Add lessons that make up your course</CardDescription>
              </div>
              <Button type="button" size="sm" onClick={addLesson} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Lesson
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="p-4 border border-border rounded-lg space-y-4">
                  {/* Lesson Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Lesson {index + 1}</h4>
                    {lessons.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLesson(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Lesson Title */}
                  <input
                    type="text"
                    placeholder="Lesson title"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  {/* Duration */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Duration (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="45"
                        value={lesson.duration}
                        onChange={(e) => handleLessonChange(index, "duration", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Video URL (optional)</label>
                      <input
                        type="url"
                        placeholder="https://youtube.com/..."
                        value={lesson.videoUrl}
                        onChange={(e) => handleLessonChange(index, "videoUrl", e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Lesson Content</label>
                    <textarea
                      placeholder="Write your lesson content here..."
                      value={lesson.content}
                      onChange={(e) => handleLessonChange(index, "content", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating Course..." : "Create Course"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
