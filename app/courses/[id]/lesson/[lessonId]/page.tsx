// ============================================
// LESSON PLAYER PAGE
// ============================================
// Video/content player for individual lessons with progress tracking

"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { ArrowLeft, CheckCircle2, Download, MessageSquare } from "lucide-react"

export default function LessonPage({
  params,
}: {
  params: { id: string; lessonId: string }
}) {
  const { user, isAuthenticated } = useAuth()
  const [completed, setCompleted] = useState(false)

  // Mock lesson data
  const lesson = {
    id: params.lessonId,
    title: "Introduction to React Components",
    courseTitle: "React Fundamentals",
    duration: 45,
    order: 1,
    content: `
      React is a JavaScript library for building user interfaces with components.
      In this lesson, we'll explore:
      
      1. What are React Components?
      Components are reusable pieces of UI. They can be functions or classes.
      
      2. Functional Components
      The modern way to write React components using JavaScript functions.
      
      3. Component Props
      Props are how you pass data into components, making them configurable.
      
      4. Component State
      State allows components to manage data that changes over time.
      
      Remember: Components are just functions that return JSX!
    `,
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    resources: [
      { name: "React Docs", url: "#" },
      { name: "Component Cheatsheet.pdf", url: "#" },
      { name: "Code Examples.zip", url: "#" },
    ],
  }

  // Mock related lessons
  const relatedLessons = [
    { id: "1", title: "Getting Started with React", completed: true },
    { id: "2", title: "JSX Basics", completed: true },
    { id: "3", title: "Introduction to React Components", completed: false, current: true },
    { id: "4", title: "Props and State", completed: false },
    { id: "5", title: "Hooks Introduction", completed: false },
  ]

  /**
   * Mark lesson as complete
   */
  const handleCompleteLesson = () => {
    setCompleted(true)
    // In a real app, this would call the backend API
    console.log("[v0] Lesson marked as complete:", lesson.id)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Link href={`/courses/${params.id}`}>
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Button>
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Video Player */}
            <div className="space-y-4">
              <div className="relative w-full bg-black rounded-lg overflow-hidden aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={lesson.videoUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Lesson Title and Controls */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
                  <p className="text-muted-foreground">
                    Lesson {lesson.order} • {lesson.duration} minutes
                  </p>
                </div>

                {/* Complete Button */}
                <Button size="lg" onClick={handleCompleteLesson} disabled={completed} className="gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  {completed ? "Completed" : "Mark Complete"}
                </Button>
              </div>
            </div>

            {/* Lesson Content */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Lesson Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{lesson.content}</p>
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lesson.resources.map((resource, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start gap-2 bg-transparent"
                        asChild
                      >
                        <a href={resource.url}>
                          <Download className="w-4 h-4" />
                          {resource.name}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussion Section */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Discussion
                </CardTitle>
                <CardDescription>Ask questions or share insights with other students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    placeholder="Post a question or comment..."
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <Button>Post Comment</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <Card className="border-border sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">{lesson.courseTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedLessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/courses/${params.id}/lesson/${l.id}`}
                    className={`block p-3 rounded-lg transition-colors ${
                      l.current
                        ? "bg-primary/10 border border-primary text-primary"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {l.completed && <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0 text-green-600" />}
                      <div className="text-sm font-medium line-clamp-2">{l.title}</div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
