"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Edit, User, Globe, MapPin, Calendar, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NavMenu } from "./components/nav-menu.jsx"
import { Dashboard } from "./components/dashboard.jsx"
import { UserProfile } from "./components/user-profile.jsx"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Calendar as DatePickerCalendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ItineraryItem {
  id: number
  day: number
  time: string
  activity: string
}

interface Itinerary {
  id: number
  name: string
  city: string
  startDate: string
  endDate: string
  items: ItineraryItem[]
}

interface Trip {
  id: number
  name: string
  destination: string
  date: string
}

interface UserProfileData {
  name: string
  email: string
  bio: string
  avatar: string
  occupation: string
  pastTrips: Trip[]
}

const cities = [
  "Dublin",
  "New York",
  "London",
  "Paris",
  "Madrid",
  "Tokyo",
  "Los Angeles",
  "Berlin",
  "Toronto",
  "Sydney",
  "Rome",
  "Amsterdam",
  "São Paulo",
]

const cityActivities: { [key: string]: string[] } = {
  Dublin: [
    "Visit Trinity College and see the Book of Kells",
    "Tour the Guinness Storehouse",
    "Explore Dublin Castle",
    "Walk through St. Stephen's Green",
    "Visit the Temple Bar area",
  ],
  "New York": [
    "Visit the Statue of Liberty",
    "Explore Central Park",
    "See a Broadway show",
    "Visit the Metropolitan Museum of Art",
    "Walk across the Brooklyn Bridge",
  ],
  // Add activities for other cities...
}

