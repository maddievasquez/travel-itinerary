import React from "react"
import Activity from "./activity"

interface ActivityData {
  id: string
  time: string
  description: string
}

interface DayProps {
  day: number
  activities: ActivityData[]
  onDelete: (id: string) => void
  onEdit: (id: string, updatedActivity: Omit<ActivityData, "id">) => void
}

export default function Day({ day, activities, onDelete, onEdit }: DayProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-2xl font-semibold text-gray-900">Day {day}</h2>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <Activity
              key={activity.id}
              id={activity.id}
              time={activity.time}
              description={activity.description}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

