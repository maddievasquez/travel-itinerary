"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"

export default function SignupPage() {
  const [message, setMessage] = useState("")
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const navigate = useNavigate()

  const onSubmit = async (signupData) => {
    setMessage("")

    if (signupData.password !== signupData.confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }

    const url = "http://127.0.0.1:8000/api/users/signup/"

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          passwordTwo: signupData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        navigate("/", { replace: true })
      } else if (response.status === 400) {
        if (data.email) {
          setMessage(data.email[0])
        } else if (data.password) {
          setMessage(data.password[0])
        } else {
          setMessage("Signup failed. Please try again.")
        }
      } else {
        setMessage("An unexpected error occurred. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage("An user with this email already exists.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#51d3e1] via-blue-200 to-blue-400 animate-gradient-x">
      <div className="max-w-md w-full space-y-8 bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-opacity-18 border-white relative overflow-hidden">
        <div className="relative">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-600">Create your account</h2>
          {message && (
            <div className="mt-2 p-2 bg-red-100 bg-opacity-80 text-red-700 rounded-md text-sm">{message}</div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email", { required: true })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#70DBFF] focus:border-[#70DBFF] focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
                {errors.email && <p className="mt-1 text-xs text-red-200">Email is required</p>}
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#70DBFF] focus:border-[#70DBFF] focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
                {errors.password && <p className="mt-1 text-xs text-red-200">Password is required</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword", { required: true })}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#70DBFF] focus:border-[#70DBFF] focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-200">Confirmation password is required</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#70DBFF] transition-all duration-200 hover:shadow-lg"
              >
                Sign up
              </button>
            </div>
          </form>
          <p className="mt-2 text-center text-sm text-white">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-white hover:text-[#70DBFF] transition-colors duration-200">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

