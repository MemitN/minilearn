// ============================================
// STUDENT DASHBOARD
// ============================================
// Main dashboard for students showing enrolled courses, progress, and recommendations

"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, TrendingUp, Award, Clock } from "lucide-react"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  /**
   * Redirect to login if not authenticated
   */
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  /**
   * Sample progress data for charts
   * In a real app, this would come from the backend
   */
  const progressData = [
    { name: "Week 1", progress: 20 },
    { name: "Week 2", progress: 45 },
    { name: "Week 3", progress: 65 },
    { name: "Week 4", progress: 85 },
  ]

  /**
   * Sample enrolled courses
   */
  const enrolledCourses = [
    {
      id: "1",
      title: "React Fundamentals",
      progress: 65,
      lessons: 12,
      completedLessons: 8,
      image: "/react-course.jpg",
    },
    {
      id: "2",
      title: "Advanced JavaScript",
      progress: 45,
      lessons: 15,
      completedLessons: 7,
      image: "/javascript-course.jpg",
    },
    {
      id: "3",
      title: "Web Design Basics",
      progress: 30,
      lessons: 10,
      completedLessons: 3,
      image: "/design-course.jpg",
    },
  ]

  const stats = [
    { icon: BookOpen, label: "Courses Enrolled", value: enrolledCourses.length },
    { icon: TrendingUp, label: "Total Progress", value: "46%" },
    { icon: Award, label: "Certificates Earned", value: "2" },
    { icon: Clock, label: "Learning Hours", value: "24h" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-lg text-muted-foreground">Continue your learning journey and explore new courses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Progress Chart */}
        <Card className="border-border mb-12">
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
            <CardDescription>Your progress over the past month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="progress" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Courses</h2>
            <Button variant="outline" asChild>
              <a href="/courses">Explore More Courses</a>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden border-border hover:border-primary/50 transition-colors">
                {/* Course Image */}
                <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-primary/5">
                  <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {course.completedLessons}/{course.lessons}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <Button className="w-full" size="sm">
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recommended Courses */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Based on your learning history and interests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Recommendations will appear here as you complete courses and update your interests.
              </p>
              <Button asChild>
                <a href="/courses">Browse All Courses</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
