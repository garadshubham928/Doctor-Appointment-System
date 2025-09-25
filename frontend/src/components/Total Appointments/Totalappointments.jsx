import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaStethoscope,
  FaHospital,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export default function Totalappointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Date formatting
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const minute = parseInt(minutes);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute.toString().padStart(2, "0")} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  const getAppointmentStatus = (dateString, timeString) => {
    try {
      const appointmentDateTime = new Date(`${dateString}T${timeString}`);
      const now = new Date();
      if (appointmentDateTime < now) return "completed";
      else if (appointmentDateTime.toDateString() === now.toDateString()) return "today";
      else return "upcoming";
    } catch {
      return "upcoming";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "today":
        return "bg-green-100 text-green-700";
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "today":
        return "Today";
      case "upcoming":
        return "Upcoming";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:4000/api/appointments");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const appointmentsWithStatus = data.map((apt) => ({
          ...apt,
          status: getAppointmentStatus(apt.date, apt.time),
        }));
        setAppointments(appointmentsWithStatus);
        setFilteredAppointments(appointmentsWithStatus);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to fetch appointments from server");
        setAppointments([]);
        setFilteredAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  useEffect(() => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.phone.includes(searchTerm) ||
          (apt.doctor &&
            apt.doctor.model_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (apt.doctor &&
            apt.doctor.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") filtered = filtered.filter((apt) => apt.status === statusFilter);

    if (dateFilter !== "all") {
      const today = new Date();
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.date);
        switch (dateFilter) {
          case "today":
            return aptDate.toDateString() === today.toDateString();
          case "week":
            const weekFromNow = new Date();
            weekFromNow.setDate(today.getDate() + 7);
            return aptDate >= today && aptDate <= weekFromNow;
          case "month":
            const monthFromNow = new Date();
            monthFromNow.setMonth(today.getMonth() + 1);
            return aptDate >= today && aptDate <= monthFromNow;
          default:
            return true;
        }
      });
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const getStats = () => {
    const total = appointments.length;
    const today = appointments.filter((apt) => apt.status === "today").length;
    const upcoming = appointments.filter((apt) => apt.status === "upcoming").length;
    const completed = appointments.filter((apt) => apt.status === "completed").length;
    return { total, today, upcoming, completed };
  };

  const stats = getStats();

  if (loading)
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-4 mt-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 mt-20">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Appointment Dashboard Card */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Appointments Dashboard
          </h2>
          <p className="text-gray-600">Overview of all appointments</p>
        </div>

        {/* Total Appointments Card */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Total Appointments
          </h2>
          <p className="text-blue-600 text-2xl font-bold">{stats.total}</p>
        </div>
      </div>
        

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Stats */}
      

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center border rounded-lg px-3 py-2 w-full sm:w-auto flex-1">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search patients, doctors, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none"
            />
          </div>
        </div>

        {/* Appointment List */}
        {filteredAppointments.length > 0 ? (
          <div className="space-y-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition duration-200 border overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2 sm:gap-0">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          apt.status
                        )}`}
                      >
                        {getStatusText(apt.status)}
                      </span>
                      <span className="text-sm text-gray-500">ID: #{apt.id}</span>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <div className="flex items-center text-blue-600 font-medium gap-1 sm:gap-2">
                        <FaCalendarAlt />
                        {formatDate(apt.date)}
                      </div>
                      <div className="flex items-center text-blue-600 font-medium gap-1 sm:gap-2 mt-1">
                        <FaClock />
                        {formatTime(apt.time)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Patient Info */}
                    <div className="sm:border-r sm:border-gray-200 sm:pr-4">
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
                        <FaUser className="mr-2 text-blue-600" /> Patient Information
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>Name:</strong> {apt.patientName}
                        </p>
                        <p className="flex items-center">
                          <FaEnvelope className="mr-1" /> {apt.email}
                        </p>
                        <p className="flex items-center">
                          <FaPhone className="mr-1" /> {apt.phone}
                        </p>
                        {apt.reason && (
                          <p>
                            <strong>Reason:</strong> {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm sm:text-base">
                        <FaStethoscope className="mr-2 text-green-600" /> Doctor Information
                      </h3>
                      {apt.doctor ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          {apt.doctor.photo ? (
                            <img
                              src={`data:image/jpeg;base64,${apt.doctor.photo}`}
                              alt={apt.doctor.model_name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                              Dr
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold">{apt.doctor.model_name}</h4>
                            <p className="text-green-600 text-sm">{apt.doctor.category}</p>
                            <p className="text-xs text-gray-600">
                              {apt.doctor.model_hospital} | {apt.doctor.model_experience} yrs | Fee: ₹
                              {parseFloat(apt.doctor.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-red-600 text-sm">Doctor information not available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FaCalendarAlt className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {appointments.length === 0
                ? "No appointments found"
                : "No appointments match your filters"}
            </h3>
            <p className="text-gray-600">
              {appointments.length === 0
                ? "There are no appointments in the system yet."
                : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
