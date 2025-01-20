"use client"

import React from "react"
import { useState } from "react"

interface AddActivityFormProps {
  onAdd: (newActivity: { time: string; description: string }) => void
}

export default function AddActivityForm({ onAdd }: AddActivityFormProps) {
  const [time, setTime] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (time && description) {
      onAdd({ time, description })
      setTime("")
      setDescription("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4 bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Add New Activity</h3>
      <input
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Time (e.g., 09:00 AM)"
        required
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Activity description"
        required
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Activity
      </button>
    </form>
  )
}

