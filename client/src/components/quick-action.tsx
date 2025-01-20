import React from "react"
import { PlusCircle, Edit, Download, Share2 } from "lucide-react"

export function QuickActions() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Activity
        </button>
        <button className="flex items-center justify-center p-3 bg-green-500 text-white rounded-md hover:bg-green-600">
          <Edit className="w-5 h-5 mr-2" />
          Edit Itinerary
        </button>
        <button className="flex items-center justify-center p-3 bg-purple-500 text-white rounded-md hover:bg-purple-600">
          <Download className="w-5 h-5 mr-2" />
          Download PDF
        </button>
        <button className="flex items-center justify-center p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600">
          <Share2 className="w-5 h-5 mr-2" />
          Share Trip
        </button>
      </div>
    </div>
  )
}

