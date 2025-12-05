// ============================================
// USER PROFILE & SETTINGS PAGE
// ============================================
// Allow users to view and edit their profile information, preferences, and certificates

"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { User, Mail, Award, Settings, Save, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Passionate learner interested in web development",
    website: "https://example.com",
  })

  // Certificates (mock data)
  const certificates = [
    { id: "1", course: "React Fundamentals", issuedDate: "2025-01-15" },
    { id: "2", course: "Advanced JavaScript", issuedDate: "2024-12-20" },
  ]

  /**
   * Check if user is authenticated
   */
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  /**
   * Handle profile input change
   */
  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Save profile changes
   */
  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // In a real app, this would call the backend API
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setEditing(false)
      alert("Profile updated successfully!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My Profile</h1>
          <p className="text-lg text-muted-foreground">Manage your account and view your learning achievements</p>
        </div>

        {/* Profile Picture and Basic Info */}
        <Card className="border-border mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-12 h-12 text-primary" />
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Member since January 2025</p>
              </div>

              {/* Edit Button */}
              <Button variant={editing ? "default" : "outline"} onClick={() => setEditing(!editing)} className="gap-2">
                <Settings className="w-4 h-4" />
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={!editing}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange("email", e.target.value)}
                disabled={!editing}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium mb-2 block">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                disabled={!editing}
                rows={4}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Website */}
            <div>
              <label className="text-sm font-medium mb-2 block">Website</label>
              <input
                type="url"
                value={profile.website}
                onChange={(e) => handleChange("website", e.target.value)}
                disabled={!editing}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Save Button */}
            {editing && (
              <Button onClick={handleSaveProfile} disabled={loading} className="gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="border-border mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              My Certificates
            </CardTitle>
            <CardDescription>Certificates earned from completed courses</CardDescription>
          </CardHeader>
          <CardContent>
            {certificates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No certificates yet. Complete a course to earn your first certificate!
              </p>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{cert.course}</p>
                      <p className="text-sm text-muted-foreground">
                        Issued on {new Date(cert.issuedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account security and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              Connected Devices
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
