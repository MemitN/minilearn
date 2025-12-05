// ============================================
// HOME PAGE
// ============================================
// Landing page showcasing the platform with course highlights, features, and CTAs

"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BookOpen, Award, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  // Feature cards displayed on homepage
  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with real-world experience",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates upon course completion",
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with thousands of learners worldwide",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                Learn Anything,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Anytime</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl leading-relaxed">
                Master new skills with our comprehensive courses, industry experts, and a supportive global community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-lg">
                <Link href="/courses">
                  Explore Courses
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">Start Learning Free</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-12 border-t border-border/50">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground font-medium">Active Students</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-accent">500+</p>
                <p className="text-sm text-muted-foreground font-medium">Expert Courses</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-primary">4.8★</p>
                <p className="text-sm text-muted-foreground font-medium">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-transparent rounded-3xl blur-3xl"></div>
              <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-8 shadow-xl">
                <div className="flex items-center justify-center h-64">
                  <BookOpen className="w-40 h-40 text-primary/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">Why Choose Learnly?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to learn effectively and grow your skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-border hover:border-primary/50 hover:shadow-lg transition-smooth group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-smooth">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="rounded-2xl bg-gradient-to-r from-primary/15 via-accent/10 to-primary/5 border border-primary/20 p-12 md:p-16 text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Ready to Start Learning?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students and start your learning journey today
          </p>
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 shadow-lg">
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border mt-20 py-16 bg-background/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-gradient">Learnly</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering learners worldwide with quality education and expert guidance.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/instructors" className="text-muted-foreground hover:text-primary transition-colors">
                    Instructors
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Learnly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
