"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Mail, Briefcase, Edit2, Check, X } from "lucide-react"

export function UserProfile({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <CardHeader className="relative pb-0">
          <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end pt-4">
            {isEditing ? (
              <div className="space-x-2">
                <Button size="sm" onClick={handleSubmit}>
                  <Check className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="text-2xl font-bold"
                />
              ) : (
                <h2 className="text-2xl font-bold">{profile.name}</h2>
              )}
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                {isEditing ? (
                  <Input id="email" name="email" type="email" value={profile.email} onChange={handleInputChange} />
                ) : (
                  profile.email
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Briefcase className="w-4 h-4 mr-2" />
                {isEditing ? (
                  <Input id="occupation" name="occupation" value={profile.occupation} onChange={handleInputChange} />
                ) : (
                  profile.occupation
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-gray-700">{profile.bio}</p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Trips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile.pastTrips.map((trip) => (
              <div key={trip.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {trip.destination.slice(0, 2)}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{trip.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{trip.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

