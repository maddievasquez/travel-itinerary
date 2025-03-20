"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (signupData) => {
    setMessage("");

    if (signupData.password !== signupData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const url = "http://127.0.0.1:8000/api/users/signup/";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          passwordTwo: signupData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/", { replace: true });
      } else if (response.status === 400) {
        if (data.email) {
          setMessage(data.email[0]);
        } else if (data.password) {
          setMessage(data.password[0]);
        } else {
          setMessage("Signup failed. Please try again.");
        }
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("A user with this email already exists.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#2C3E50] via-[#2B8D8D] to-[#1F8A8A] animate-gradient-x">
      <div className="max-w-md w-full space-y-8 bg-[#34495E] bg-opacity-90 backdrop-blur-lg p-10 rounded-xl shadow-xl border border-opacity-20 border-gray-700">
        <h2 className="text-center text-3xl font-extrabold text-white">Create your account</h2>
        {message && (
          <div className="mt-2 p-2 bg-red-500 bg-opacity-90 text-white rounded-md text-sm">
            {message}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
              placeholder="Email address"
            />
            {errors.email && <p className="text-xs text-red-400">Email is required</p>}
            
            <input
              id="password"
              type="password"
              {...register("password", { required: true })}
              className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
              placeholder="Password"
            />
            {errors.password && <p className="text-xs text-red-400">Password is required</p>}
            
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", { required: true })}
              className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <p className="text-xs text-red-400">Confirmation password is required</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#2B8D8D] to-[#FF6F61] hover:scale-105 transition-transform"
          >
            Sign up
          </button>
        </form>
        <p className="mt-2 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#FF6F61] hover:text-[#2B8D8D] transition-colors duration-200">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
