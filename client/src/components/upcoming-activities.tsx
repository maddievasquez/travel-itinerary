import React from "react"

const activities = [
  { time: "09:00 AM", description: "Eiffel Tower Visit" },
  { time: "12:00 PM", description: "Lunch at Le Petit Café" },
  { time: "02:00 PM", description: "Louvre Museum Tour" },
  { time: "06:00 PM", description: "Seine River Cruise" },
]

export function UpcomingActivities() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upcoming Activities</h2>
      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="text-blue-500 font-medium">{activity.time}</span>
            <span>{activity.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

