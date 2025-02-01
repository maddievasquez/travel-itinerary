import { Camera } from "lucide-react"
import React from "react"

export function ProfileHeader() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="relative">
          <img
            src="/placeholder.svg?height=128&width=128"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
          <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="ml-6">
          <h2 className="text-2xl font-bold">John Doe</h2>
          <p className="text-gray-600">Travel Enthusiast</p>
        </div>
      </div>
    </div>
  )
}

