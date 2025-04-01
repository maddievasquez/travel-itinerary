"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Cookie from "../components/cookies";
import { useNavigate, Link } from "react-router-dom";
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (loginData) => {
    const formData = new FormData();
    formData.append('username', loginData.username);
    formData.append('password', loginData.password);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
        method: "POST",
        body: formData,
      });
  
      // First check if response is HTML
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText); // Try to parse as JSON
      } catch {
        // If not JSON, show server error
        setMessage("Server error - please try again later");
        console.error("Server returned:", responseText);
        return;
      }
  
      if (!response.ok) {
        setMessage(responseData.error || "Invalid credentials");
        return;
      }
  
      // Store tokens
      Cookie.setCookie('access', responseData.access);
      Cookie.setCookie('refresh', responseData.refresh);
  
      if (document.getElementById("remember").checked) {
        localStorage.setItem("rememberedUsername", loginData.username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
  
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Login failed. Please try again.");
    }
  };

  // Function to handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      // Send the Google credential token to your backend
      const response = await fetch("http://127.0.0.1:8000/api/auth/google-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        throw new Error("Google authentication failed");
      }

      const data = await response.json();
      
      // Store tokens in cookies
      Object.keys(data).forEach((key) => {
        Cookie.setCookie(key, data[key]);
      });

      // Navigate to home page
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Google sign-in failed. Please try again.");
    }
  };

  // Function to handle Google login failure
  const handleGoogleError = () => {
    setMessage("Google sign-in was canceled or failed. Please try again.");
  };

  const [username, setUsername] = useState(localStorage.getItem("rememberedUsername") || "");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#2C3E50] via-[#2B8D8D] to-[#1F8A8A] backdrop-blur-sm">
      <div className="w-full max-w-md space-y-8 bg-[#34495E] bg-opacity-90 backdrop-blur-lg p-10 rounded-2xl shadow-lg border border-white/30 relative overflow-hidden">
        <div className="relative">
          <h2 className="text-center text-3xl font-bold text-white">Log in to your account</h2>
          {message && (
            <div className="mt-2 p-2 bg-red-200 text-red-800 rounded-md text-sm">
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                type="text"
                id="email"
                autoComplete="username"
                defaultValue={localStorage.getItem("rememberedUsername") || ""}
                onChange={(e) => setUsername(e.target.value)}
                {...register("username", { required: true })}
                className="appearance-none rounded-t-md w-full px-4 py-2 border border-[#2B8D8D] placeholder-[#BDC3C7] text-white bg-[#2C3E50] focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] focus:outline-none sm:text-sm"
                placeholder="Username"
              />

              <input
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password", { required: true })}
                className="appearance-none rounded-b-md w-full px-4 py-2 border border-[#2B8D8D] placeholder-[#BDC3C7] text-white bg-[#2C3E50] focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61] focus:outline-none sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#FF6F61] border border-[#2B8D8D] rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-white">
                  Remember me
                </label>
              </div>
              <p className="text-sm">
                <Link to="/forgot-password" className="text-blue-400">Forgot password?</Link>
              </p>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#2B8D8D] to-[#FF6F61] hover:scale-105 transition-all duration-200 shadow-md"
            >
              Sign in
            </button>
          </form>

          <p className="mt-2 text-center text-sm text-white">
            Don't have an account yet?{" "}
            <Link to="/signup" className="font-medium text-white hover:text-[#2B8D8D]">
              Click here
            </Link>
          </p>

          <div className="mt-6">
            {/* Replace the button with GoogleOAuthProvider and GoogleLogin */}
            {/* <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_blue"
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="center"
                  width="100%"
                />
              </div>
            </GoogleOAuthProvider> */}
          </div>
        </div>
      </div>
    </div>
  );
}