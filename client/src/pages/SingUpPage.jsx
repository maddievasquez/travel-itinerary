// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useNavigate, Link } from "react-router-dom";

// export default function SignupPage() {
//   const [message, setMessage] = useState("");
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const navigate = useNavigate();

//   const onSubmit = async (signupData) => {
//     setMessage("");

//     if (signupData.password !== signupData.confirmPassword) {
//       setMessage("Passwords do not match.");
//       return;
//     }

//     const url = "http://127.0.0.1:8000/api/users/signup/";

//     try {
//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: signupData.email,
//           password: signupData.password,
//           passwordTwo: signupData.confirmPassword,
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         navigate("/", { replace: true });
//       } else if (response.status === 400) {
//         if (data.email) {
//           setMessage(data.email[0]);
//         } else if (data.password) {
//           setMessage(data.password[0]);
//         } else {
//           setMessage("Signup failed. Please try again.");
//         }
//       } else {
//         setMessage("An unexpected error occurred. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       setMessage("A user with this email already exists.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#2C3E50] via-[#2B8D8D] to-[#1F8A8A] animate-gradient-x">
//       <div className="max-w-md w-full space-y-8 bg-[#34495E] bg-opacity-90 backdrop-blur-lg p-10 rounded-xl shadow-xl border border-opacity-20 border-gray-700">
//         <h2 className="text-center text-3xl font-extrabold text-white">Create your account</h2>
//         {message && (
//           <div className="mt-2 p-2 bg-red-500 bg-opacity-90 text-white rounded-md text-sm">
//             {message}
//           </div>
//         )}
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
//           <div className="space-y-4">
//             <input
//               id="email"
//               type="email"
//               {...register("email", { required: true })}
//               className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
//               placeholder="Email address"
//             />
//             {errors.email && <p className="text-xs text-red-400">Email is required</p>}
            
//             <input
//               id="password"
//               type="password"
//               {...register("password", { required: true })}
//               className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
//               placeholder="Password"
//             />
//             {errors.password && <p className="text-xs text-red-400">Password is required</p>}
            
//             <input
//               id="confirmPassword"
//               type="password"
//               {...register("confirmPassword", { required: true })}
//               className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
//               placeholder="Confirm Password"
//             />
//             {errors.confirmPassword && <p className="text-xs text-red-400">Confirmation password is required</p>}
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#2B8D8D] to-[#FF6F61] hover:scale-105 transition-transform"
//           >
//             Sign up
//           </button>
//         </form>
//         <p className="mt-2 text-center text-sm text-gray-300">
//           Already have an account?{" "}
//           <Link to="/login" className="font-medium text-[#FF6F61] hover:text-[#2B8D8D] transition-colors duration-200">
//             Log in here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Cookie from "../components/cookies";

export default function SignupPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (signupData) => {
    setLoading(true);
    setMessage("");
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/user/signup/",
        {
          email: signupData.email,
          password: signupData.password,
          passwordTwo: signupData.confirmPassword,  // Make sure this matches your SignupSerializer fields
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
  
      // Store tokens in cookies
      Cookie.setCookie("access", response.data.access);
      Cookie.setCookie("refresh", response.data.refresh);
      
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(response.data.user));
  
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Signup error:", error);
      
      if (error.response) {
        // Handle validation errors from backend
        if (error.response.data?.email) {
          setMessage(error.response.data.email[0]);
        } else if (error.response.data?.password) {
          setMessage(error.response.data.password[0]);
        } else if (error.response.data?.passwordTwo) {  // Match your serializer field name
          setMessage(error.response.data.passwordTwo[0]);
        } else {
          setMessage("Signup failed. Please try again.");
        }
      } else {
        setMessage("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-[#2C3E50] via-[#2B8D8D] to-[#1F8A8A] animate-gradient-x">
      <div className="max-w-md w-full space-y-8 bg-[#34495E] bg-opacity-90 backdrop-blur-lg p-10 rounded-xl shadow-xl border border-opacity-20 border-gray-700">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
        
        {message && (
          <div className="mt-2 p-2 bg-red-500 bg-opacity-90 text-white rounded-md text-sm">
            {message}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                {...register("password", { 
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters"
                  }
                })}
                className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => 
                    value === password || "Passwords do not match"
                })}
                className="w-full px-4 py-2 border border-[#2B8D8D] rounded-lg bg-[#2C3E50] text-white placeholder-[#BDC3C7] focus:outline-none focus:ring-2 focus:ring-[#FF6F61] focus:border-[#FF6F61]"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-[#2B8D8D] to-[#FF6F61] hover:scale-105 transition-transform ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>
        
        <p className="mt-2 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="font-medium text-[#FF6F61] hover:text-[#2B8D8D] transition-colors duration-200"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}