import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/MacroMeterLogo.png";
import bg1 from "./assets/bg1.jpg";
import bg2 from "./assets/bg2.jpg";
import bg3 from "./assets/bg3.jpg";
import bg4 from "./assets/bg4.jpg";
import { getUserHistory, resetUserHistory } from "./controllers/historyController";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [fade, setFade] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const backgrounds = [bg1, bg2, bg3, bg4];
  const navigate = useNavigate();

  // Cycle through background images (same as MainView)
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        setFade(true);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds]);

  // Fetch history from the API
  const handleRefresh = async () => {
    try {
      const fetchedHistory = await getUserHistory();
      setHistory(fetchedHistory);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Clear history via the API
  const handleClearHistory = async () => {
    try {
      await resetUserHistory();
      setHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  // Check for token on mount and fetch history
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      handleRefresh();
    }
  }, [navigate]);

  // Format ISO date strings into a human-friendly format
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Header Back button
  const handleBack = () => {
    navigate("/MainPage");
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white">
      <div className="absolute top-0 left-0 w-full bg-white shadow-md py-4 flex items-center justify-between px-8 z-10">
        <img src={logo} alt="MacroMeter Logo" className="w-24" />
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          >
            Back to Main
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Background Images with Fading Effect */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${backgrounds[currentBg]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: fade ? 1 : 0,
        }}
      ></div>

      {/* Main History Container */}
      <div className="relative bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center mt-20">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Daily Consumption History</h1>
        <p className="text-gray-500 mb-4">Your past daily records</p>

        {history.length > 0 ? (
          history.map((record, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md mb-4 text-left"
            >
              <h2 className="font-bold text-xl mb-2">Date: {formatDate(record.date)}</h2>
              <p className="mb-2">
                <strong>Total Calories:</strong> {record.totalCalories}
              </p>
              <h3 className="font-semibold mb-2">Meals:</h3>
              {record.meals && record.meals.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1">
                  {record.meals.map((meal, idx) => (
                    <li key={idx}>
                      <strong>{meal.name || "Meal"}</strong> - {meal.calories} Calories, {meal.carbohydrates}g Carbs, {meal.protein}g Protein, {meal.fat}g Fat
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No meals recorded for this day.</p>
              )}
            </div>
          ))
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-4">
            <p className="text-gray-700">No daily records found.</p>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition"
          >
            Refresh
          </button>
          <button
            onClick={handleClearHistory}
            className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition"
          >
            Clear History
          </button>
        </div>
      </div>

      <p className="absolute bottom-2 text-gray-500 text-xs">
        © 2025 MacroMeter. All rights reserved.
      </p>
    </div>
  );
};

export default HistoryPage;
