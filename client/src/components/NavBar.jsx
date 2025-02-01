import {
    BrowserRouter,
    Routes,
    Route,
    Link,
  } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="font-bold text-xl">
          Itinerary Master
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-200 transition-colors">
            Home
          </Link>
          <Link href="/create" className="hover:text-blue-200 transition-colors">
            Create Itinerary
          </Link>
          <Link href="/about" className="hover:text-blue-200 transition-colors">
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}