import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Stethoscope, Menu, X } from "lucide-react";
import { FaLock } from "react-icons/fa";
import { SiWorldhealthorganization } from "react-icons/si";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to safely use localStorage with quota handling
  const safeLocalStorage = {
    setItem: (key, value) => {
      try {
        // Remove photos from localStorage data to save space
        const dataToStore = typeof value === 'string' ? JSON.parse(value) : value;
        const lightweightData = dataToStore.map(appointment => ({
          ...appointment,
          doctor: appointment.doctor ? {
            ...appointment.doctor,
            photo: null // Remove photo to save localStorage space
          } : null
        }));
        
        localStorage.setItem(key, JSON.stringify(lightweightData));
        return true;
      } catch (error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.warn('localStorage quota exceeded. Clearing old data and retrying...');
          // Clear localStorage and try again
          try {
            localStorage.removeItem(key);
            localStorage.setItem(key, JSON.stringify([]));
            return false;
          } catch (secondError) {
            console.error('Failed to clear localStorage:', secondError);
            return false;
          }
        } else {
          console.error('localStorage error:', error);
          return false;
        }
      }
    },
    getItem: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Failed to read from localStorage:', error);
        return null;
      }
    },
    removeItem: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
        return false;
      }
    }
  };

  // Function to format date in user-friendly way
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return dateString;
    }
  };

  // Function to format time in user-friendly way
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  // Function to get relative date
  const getRelativeDate = (dateString) => {
    try {
      const appointmentDate = new Date(dateString);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      today.setHours(0, 0, 0, 0);
      tomorrow.setHours(0, 0, 0, 0);
      appointmentDate.setHours(0, 0, 0, 0);
      
      if (appointmentDate.getTime() === today.getTime()) {
        return "Today";
      } else if (appointmentDate.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/appointments");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setAppointments(data);
        setError("");
        
        // Try to store in localStorage with error handling
        const stored = safeLocalStorage.setItem("appointments", JSON.stringify(data));
        if (!stored) {
          console.warn('Could not save appointments to localStorage due to storage limits');
        }
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Failed to fetch appointments from server");
        
        // Try to load from localStorage as fallback
        const storedData = safeLocalStorage.getItem("appointments");
        if (storedData) {
          try {
            const storedAppointments = JSON.parse(storedData);
            setAppointments(storedAppointments);
          } catch (parseError) {
            console.error("Error parsing stored appointments:", parseError);
            setAppointments([]);
          }
        } else {
          setAppointments([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const saveAppointments = (updated) => {
    setAppointments(updated);
    // Try to save to localStorage, but don't fail if it doesn't work
    safeLocalStorage.setItem("appointments", JSON.stringify(updated));
  };

  const handleCancel = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        const res = await fetch(`http://localhost:4000/api/appointments/${id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) {
          throw new Error("Failed to cancel appointment on server");
        }

        const updated = appointments.filter((appt) => appt.id !== id);
        saveAppointments(updated);
        alert("Appointment cancelled successfully!");
      } catch (err) {
        console.error("Failed to cancel appointment:", err);
        alert("Failed to cancel appointment. Please try again.");
      }
    }
  };

  const handleReschedule = async (id) => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newTime = prompt("Enter new time (HH:MM):");

    if (newDate && newTime) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^\d{2}:\d{2}$/;
      
      if (!dateRegex.test(newDate) || !timeRegex.test(newTime)) {
        alert("Please enter valid date (YYYY-MM-DD) and time (HH:MM) format");
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/api/appointments/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: newDate, time: newTime }),
        });

        if (!res.ok) {
          throw new Error("Failed to reschedule appointment on server");
        }

        const updated = appointments.map((appt) =>
          appt.id === id ? { ...appt, date: newDate, time: newTime } : appt
        );
        saveAppointments(updated);
        alert("Appointment rescheduled successfully!");
      } catch (err) {
        console.error("Failed to reschedule appointment:", err);
        alert("Failed to reschedule appointment. Please try again.");
      }
    }
  };

  // Clear localStorage function (can be called if needed)
  const clearStoredData = () => {
    safeLocalStorage.removeItem("appointments");
    console.log("Stored appointments data cleared");
  };

  if (loading) {
    return (
      <>
        
        <div className="max-w-6xl mx-auto p-6 mt-20">
          <h2 className="text-3xl font-bold mb-6 text-center">My Appointments</h2>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
 <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center">
              <SiWorldhealthorganization className="w-8 h-8 text-blue-600 cursor-pointer" />
            </div>

            <h1 className="text-2xl font-bold text-green-600">Zeromedixine</h1>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-4">
            <a
              href="/Home"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              Home
            </a>
            <a
              href="/Myappointments"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              My Appointments
            </a>
            <a
              href="/Doctorlogin"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              🔒 Department Login
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-3">
            <a
              href="/Home"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              Home
            </a>
            <a
              href="/Myappointments"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              My Appointments
            </a>
            <a
              href="/Doctorlogin"
              className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
            >
              🔒 Department Login
            </a>
          </div>
        )}
      </nav>
      <div className="max-w-6xl mx-auto p-6 mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center">My Appointments</h2>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
            <p className="text-sm mt-1">Showing cached appointments if available.</p>
            <button 
              onClick={clearStoredData}
              className="text-xs underline mt-1 text-yellow-800 hover:text-yellow-900"
            >
              Clear cached data
            </button>
          </div>
        )}

        {appointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appt) => {
              const relativeDate = getRelativeDate(appt.date);
              const formattedDate = formatDate(appt.date);
              const formattedTime = formatTime(appt.time);
              
              return (
                <div
                  key={appt.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border"
                >
                  {/* Doctor Information */}
                  {appt.doctor ? (
                    <div className="flex items-center mb-4">
                      {appt.doctor.photo ? (
                        <img
                          src={`data:image/jpeg;base64,${appt.doctor.photo}`}
                          alt={appt.doctor.model_name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-blue-100 rounded-full mr-4 text-blue-600 font-semibold">
                          Dr
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          Dr. {appt.doctor.model_name}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {appt.doctor.category}
                        </p>
                        <div className="text-gray-600 text-sm space-y-1">
                          <p>{appt.doctor.model_experience} years experience</p>
                          <p>{appt.doctor.model_hospital}</p>
                          <p className="text-green-600 font-medium">
                            ₹{parseFloat(appt.doctor.price).toFixed(2)} consultation fee
                          </p>
                          {appt.doctor.rating && (
                            <p className="text-yellow-600">
                              ⭐ {appt.doctor.rating} rating
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                      <p className="text-red-600 text-sm">
                        ⚠️ Doctor information not available (Doctor ID: {appt.doctor_id})
                      </p>
                    </div>
                  )}

                  {/* Appointment Details */}
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Appointment Details</h4>
                    
                    {/* Date and Time - Highlighted */}
                    <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <strong className="text-blue-800">📅 Date:</strong>
                          <div className="mt-1">
                            {relativeDate && (
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">
                                {relativeDate}
                              </span>
                            )}
                            <p className="text-blue-700 font-medium">{formattedDate}</p>
                          </div>
                        </div>
                        <div>
                          <strong className="text-blue-800">🕒 Time:</strong>
                          <p className="text-blue-700 font-medium text-lg mt-1">{formattedTime}</p>
                        </div>
                      </div>
                    </div>

                    {/* Other Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700 text-sm">
                      <div>
                        <strong className="text-gray-800">👤 Patient:</strong>
                        <p>{appt.patientName}</p>
                      </div>
                      <div>
                        <strong className="text-gray-800">📞 Phone:</strong>
                        <p>{appt.phone}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <strong className="text-gray-800">📧 Email:</strong>
                        <p className="break-all">{appt.email}</p>
                      </div>
                      {appt.reason && (
                        <div className="sm:col-span-2">
                          <strong className="text-gray-800">💬 Reason:</strong>
                          <p>{appt.reason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleReschedule(appt.id)}
                      className="flex-1 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancel(appt.id)}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1 1V8a1 1 0 011-1h4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600">
              You haven't booked any appointments yet. Visit the home page to book your first appointment.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}