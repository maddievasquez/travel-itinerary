import React from "react"
import { Sun, Cloud, CloudRain } from "lucide-react"

const forecast = [
  { day: "Mon", icon: Sun, temp: "22°C" },
  { day: "Tue", icon: Cloud, temp: "19°C" },
  { day: "Wed", icon: CloudRain, temp: "18°C" },
  { day: "Thu", icon: Sun, temp: "23°C" },
  { day: "Fri", icon: Cloud, temp: "20°C" },
]

export function WeatherForecast() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Weather Forecast</h2>
      <div className="flex justify-between">
        {forecast.map((day, index) => (
          <div key={index} className="text-center">
            <div className="font-medium">{day.day}</div>
            <day.icon className="w-8 h-8 mx-auto my-2 text-blue-500" />
            <div>{day.temp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

