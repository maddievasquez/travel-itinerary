"use client"

import React, { useState } from "react"
import { LeftSidebar } from "./components/left-sidebar"
import { RightSidebar } from "./components/right-sidebar"
import Day from "./day"
import AddActivityForm from "./add-activity-form"

interface Activity {
  id: string
  time: string
  description: string
}

interface DayData {
  day: number
  activities: Activity[]
}

const initialItineraryData: DayData[] = [
  {
    day: 1,
    activities: [
      { id: "1-1", time: "09:00 AM", description: "Arrival and Hotel Check-in" },
      { id: "1-2", time: "11:00 AM", description: "City Tour" },
      { id: "1-3", time: "02:00 PM", description: "Lunch at Local Restaurant" },
    ],
  },
  {
    day: 2,
    activities: [
      { id: "2-1", time: "08:00 AM", description: "Breakfast at Hotel" },
      { id: "2-2", time: "10:00 AM", description: "Hiking Trip" },
      { id: "2-3", time: "01:00 PM", description: "Picnic Lunch" },
    ],
  },
]

export default function Itinerary() {
  const [itineraryData, setItineraryData] = useState<DayData[]>(initialItineraryData)

  const addActivity = (dayIndex: number, newActivity: Omit<Activity, "id">) => {
    setItineraryData((prevData) => {
      const newData = [...prevData]
      const newId = `${dayIndex + 1}-${newData[dayIndex].activities.length + 1}`
      newData[dayIndex].activities.push({ ...newActivity, id: newId })
      return newData
    })
  }

  const deleteActivity = (dayIndex: number, activityId: string) => {
    setItineraryData((prevData) => {
      const newData = [...prevData]
      newData[dayIndex].activities = newData[dayIndex].activities.filter((activity) => activity.id !== activityId)
      return newData
    })
  }

  const editActivity = (dayIndex: number, activityId: string, updatedActivity: Omit<Activity, "id">) => {
    setItineraryData((prevData) => {
      const newData = [...prevData]
      const activityIndex = newData[dayIndex].activities.findIndex((activity) => activity.id === activityId)
      if (activityIndex !== -1) {
        newData[dayIndex].activities[activityIndex] = { ...updatedActivity, id: activityId }
      }
      return newData
    })
  }

  return (
    <div className="flex h-screen">
      <LeftSidebar />
      <main className="flex-grow overflow-auto bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Your Travel Itinerary</h1>
          <div className="space-y-8">
            {itineraryData.map((day, index) => (
              <React.Fragment key={day.day}>
                <Day
                  day={day.day}
                  activities={day.activities}
                  onDelete={(activityId) => deleteActivity(index, activityId)}
                  onEdit={(activityId, updatedActivity) => editActivity(index, activityId, updatedActivity)}
                />
                <AddActivityForm onAdd={(newActivity) => addActivity(index, newActivity)} />
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  )
}

