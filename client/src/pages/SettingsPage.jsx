import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { AlertCircle, Loader } from "lucide-react";
import Button from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import auth from "../auth"; // Import the auth module

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    username: "",
    email: "",
    password: "",
    notifications: false,
    unitPreference: "km",
    timeFormat: "24h",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch user settings on page load
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        // Check if user is authenticated
        if (!auth.checkAuthStatus()) {
          navigate('/login');
          return;
        }

        // Use the auth module's fetchSettings function
        const data = await auth.fetchSettings();
        setSettings(data);
      } catch (err) {
        // The global axios interceptor will handle 401 errors
        setError('Failed to fetch settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, [navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit updated settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Check if user is authenticated
      if (!auth.checkAuthStatus()) {
        navigate('/login');
        return;
      }

      // Use the auth module's updateSettings function
      await auth.updateSettings(settings);

      setSuccess(true);
      // Wait a bit before navigating away
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="animate-spin h-12 w-12 text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-10 px-4">
      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
          <CardTitle className="text-xl">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <p>Settings updated successfully! Redirecting...</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={settings.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={settings.password}
                onChange={handleChange}
                placeholder="Leave empty to keep current password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Enable Notifications
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit Preference</label>
              <select
                name="unitPreference"
                value={settings.unitPreference}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
              >
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
              <select
                name="timeFormat"
                value={settings.timeFormat}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 rounded-md"
              >
                <option value="24h">24-hour</option>
                <option value="12h">12-hour</option>
              </select>
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Saving...
                  </span>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}