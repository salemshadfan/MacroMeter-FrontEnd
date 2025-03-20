import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "./assets/MacroMeterLogo.png";
import foodImage from "./assets/forgetPageFood.jpg";
import { sendResetLink } from "./controllers/passwordResetController";

const ForgetPassword = () => {
  // Message is an object with text and type ("success" or "error")
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Please enter your email.", type: "error" });
      return;
    }

    try {
      await sendResetLink(email);
      setMessage({
        text: "Reset link sent successfully! Please check your email.",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: "An error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <div className="flex w-full h-full bg-white shadow-lg rounded-2xl">
        {/* Left Section - Full Width on Small Screens */}
        <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-start px-8 sm:px-24">
          <div className="w-full flex justify-center mb-4">
            <img src={logo} alt="MacroMeter Logo" className="w-40" />
          </div>

          <h2 className="text-4xl font-bold text-gray-900 text-center w-full">
            Reset Password
          </h2>
          <p className="text-gray-500 mb-6 text-center w-full">
            Enter your email to reset your password.
          </p>

          {message.text && (
            <p
              className={`text-sm mb-2 ${
                message.type === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleResetPassword} className="w-full space-y-4">
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

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition"
            >
              Reset Password
            </button>
          </form>

          <p className="mt-4 text-gray-600 text-center">
            Remembered your password?
            <Link
              to="/"
              className="text-red-500 hover:underline font-semibold ml-1"
            >
              Log in here
            </Link>
          </p>

          <p className="mt-8 text-gray-400 text-center w-full text-sm">
            © 2025 MacroMeter. All rights reserved.
          </p>
        </div>

        {/* Right Section - Hidden on Small Screens */}
        <div className="hidden lg:flex w-1/2 h-full bg-white items-center justify-center">
          <img
            src={foodImage}
            alt="Food"
            className="w-[85%] h-auto rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
