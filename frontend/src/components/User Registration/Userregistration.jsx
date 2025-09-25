// src/Components/Registration.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Userregistration() {
  const [form, setForm] = useState({
    Email: "",
    PassWord: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://doctor-appointment-system-9chq.onrender.com/api/models/api/userinfo/insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("✅ Registration successful!");
        setForm({ Email: "", PassWord: "" });
        navigate("/Userlogin");
      } else {
        alert("❌ Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Server error. Please try later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-indigo-600 to-purple-700 text-white flex flex-col justify-center items-center md:items-start p-8 md:p-10 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Manage Your Appointments</h2>
          <p className="text-base md:text-lg mb-6 opacity-90">
            Create your account and start booking doctor appointments easily.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="Illustration"
            className="w-32 md:w-48"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-12 py-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-2">
            Welcome
          </h2>
          <p className="text-gray-500 text-center mb-6">Please sign up for your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={form.Email}
                onChange={(e) => setForm({ ...form, Email: e.target.value })}
                required
                className="peer w-full px-4 pt-6 pb-2 bg-gray-50 text-gray-800 placeholder-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <label className="absolute left-4 top-2 text-gray-600 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={form.PassWord}
                onChange={(e) => setForm({ ...form, PassWord: e.target.value })}
                required
                className="peer w-full px-4 pt-6 pb-2 bg-gray-50 text-gray-800 placeholder-transparent border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <label className="absolute left-4 top-2 text-gray-600 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-600 transition-all">
                Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Sign Up
            </button>

            <p className="text-center text-gray-500 text-sm mt-4">
              Already have an account?{" "}
              <Link to="/Userlogin" className="text-indigo-600 font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

