"use client"
import { LeftSidebar } from "@/components/left-sidebar"
import { RightSidebar } from "@/components/right-sidebar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileDetails } from "@/components/profile-details"
import { TravelPreferences } from "@/components/travel-preferences"
import { PastTrips } from "@/components/past-trips"
import React from "react"

export default function ProfilePage() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <main className="flex-grow overflow-auto bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>
          <div className="space-y-8">
            <ProfileHeader />
            <ProfileDetails />
            <TravelPreferences />
            <PastTrips />
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  )
}

