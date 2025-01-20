import React from "react"
import Link from "next/link"
import { Home, Calendar, Map, Menu } from "lucide-react"

export function LeftSidebar() {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">Travel Planner</h2>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center p-2 hover:bg-gray-200 rounded">
              <Home className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/itinerary" className="flex items-center p-2 hover:bg-gray-200 rounded">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Itinerary</span>
            </Link>
          </li>
          <li>
            <Link href="/map" className="flex items-center p-2 hover:bg-gray-200 rounded">
              <Map className="mr-2 h-4 w-4" />
              <span>Map</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}

