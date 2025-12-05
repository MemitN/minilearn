// ============================================
// INSTRUCTOR DASHBOARD
// ============================================
// Dashboard for instructors to manage courses, view analytics, and monitor student progress

"use client"

import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, Users, DollarSign, TrendingUp, Plus } from "lucide-react"

export default function InstructorPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  /**
   * Check if user is instructor before rendering
   */
  if (!isAuthenticated || user?.role !== "instructor") {
    router.push("/login")
    return null
  }

  /**
   * Sample instructor analytics
   */
  const enrollmentData = [
    { month: "Jan", enrollments: 120 },
    { month: "Feb", enrollments: 250 },
    { month: "Mar", enrollments: 400 },
    { month: "Apr", enrollments: 580 },
    { month: "May", enrollments: 720 },
    { month: "Jun", enrollments: 950 },
  ]

  const coursePerformance = [
    { name: "React Basics", rating: 4.8, students: 1250 },
    { name: "JavaScript Pro", rating: 4.6, students: 890 },
    { name: "Web Design", rating: 4.7, students: 650 },
  ]

  const stats = [
    { icon: BookOpen, label: "Active Courses", value: "3" },
    { icon: Users, label: "Total Students", value: "2,790" },
    { icon: DollarSign, label: "Total Revenue", value: "$24,500" },
    { icon: TrendingUp, label: "Avg. Rating", value: "4.7★" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Instructor Dashboard</h1>
            <p className="text-lg text-muted-foreground">Manage your courses and monitor student progress</p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Course
          </Button>
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

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Enrollment Trend */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Enrollment Trend</CardTitle>
              <CardDescription>Student enrollments over the past 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
              <CardDescription>Revenue by course</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coursePerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar dataKey="students" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Course Management */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>
          <div className="space-y-4">
            {coursePerformance.map((course, index) => (
              <Card key={index} className="border-border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{course.name}</CardTitle>
                      <CardDescription>{course.students} students enrolled</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{course.rating}★</p>
                      <p className="text-xs text-muted-foreground">{course.students} reviews</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button variant="outline" size="sm">
                    Edit Course
                  </Button>
                  <Button variant="outline" size="sm">
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
