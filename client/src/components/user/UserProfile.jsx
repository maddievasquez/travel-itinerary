import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../ui/button";
import Input from "../ui/input"; 
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar"; 
import { Mail, Edit2, Check, X } from "lucide-react";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch User Profile from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.get("/api/user/profile"); // Replace with actual API route
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchProfile();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/user/profile", profile); // Replace with actual API route
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <CardHeader className="relative pb-0">
          <div className="absolute -top-16 left-4 border-4 border-white rounded-full">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.avatar} alt={profile.name || profile.email} />
              <AvatarFallback>
                {(profile.name || profile.email)
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex justify-end pt-4">
            {isEditing ? (
              <div className="space-x-2">
                <Button size="sm" onClick={handleSubmit} disabled={loading}>
                  <Check className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              {isEditing ? (
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="text-2xl font-bold"
                />
              ) : (
                <h2 className="text-2xl font-bold">{profile.name || "No name provided"}</h2>
              )}

              <div className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                {profile.email}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
