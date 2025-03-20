import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Login.jsx"; 
import SignupPage from "./Signup.jsx"; 
import MainView from "./MainPage.jsx";
import HistoryPage from "./HistoryPage.jsx";
import ForgetPage from "./ForgetPassword.jsx"


function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/MainPage" element={<MainView />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/forget" element={<ForgetPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
