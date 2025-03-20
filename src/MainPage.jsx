import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "./assets/MacroMeterLogo.png";
import bg1 from "./assets/bg1.jpg";
import bg2 from "./assets/bg2.jpg";
import bg3 from "./assets/bg3.jpg";
import bg4 from "./assets/bg4.jpg";
import { addUserHistory } from "./controllers/historyController";
import { submitFeedback } from "./controllers/feedbackController";
import CONFIG from "./config";

const MainView = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);
  const [fade, setFade] = useState(true);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [mealStack, setMealStack] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const backgrounds = [bg1, bg2, bg3, bg4];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentBg((prevBg) => (prevBg + 1) % backgrounds.length);
        setFade(true);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
      console.log("Selected file:", file.name);
    }
  };

  const triggerFileUpload = () => {
    document.getElementById("fileInput").click();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleHistory = () => {
    navigate("/history");
  };

  const handleAnalyzeImage = async () => {
    if (!selectedFile) {
      alert("Please upload an image first.");
      return;
    }
    
    setLoading(true);
  
    const formData = new FormData();
    formData.append("image", selectedFile);
  
    try {
      const res = await axios.post(`${CONFIG.API_BASE_URL}/analyze-image`, formData, {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAiResponse(res.data);
      // Instead of automatically saving each meal, we add it to the mealStack.
      setMealStack((prevStack) => [...prevStack, { ...res.data }]);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setAiResponse({ error: "Error analyzing the image. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    await submitFeedback(rating, comment);
    setRating(0);
    setComment("");
    setShowFeedback(false);
    alert("Thank you for your feedback!");
  };

  // Delete a single meal from the stack
  const handleDeleteMeal = (indexToDelete) => {
    setMealStack((prevStack) => prevStack.filter((_, index) => index !== indexToDelete));
  };

  // Clear all meals from the stack
  const handleClearAll = () => {
    setMealStack([]);
  };

  // Save the entire meal stack (daily consumption) to the database
  const handleSaveDaily = async () => {
    if (mealStack.length === 0) {
      alert("No meals to save for today.");
      return;
    }
    // Construct a daily summary payload
    const dailySummary = {
      date: new Date().toISOString(),
      meals: mealStack,
      totalCalories: mealStack.reduce((total, meal) => total + (parseFloat(meal.calories) || 0), 0)
    };
    try {
      await addUserHistory(dailySummary);
      alert("Daily consumption saved successfully!");
      // Optionally, clear the meal stack after saving:
      setMealStack([]);
    } catch (error) {
      console.error("Error saving daily consumption:", error);
      alert("Failed to save daily consumption.");
    }
  };

  const totalCalories = mealStack.reduce((total, meal) => total + (parseFloat(meal.calories) || 0), 0);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-white">
      {/* White Header Bar */}
      <div className="absolute top-0 left-0 w-full bg-white shadow-md py-4 flex items-center justify-between px-8 z-10">
        <img src={logo} alt="MacroMeter Logo" className="w-24" />
        <div className="flex space-x-4">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition"
            onClick={handleHistory}
          >
            History
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition"
            onClick={handleLogout}
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
          transition: "opacity 1s ease-in-out",
        }}
      ></div>

      <p
        className="absolute bottom-5 right-5 text-red-500 cursor-pointer hover:underline text-sm font-semibold"
        onClick={() => setShowFeedback(true)}
      >
        Give Feedback
      </p>

      <div className="relative bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full text-center mt-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Calorie Tracker</h2>
        <p className="text-gray-500 mb-4">Monitor your daily intake with ease</p>

        <input type="file" id="fileInput" accept="image/*" className="hidden" onChange={handleFileChange} />

        <button
          className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition mb-4"
          onClick={triggerFileUpload}
        >
          Upload a Picture
        </button>

        {selectedFile && <p className="text-green-600 text-sm mt-2">Selected: {selectedFile.name}</p>}

        <button
          className="w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition"
          onClick={handleAnalyzeImage}
        >
          Analyze Image
        </button>

        {loading && (
          <div className="flex flex-col items-center mt-4">
            <svg className="animate-spin h-8 w-8 text-red-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <p className="mt-2 text-gray-700">Analyzing...</p>
          </div>
        )}

        {/* AI Response Section */}
        {aiResponse && !aiResponse.error && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md w-full flex">
            {selectedFile && (
              <div className="mr-4">
                <img src={previewUrl} alt="Analyzed" className="w-32 h-32 object-cover rounded" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis Result:</h3>
              <p className="text-gray-700 mt-2"><strong>Food:</strong> {aiResponse.name}</p>
              <p className="text-gray-700 mt-2"><strong>Calories:</strong> {aiResponse.calories}</p>
              <p className="text-gray-700"><strong>Carbohydrates:</strong> {aiResponse.carbohydrates}</p>
              <p className="text-gray-700"><strong>Protein:</strong> {aiResponse.protein}</p>
              <p className="text-gray-700"><strong>Fat:</strong> {aiResponse.fat}</p>
            </div>
          </div>
        )}

        {aiResponse?.error && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md w-full">
            <p>{aiResponse.error}</p>
          </div>
        )}

        {/* Meal Stack Section */}
        {mealStack.length > 0 && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg shadow-md w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Meals</h3>
              <div className="space-x-2">
                <button onClick={handleClearAll} className="text-sm text-red-500 hover:underline">
                  Clear All
                </button>
                <button onClick={handleSaveDaily} className="text-sm text-green-500 hover:underline">
                  Save Daily Consumption
                </button>
              </div>
            </div>
            <ul className="mt-2">
              {mealStack.map((meal, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mt-2 bg-white p-2 rounded shadow-sm"
                >
                  <div>
                    <p className="text-gray-800">
                      <strong>{meal.name || "Meal"}</strong> - {meal.calories} Calories
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(index)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-semibold">Total Calories: {totalCalories}</p>
          </div>
        )}
      </div>

      <p className="absolute bottom-2 text-gray-500 text-xs">© 2025 MacroMeter. All rights reserved.</p>

      {showFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowFeedback(false)}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-gray-900">Feedback</h3>
            <p className="text-gray-500 mb-4">Rate your experience</p>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`cursor-pointer text-2xl ${num <= rating ? "text-yellow-400" : "text-gray-300"}`}
                  onClick={() => setRating(num)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Write your comments here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="w-full bg-red-500 text-white py-2 rounded-lg text-lg font-semibold hover:opacity-90 transition"
              onClick={handleFeedbackSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainView;
