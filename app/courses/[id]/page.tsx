// ============================================
// COURSE DETAIL PAGE
// ============================================
// Full course page with lessons, descriptions, instructor info, and enrollment

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCourseById } from "@/lib/use-courses"
import { useAuth } from "@/lib/auth-context"
import { Star, Clock, Users, BookOpen, ArrowLeft, Loader2, Share2 } from "lucide-react"

export default function CourseDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { course, loading, error } = useCourseById(params.id)
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  /**
   * Handle course enrollment
   * In a real app, this would call the enrollment API
   */
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setEnrolling(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEnrolled(true)
      alert("Successfully enrolled in course!")
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">Course not found</p>
            <Button onClick={() => router.push("/courses")}>Back to Courses</Button>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Calculate course stats
   */
  const totalDuration = course.lessons?.reduce((sum: number, lesson: any) => sum + (lesson.duration || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/courses">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-3">
                    {course.category}
                  </span>
                  <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                </div>
              </div>

              {/* Instructor Info */}
              {course.instructor && (
                <div className="flex items-center gap-4 py-4 border-y border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-semibold text-primary">{course.instructor.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              )}

              {/* Course Stats */}
              <div className="grid grid-cols-4 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{course.rating}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Students</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{course.studentCount}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{totalDuration}h</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                  <div className="flex items-center gap-1 mt-1">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">{course.lessons?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
              <div className="space-y-2">
                {course.lessons?.map((lesson: any, index: number) => (
                  <Card key={lesson.id} className="border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">
                            {index + 1}. {lesson.title}
                          </p>
                          <p className="text-sm text-muted-foreground">{lesson.duration} min</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {enrolled ? "Start" : "Preview"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Instructor Bio */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>About the Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {course.instructor?.bio || "Expert instructor with years of experience in this field."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Enrollment Card */}
          <div>
            <Card className="border-border sticky top-20">
              <CardContent className="pt-6 space-y-4">
                {/* Price */}
                <div className="text-center">
                  {course.price === 0 ? (
                    <p className="text-3xl font-bold text-green-600">Free</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-4xl font-bold">${course.price}</p>
                    </>
                  )}
                </div>

                {/* Enroll Button */}
                <Button size="lg" className="w-full" onClick={handleEnroll} disabled={enrolling || enrolled}>
                  {enrolling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {enrolled ? "Already Enrolled" : "Enroll Now"}
                </Button>

                {/* Share Button */}
                <Button size="lg" variant="outline" className="w-full gap-2 bg-transparent">
                  <Share2 className="w-4 h-4" />
                  Share Course
                </Button>

                {/* Course Highlights */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>{course.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{totalDuration}+ hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{course.studentCount} students</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="pt-4 border-t border-border text-xs text-muted-foreground space-y-2">
                  <p>✓ Lifetime access</p>
                  <p>✓ Certificate of completion</p>
                  <p>✓ 30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
