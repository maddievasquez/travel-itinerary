"use client"

import React from "react"
import { LeftSidebar } from "./components/left-sidebar"
import { RightSidebar } from "./components/right-sidebar"
import { TripOverview } from "./components/trip-overview"
import { QuickActions } from "./components/quick-action"
import { UpcomingActivities } from "./components/upcoming-activities"
import { WeatherForecast } from "./components/weather-forecast"

export default function Dashboard() {
  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <main className="flex-grow overflow-auto bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Travel Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TripOverview />
            <QuickActions />
            <UpcomingActivities />
            <WeatherForecast />
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  )
}

