// src/Components/DoctorLogin.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DoctorLogin() {
  const [Email, setEmail] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
     const response = await fetch("https://doctor-appointment-system-9chq.onrender.com/api/doctors/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email, PassWord }),  // ✅ FIXED
    });


      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("doctorToken", data.token);
        navigate("/Totalappointments"); // 👈 redirect after login
      } else {
        setError("❌ Wrong credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex flex-col justify-center items-center md:items-start p-8 md:p-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Doctor Login</h2>
          <p className="text-base md:text-lg mb-6 opacity-90">
            Login to access your doctor dashboard and manage appointments.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140047.png"
            alt="Doctor Illustration"
            className="w-32 md:w-48"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-2">
            Doctor Login
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="peer w-full px-4 pt-6 pb-2 bg-gray-50 text-gray-800 placeholder-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <label className="absolute left-4 top-2 text-gray-600 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all">
                Username
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                value={PassWord}
                onChange={(e) => setPassWord(e.target.value)}
                required
                placeholder="Password"
                className="peer w-full px-4 pt-6 pb-2 bg-gray-50 text-gray-800 placeholder-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <label className="absolute left-4 top-2 text-gray-600 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all">
                Password
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm font-medium text-center animate-pulse">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Login
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Not a doctor?{" "}
              <Link to="/Home" className="text-indigo-600 font-medium">
                Home
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}



