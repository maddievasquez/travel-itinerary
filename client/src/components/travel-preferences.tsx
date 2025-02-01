"use client"

import React from "react"
import { useState } from "react"

export function TravelPreferences() {
  const [preferences, setPreferences] = useState({
    travelStyle: "Adventure",
    favoriteDestinations: "",
    dietaryRestrictions: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Travel preferences submitted:", preferences)
    // Here you would typically send the data to your backend
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Travel Preferences</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="travelStyle" className="block text-sm font-medium text-gray-700">
            Preferred Travel Style
          </label>
          <select
            id="travelStyle"
            name="travelStyle"
            value={preferences.travelStyle}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option>Adventure</option>
            <option>Relaxation</option>
            <option>Cultural</option>
            <option>Luxury</option>
          </select>
        </div>
        <div>
          <label htmlFor="favoriteDestinations" className="block text-sm font-medium text-gray-700">
            Favorite Destinations
          </label>
          <input
            type="text"
            id="favoriteDestinations"
            name="favoriteDestinations"
            value={preferences.favoriteDestinations}
            onChange={handleChange}
            placeholder="E.g., Paris, Tokyo, New York"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="dietaryRestrictions" className="block text-sm font-medium text-gray-700">
            Dietary Restrictions
          </label>
          <input
            type="text"
            id="dietaryRestrictions"
            name="dietaryRestrictions"
            value={preferences.dietaryRestrictions}
            onChange={handleChange}
            placeholder="E.g., Vegetarian, Gluten-free"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Update Preferences
      </button>
    </form>
  )
}

