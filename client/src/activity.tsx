"use client"

import React, { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

interface ActivityProps {
  id: string
  time: string
  description: string
  onDelete: (id: string) => void
  onEdit: (id: string, updatedActivity: { time: string; description: string }) => void
}

export default function Activity({ id, time, description, onDelete, onEdit }: ActivityProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTime, setEditedTime] = useState(time)
  const [editedDescription, setEditedDescription] = useState(description)

  const handleEdit = () => {
    onEdit(id, { time: editedTime, description: editedDescription })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <li className="px-4 py-4 sm:px-6">
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={editedTime}
            onChange={(e) => setEditedTime(e.target.value)}
            placeholder="Time"
            className="border rounded p-2"
          />
          <input
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            placeholder="Description"
            className="border rounded p-2"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-indigo-600 truncate">{time}</p>
        <div className="ml-2 flex-shrink-0 flex space-x-2">
          <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-500">
            <Pencil className="h-5 w-5" />
          </button>
          <button onClick={() => onDelete(id)} className="text-gray-400 hover:text-gray-500">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </li>
  )
}