export default function ItineraryPage() {
  const [currentView, setCurrentView] = useState("home")
  const [itineraries, setItineraries] = useState([])
  const [currentItinerary, setCurrentItinerary] = useState(null)

  const [newItinerary, setNewItinerary] = useState({
    name: "",
    city: "",
    startDate: "",
    endDate: "",
  })

  const [editingActivity, setEditingActivity] = useState(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [newActivity, setNewActivity] = useState({ day: 1, time: "", activity: "" })

  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Avid traveler and adventure seeker. Always planning my next trip!",
    avatar: "/placeholder.svg?height=128&width=128",
    occupation: "Travel Photographer",
    pastTrips: [
      { id: 1, name: "Paris Getaway", destination: "France", date: "June 2022" },
      { id: 2, name: "Tokyo Adventure", destination: "Japan", date: "October 2022" },
      { id: 3, name: "New York City Trip", destination: "United States", date: "December 2022" },
    ],
  })

  const generateItinerary = (city, startDate, endDate) => {
    const activities = cityActivities[city] || []
    const days = differenceInDays(new Date(endDate), new Date(startDate)) + 1
    const items = []

    for (let day = 1; day <= days; day++) {
      const dailyActivities = activities.slice((day - 1) * 3, day * 3)
      dailyActivities.forEach((activity, index) => {
        items.push({
          id: Date.now() + items.length,
          day,
          time: `${10 + index * 2}:00`,
          activity,
        })
      })
    }

    return items
  }

  const addItinerary = () => {
    console.log("Adding itinerary:", newItinerary)
    if (newItinerary.name && newItinerary.city && newItinerary.startDate && newItinerary.endDate) {
      const generatedItems = generateItinerary(newItinerary.city, newItinerary.startDate, newItinerary.endDate)
      const itinerary = {
        id: Date.now(),
        name: newItinerary.name,
        city: newItinerary.city,
        startDate: newItinerary.startDate,
        endDate: newItinerary.endDate,
        items: generatedItems,
      }
      setItineraries([...itineraries, itinerary])
      setCurrentItinerary(itinerary)
      setNewItinerary({ name: "", city: "", startDate: "", endDate: "" })
      setCurrentView("itinerary")
    }
  }

  const addActivity = () => {
    if (currentItinerary && newActivity.time && newActivity.activity) {
      const updatedItinerary = {
        ...currentItinerary,
        items: [
          ...currentItinerary.items,
          {
            id: Date.now(),
            ...newActivity,
          },
        ],
      }
      setItineraries(itineraries.map((i) => (i.id === currentItinerary.id ? updatedItinerary : i)))
      setCurrentItinerary(updatedItinerary)
      setNewActivity({ day: 1, time: "", activity: "" })
    }
  }

  const removeActivity = (id) => {
    if (currentItinerary) {
      const updatedItinerary = {
        ...currentItinerary,
        items: currentItinerary.items.filter((item) => item.id !== id),
      }
      setItineraries(itineraries.map((i) => (i.id === currentItinerary.id ? updatedItinerary : i)))
      setCurrentItinerary(updatedItinerary)
    }
  }

  const editActivity = (activity) => {
    setEditingActivity(activity)
  }

  const saveEditedActivity = () => {
    if (editingActivity && currentItinerary) {
      const updatedItinerary = {
        ...currentItinerary,
        items: currentItinerary.items.map((item) => (item.id === editingActivity.id ? editingActivity : item)),
      }
      setItineraries(itineraries.map((i) => (i.id === currentItinerary.id ? updatedItinerary : i)))
      setCurrentItinerary(updatedItinerary)
      setEditingActivity(null)
    }
  }

  const Home = () => (
    <div className="space-y-8">
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-12 mb-8">
        <h2 className="text-4xl font-bold mb-4">Welcome to Your Travel Planner</h2>
        <p className="text-xl mb-6">Create unforgettable journeys and explore the world with ease.</p>
      </section>

      <section className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <Globe className="mr-2" /> Create New Itinerary
            </CardTitle>
            <CardDescription>Plan your next adventure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="itinerary-name">Itinerary Name</Label>
              <Input
                id="itinerary-name"
                value={newItinerary.name}
                onChange={(e) => setNewItinerary({ ...newItinerary, name: e.target.value })}
                placeholder="Summer Vacation 2025"
              />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Select
                value={newItinerary.city}
                onValueChange={(value) => setNewItinerary({ ...newItinerary, city: value })}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newItinerary.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newItinerary.startDate ? (
                        format(new Date(newItinerary.startDate), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePickerCalendar
                      mode="single"
                      selected={newItinerary.startDate ? new Date(newItinerary.startDate) : undefined}
                      onSelect={(date) =>
                        setNewItinerary({ ...newItinerary, startDate: date ? date.toISOString() : "" })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newItinerary.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newItinerary.endDate ? format(new Date(newItinerary.endDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <DatePickerCalendar
                      mode="single"
                      selected={newItinerary.endDate ? new Date(newItinerary.endDate) : undefined}
                      onSelect={(date) => setNewItinerary({ ...newItinerary, endDate: date ? date.toISOString() : "" })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={addItinerary} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Itinerary
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center">
              <MapPin className="mr-2" /> Your Itineraries
            </CardTitle>
            <CardDescription>View and manage your travel plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {itineraries.map((itinerary) => (
                <li key={itinerary.id}>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      setCurrentItinerary(itinerary)
                      setCurrentView("itinerary")
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="flex-grow">{itinerary.name}</span>
                    <span className="text-sm text-gray-500">{itinerary.city}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {format(new Date(itinerary.startDate), "MMM d")} -{" "}
                      {format(new Date(itinerary.endDate), "MMM d, yyyy")}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => setCurrentView("dashboard")}>
              View All Itineraries
            </Button>
          </CardFooter>
        </Card>
      </section>

      <section className="bg-gray-100 rounded-lg p-8">
        <h3 className="text-2xl font-semibold mb-4">Travel Tips</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Pack Smart</CardTitle>
            </CardHeader>
            <CardContent>
              Make a packing list and stick to it. Roll your clothes to save space and prevent wrinkles.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Stay Connected</CardTitle>
            </CardHeader>
            <CardContent>
              Consider buying a local SIM card or using an international data plan to stay connected while abroad.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Learn Local Phrases</CardTitle>
            </CardHeader>
            <CardContent>
              Learn a few basic phrases in the local language. It can go a long way in making connections with locals.
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )

  const renderItineraryItems = (items) => {
    const groupedByDay = items.reduce((acc, item) => {
      if (!acc[item.day]) {
        acc[item.day] = []
      }
      acc[item.day].push(item)
      return acc
    }, {})

    return Object.entries(groupedByDay)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([day, dayItems]) => (
        <div key={day} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Day {day}</h2>
          <ul className="space-y-4">
            {dayItems
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((item) => (
                <li key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <span className="font-semibold">{item.time}</span> - {item.activity}
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => editActivity(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Activity</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-day" className="text-right">
                              Day
                            </Label>
                            <Input
                              id="edit-day"
                              type="number"
                              min="1"
                              value={editingActivity?.day}
                              onChange={(e) =>
                                setEditingActivity({
                                  ...editingActivity,
                                  day: Number.parseInt(e.target.value),
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-time" className="text-right">
                              Time
                            </Label>
                            <Input
                              id="edit-time"
                              type="time"
                              value={editingActivity?.time}
                              onChange={(e) => setEditingActivity({ ...editingActivity, time: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-activity" className="text-right">
                              Activity
                            </Label>
                            <Input
                              id="edit-activity"
                              type="text"
                              value={editingActivity?.activity}
                              onChange={(e) => setEditingActivity({ ...editingActivity, activity: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={saveEditedActivity}>Save Changes</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="icon" onClick={() => removeActivity(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      ))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <NavMenu onNavigate={(view) => setCurrentView(view)} currentView={currentView} />
            <h1 className="text-3xl font-bold ml-4">My Travel Planner</h1>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                    <AvatarFallback>
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">
            {currentView === "home" && "Home"}
            {currentView === "itinerary" && "Itinerary"}
            {currentView === "dashboard" && "Dashboard"}
          </h2>
        </div>
        {currentView === "dashboard" ? (
          <Dashboard itineraries={itineraries} />
        ) : currentView === "home" ? (
          <Home />
        ) : currentItinerary ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {currentItinerary.name} - {currentItinerary.city}
              </h2>
              <p className="text-gray-600 mb-4">
                {format(new Date(currentItinerary.startDate), "MMMM d, yyyy")} -{" "}
                {format(new Date(currentItinerary.endDate), "MMMM d, yyyy")}
              </p>
              {renderItineraryItems(currentItinerary.items)}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">No Itinerary Selected</h2>
            <p>Please select an itinerary from the home page or create a new one.</p>
          </div>
        )}
      </main>

      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <UserProfile initialProfile={userProfile} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

