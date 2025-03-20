import React, { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "./controllers/authController";
import logo from "./assets/MacroMeterLogo.png";
import foodImage from "./assets/signupFood.jpeg";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    try {
      const result = await signupUser(username, email, password);
      if (result.error) {
        setError(result.error);
      } else {
        console.log("Signup successful:", result);
        navigate("/"); // Redirect to login page after signup
      }
    } catch (err) {
      setError("An error occurred during signup.");
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <div className="flex w-full h-full bg-white shadow-lg rounded-2xl">
        
        {/* Left Section - Full Width on Small Screens */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-start px-8 sm:px-24">
          
          {/* Logo */}
          <div className="w-full flex justify-center mb-4">
            <img src={logo} alt="MacroMeter Logo" className="w-40" />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 text-center w-full">Create an Account</h2>
          <p className="text-gray-500 mb-6 text-center w-full">Join MacroMeter and start tracking your nutrition.</p>
          
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          
          <form onSubmit={handleSignup} className="w-full space-y-4">
            <div>
              <label className="text-gray-700 font-medium block">Full Name</label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Enter your full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-medium block">Email</label>
              <div className="relative mt-1">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-medium block">Password</label>
              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-gray-700 font-medium block">Confirm Password</label>
              <div className="relative mt-1">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-gray-600 text-center">
            Already have an account?
            <Link to="/" className="text-red-500 hover:underline font-semibold ml-1">
              Log in here!
            </Link>
          </p>

          <p className="mt-8 text-gray-400 text-center w-full text-sm">
            © 2025 MacroMeter. All rights reserved.
          </p>
        </div>

        {/* Right Section - Hidden on Small Screens */}
        <div className="hidden lg:flex w-1/2 h-full bg-white items-center justify-center">
          <img src={foodImage} alt="Food" className="w-[85%] h-auto rounded-2xl object-cover" />
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
