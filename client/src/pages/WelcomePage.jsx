import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Globe, Plus, ArrowRight } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          Plan Your Perfect Trip
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Create and organize your travel itineraries with ease. Start exploring the world your way.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/signup" 
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center"
          >
            Get Started <ArrowRight className="ml-2" size={18} />
          </Link>
          <Link 
            to="/login" 
            className="border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium py-3 px-6 rounded-lg flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Use Our Travel Planner?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow max-w-sm w-full">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Itineraries</h3>
            <p className="text-gray-600">
              Create day-by-day plans with activities, locations, and time slots.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow max-w-sm w-full">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Calendar className="text-green-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Date Management</h3>
            <p className="text-gray-600">
              Easily adjust your travel dates and see your plans update automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Plan Like a Pro
          </h2>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Travel planning example"
                  className="rounded-lg shadow-sm w-full h-auto"
                />
              </div>
              <div className="md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-4">Visualize Your Trip</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Plus className="text-teal-600 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Add activities with locations and time slots</span>
                  </li>
                  <li className="flex items-start">
                    <Globe className="text-teal-600 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>See all your destinations on an interactive map</span>
                  </li>
                  <li className="flex items-start">
                    <Calendar className="text-teal-600 mr-2 mt-1 flex-shrink-0" size={18} />
                    <span>Drag and drop to rearrange your schedule</span>
                  </li>
                </ul>
                <Link 
                  to="/signup" 
                  className="mt-6 inline-block bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Try It Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Ready to Plan Your Next Adventure?
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of travelers who are organizing their perfect trips with us.
        </p>
        <Link 
          to="/signup" 
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-8 rounded-lg inline-block"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
};

export default WelcomePage;
