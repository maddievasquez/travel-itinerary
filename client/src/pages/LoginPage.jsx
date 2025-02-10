"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import Cookie from "../components/cookies"
import { useNavigate, Link } from "react-router-dom"

export default function LoginPage() {
  const [message, setMessage] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = async (loginData) => {
    const formData = new FormData()
    Object.keys(loginData).forEach((key) => {
      formData.append(key, loginData[key])
    })
    const options = {
      method: "POST",
      body: formData,
    }

    const url = "http://127.0.0.1:8000/api/auth/login/"

    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        setMessage("Invalid credentials.")
        throw new Error("Network response was not ok")
      }
      const successLoginData = await response.json()

      Object.keys(successLoginData).forEach((key) => {
        Cookie.setCookie(key, successLoginData[key])
      })
      navigate("/", { replace: true })
      window.location.reload()
    } catch (error) {
      console.error("Fetch error:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#51d3e1] via-blue-200 to-blue-400 animate-gradient-x">
      <div className="w-full max-w-md space-y-8 bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-opacity-18 border-white relative overflow-hidden">
        <div className="relative">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Log in to your account</h2>
          {message && (
            <div className="mt-2 p-2 bg-red-100 bg-opacity-80 text-red-700 rounded-md text-sm">{message}</div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Your username
                </label>
                <input
                  type="text"
                  id="email"
                  {...register("username", { required: true })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#70DBFF] focus:border-[#70DBFF] focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", { required: true })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#70DBFF] focus:border-[#70DBFF] focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-[#70DBFF] focus:ring-[#70DBFF] border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-white">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-white hover:text-[#70DBFF]">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70DBFF] transition-all duration-200 hover:shadow-lg"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-2 text-center text-sm text-white">
            Don't have an account yet?{" "}
            <Link to="/signup" className="font-medium text-white hover:text-[#70DBFF] transition-colors duration-200">
              Click here
            </Link>
          </p>

          <div className="mt-6">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white bg-opacity-80 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70DBFF] transition-all duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 19"
              >
                <path
                  fillRule="evenodd"
                  d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                  clipRule="evenodd"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

