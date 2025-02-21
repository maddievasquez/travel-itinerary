import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import Cookie from "../components/cookies"; // For authentication
import { useNavigate } from "react-router-dom";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user settings on page load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/settings/", {
          headers: {
            "Authorization": "Bearer " + Cookie.getCookie("access"),
          },
        });

        if (!response.ok) throw new Error("Failed to fetch settings");

        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSettings();
  }, []);

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
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/settings/update/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + Cookie.getCookie("access"),
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error("Failed to update settings");

      alert("Settings updated successfully!");
      navigate("/dashboard"); // Redirect to dashboard after saving
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              type="text"
              name="username"
              value={settings.username}
              onChange={handleChange}
            />
            <Input
              label="Email"
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
            />
            <Input
              label="New Password"
              type="password"
              name="password"
              value={settings.password}
              onChange={handleChange}
            />
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              <span>Enable Notifications</span>
            </label>
            <label>
              Unit Preference:
              <select name="unitPreference" value={settings.unitPreference} onChange={handleChange}>
                <option value="km">Kilometers</option>
                <option value="miles">Miles</option>
              </select>
            </label>
            <label>
              Time Format:
              <select name="timeFormat" value={settings.timeFormat} onChange={handleChange}>
                <option value="24h">24-hour</option>
                <option value="12h">12-hour</option>
              </select>
            </label>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
