import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Cookie from "../components/cookies";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
    const [message, setMessage] = useState("");
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    let navigate = useNavigate();
  
    const onSubmit = async (loginData) => {
      const formData = new FormData();
      Object.keys(loginData).forEach((key) => {
        formData.append(key, loginData[key]);
      });
      const options = {
        method: 'POST',
        body: formData
      };
      
      const url = "http://127.0.0.1:8000/api/auth/login/"
  //sends data that is found in the form to the server
      var successLoginData = await fetch(url, options)
        .then(response => {
          if (!response.ok) {
            setMessage("Invalid credentials.")
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });

  
      if (successLoginData) {
        Object.keys(successLoginData).forEach((key) => {
          Cookie.setCookie(key, successLoginData[key]);
        });
        navigate('/', { replace: true });
        window.location.reload();
    };
  }
  
     
  
    return (
       
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Log in to your account
              </h1>
              <span className="text-red-500">
              {message}
              </span>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div>
                  <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username(email later)</label>
                  <input type="text" name="email" id="email"
                    {...register("username", { required: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
                </div>
                <div>
                  <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                  <input type="password" name="password" id="password" placeholder="••••••••"
                    {...register("password", { required: true })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label for="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                </div>
                <button type="submit" className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet? <Link to="/signup"><span className="font-medium text-black hover:underline dark:text-primary-500">Click here</span></Link>
                </p>
                <button
                type="button"
                // onClick={handleGoogleLogin}
                className="w-full text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-gray-800"
              >
                <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                  <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd"/>
                </svg>
                Sign in with Google
              </button>
              </form>
            </div>
          </div>
        </div>
  
  
    )
  }
  
