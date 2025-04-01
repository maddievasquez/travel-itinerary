import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800">
      <h1 className="text-3xl font-bold text-center mb-4">About Our Itinerary Planner</h1>
      <p className="text-lg text-center text-gray-600 mb-6">
        Plan your perfect trip effortlessly. Our itinerary planner helps you organize your travels, find hidden gems, and make the most of your time.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center bg-white shadow-md rounded-2xl p-4">
          <MapPin className="text-blue-600 h-10 w-10 mb-2" />
          <h3 className="font-semibold">Custom Routes</h3>
          <p className="text-sm text-gray-500 text-center">Create personalized travel routes based on your interests.</p>
        </div>

        <div className="flex flex-col items-center bg-white shadow-md rounded-2xl p-4">
          <Calendar className="text-green-600 h-10 w-10 mb-2" />
          <h3 className="font-semibold">Save Your Trips</h3>
          <p className="text-sm text-gray-500 text-center">Store and revisit your past trips anytime.</p>
        </div>

        <div className="flex flex-col items-center bg-white shadow-md rounded-2xl p-4">
          <CheckCircle className="text-purple-600 h-10 w-10 mb-2" />
          <h3 className="font-semibold">Local Recommendations</h3>
          <p className="text-sm text-gray-500 text-center">Discover the best local attractions and restaurants.</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <Link to="/plan" className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
          Start Planning
        </Link>
      </div>
    </div>
  );
};

export default About;
