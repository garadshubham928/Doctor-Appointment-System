// import React, { useState, useEffect } from "react";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import { Stethoscope, Menu, X } from "lucide-react";
// import {
//   FaStar,
//   FaUserMd,
//   FaHospital,
//   FaMoneyBillWave,
//   FaSearch,
//   FaFilter,
// } from "react-icons/fa";

// export default function Home() {
//   const [models, setModels] = useState([]);
//   const [message, setMessage] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterCategory, setFilterCategory] = useState("All");
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [appointmentDetails, setAppointmentDetails] = useState({
//     patientName: "",
//     email: "",
//     phone: "",
//     reason: "",
//     date: "",
//     time: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   // Fetch all doctors
//   const fetchModels = async () => {
//     try {
//       const response = await fetch("https://doctor-appointment-system-9chq.onrender.com/api/models");
//       if (response.ok) {
//         const data = await response.json();
//         setModels(data);
//       } else {
//         setMessage("Failed to fetch doctors");
//       }
//     } catch (error) {
//       setMessage("Error fetching doctors: " + error.message);
//     }
//   };

//   useEffect(() => {
//     fetchModels();
//   }, []);

//   const categories = ["All", ...new Set(models.map((m) => m.category))];

//   const filteredModels = models.filter((m) => {
//     const matchesSearch = m.model_name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       filterCategory === "All" || m.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Reset messages after 5 seconds
//   useEffect(() => {
//     if (errorMessage || successMessage) {
//       const timer = setTimeout(() => {
//         setErrorMessage("");
//         setSuccessMessage("");
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [errorMessage, successMessage]);

//   // Handle appointment booking with proper error handling
//   const handleBookAppointment = async () => {
//     if (
//       !appointmentDetails.patientName ||
//       !appointmentDetails.email ||
//       !appointmentDetails.phone ||
//       !appointmentDetails.date ||
//       !appointmentDetails.time
//     ) {
//       setErrorMessage("Please fill all required fields!");
//       return;
//     }

//     setIsLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const res = await fetch("https://doctor-appointment-system-9chq.onrender.com/api/appointments", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           doctorId: selectedDoctor.id,
//           patientName: appointmentDetails.patientName,
//           email: appointmentDetails.email,
//           phone: appointmentDetails.phone,
//           reason: appointmentDetails.reason,
//           date: appointmentDetails.date,
//           time: appointmentDetails.time,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok && data.success) {
//         setSuccessMessage(
//           data.message || "Appointment booked successfully! Confirmation emails have been sent."
//         );
//         setSelectedDoctor(null);
//         setAppointmentDetails({
//           patientName: "",
//           email: "",
//           phone: "",
//           reason: "",
//           date: "",
//           time: "",
//         });
//       }
//        else if (res.status === 409) {
//         // Handle 409 conflict specifically without showing console error
//         setErrorMessage(
//           "⚠️ This time slot is already booked! Please select a different time."
//         );
//       } 
//       else {
//         setErrorMessage( "Failed to book appointment");
//       }
//     } catch (err) {
//       setErrorMessage("Network error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
//         <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
//           {/* Logo Section */}
//           <div className="flex items-center gap-2">
//             <div className="bg-blue-600 text-white p-2 rounded-lg">🏥</div>
//             <h1 className="text-2xl font-bold text-gray-800">HealthCare</h1>
//           </div>

//           {/* Desktop Links */}
//           <div className="hidden md:flex gap-4">
//             <a
//               href="/Home"
//               className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
//             >
//               Home
//             </a>
//             <a
//               href="/Myappointments"
//               className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
//             >
//               My Appointments
//             </a>
//             <a
//               href="/Doctorlogin"
//               className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
//             >
//               🔒 Department Login
//             </a>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-gray-700 focus:outline-none"
//           >
//             {isOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>

//         {/* Mobile Links */}
//         {isOpen && (
//           <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-3">
//             <a
//               href="/Home"
//               className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
//             >
//               Home
//             </a>
//             <a
//               href="/Myappointments"
//               className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
//             >
//               My Appointments
//             </a>
//             <a
//               href="/Doctorlogin"
//               className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
//             >
//               🔒 Department Login
//             </a>
//           </div>
//         )}
//       </nav>

//       <div className="p-6 pt-20">
//         {/* Success/Error Messages */}
//         {successMessage && (
//           <div className="mb-6 p-4 rounded-md bg-green-100 text-green-700 border border-green-300">
//             ✅ {successMessage}
//           </div>
//         )}

//         {errorMessage && (
//           <div className="mb-6 p-4 rounded-md bg-red-100 text-red-700 border border-red-300">
//             ❌ {errorMessage}
//           </div>
//         )}

//         <div className="bg-gradient-to-r from-blue-500 to-purple-400 text-white text-center py-12 px-6 rounded-3xl mb-8 shadow-xl">
//           <h1 className="text-4xl md:text-5xl font-bold mb-4">
//             Find Your Doctor
//           </h1>
//           <p className="text-xl opacity-90">
//             Book Appointments with experienced healthcare professionals
//           </p>
//         </div>

//         {message && (
//           <div
//             className={`mb-6 p-4 rounded-md ${
//               message.includes("Error")
//                 ? "bg-red-100 text-red-700"
//                 : "bg-green-100 text-green-700"
//             }`}
//           >
//             {message}
//           </div>
//         )}

//         {/* Search & Filter */}
//         <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow">
//           <div className="flex items-center w-full md:w-2/3 border rounded-lg px-3 py-2 shadow-sm">
//             <FaSearch className="text-gray-400 mr-2" />
//             <input
//               type="text"
//               placeholder="Search doctors or specializations..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full outline-none"
//             />
//           </div>

//           <div className="flex items-center w-full md:w-1/3 border rounded-lg px-3 py-2 shadow-sm">
//             <FaFilter className="text-gray-400 mr-2" />
//             <select
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//               className="w-full outline-none bg-transparent"
//             >
//               {categories.map((cat, index) => (
//                 <option key={index} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Doctor Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {filteredModels.length > 0 ? (
//             filteredModels.map((m) => (
//               <div
//                 key={m.id}
//                 className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
//               >
//                 <div className="flex items-center space-x-4">
//                   {m.photo ? (
//                     <img
//                       src={`data:image/jpeg;base64,${m.photo}`}
//                       alt={m.model_name}
//                       className="h-16 w-16 object-cover rounded-full border"
//                     />
//                   ) : (
//                     <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
//                       No Img
//                     </div>
//                   )}
//                   <div>
//                     <h2 className="text-lg font-semibold">{m.model_name}</h2>
//                     <p className="text-blue-600 font-medium">{m.category}</p>
//                   </div>
//                 </div>

//                 <div className="mt-4 space-y-2 text-gray-700 text-sm">
//                   <p className="flex items-center">
//                     <FaStar className="text-yellow-500 mr-2" /> {m.rating} ⭐
//                   </p>
//                   <p className="flex items-center">
//                     <FaUserMd className="mr-2" /> {m.model_experience} years
//                     experience
//                   </p>
//                   <p className="flex items-center">
//                     <FaHospital className="mr-2" /> {m.model_hospital}
//                   </p>
//                   <p className="flex items-center">
//                     <FaMoneyBillWave className="mr-2" /> ₹
//                     {parseFloat(m.price).toFixed(2)} consultation fee
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => setSelectedDoctor(m)}
//                   className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Book Appointment
//                 </button>
//               </div>
//             ))
//           ) : (
//             <h1 className="text-center col-span-full text-black">Loading...!</h1>
//           )}
//         </div>
//       </div>
//       <Footer />

//       {/* Booking Modal */}
//       {selectedDoctor && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">
//               Book Appointment with Dr. {selectedDoctor.model_name}
//             </h2>

//             {/* Show success/error in modal */}
//             {errorMessage && (
//               <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
//                 {errorMessage}
//               </div>
//             )}

//             {successMessage && (
//               <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
//                 {successMessage}
//               </div>
//             )}

//             {/* Patient Info */}
//             <input
//               type="text"
//               placeholder="Your Name *"
//               className="w-full p-2 border rounded mb-2"
//               value={appointmentDetails.patientName}
//               onChange={(e) =>
//                 setAppointmentDetails({
//                   ...appointmentDetails,
//                   patientName: e.target.value,
//                 })
//               }
//               disabled={isLoading}
//             />
//             <input
//               type="email"
//               placeholder="Your Email *"
//               className="w-full p-2 border rounded mb-2"
//               value={appointmentDetails.email}
//               onChange={(e) =>
//                 setAppointmentDetails({
//                   ...appointmentDetails,
//                   email: e.target.value,
//                 })
//               }
//               disabled={isLoading}
//             />
//             <input
//               type="text"
//               placeholder="Phone Number *"
//               className="w-full p-2 border rounded mb-2"
//               value={appointmentDetails.phone}
//               onChange={(e) =>
//                 setAppointmentDetails({
//                   ...appointmentDetails,
//                   phone: e.target.value,
//                 })
//               }
//               disabled={isLoading}
//             />
//             <input
//               type="text"
//               placeholder="Reason for visit (optional)"
//               className="w-full p-2 border rounded mb-2"
//               value={appointmentDetails.reason}
//               onChange={(e) =>
//                 setAppointmentDetails({
//                   ...appointmentDetails,
//                   reason: e.target.value,
//                 })
//               }
//               disabled={isLoading}
//             />

//             {/* Date & Time */}
//             <input
//               type="date"
//               className="w-full p-2 border rounded mb-2"
//               value={appointmentDetails.date}
//               min={new Date().toISOString().split('T')[0]} // Prevent past dates
//               onChange={(e) =>
//                 setAppointmentDetails({
//                   ...appointmentDetails,
//                   date: e.target.value,
//                 })
//               }
//               disabled={isLoading}
//             />
//             <input
//               type="time"
//               className="w-full p-2 border rounded mb-4"
//               value={appointmentDetails.time}
//               onChange={(e) =>
//                 setAppointmentDetails({
//                   ...appointmentDetails,
//                   time: e.target.value,
//                 })
//               }
//               disabled={isLoading}
//             />

//             <div className="flex justify-between">
//               <button
//                 onClick={() => {
//                   setSelectedDoctor(null);
//                   setErrorMessage("");
//                   setSuccessMessage("");
//                 }}
//                 className="bg-gray-400 text-white px-4 py-2 rounded"
//                 disabled={isLoading}
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={handleBookAppointment}
//                 className={`px-4 py-2 rounded text-white ${
//                   isLoading 
//                     ? 'bg-gray-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//                 disabled={isLoading}
//               >
//                 {isLoading ? 'Booking...' : 'Confirm'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { Stethoscope, Menu, X } from "lucide-react";
import { SiWorldhealthorganization } from "react-icons/si";

import {
  FaStar,
  FaUserMd,
  FaHospital,
  FaMoneyBillWave,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

export default function Home() {
  const [models, setModels] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    patientName: "",
    email: "",
    phone: "",
    reason: "",
    date: "",
    time: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all doctors
  const fetchModels = async () => {
    try {
      const response = await fetch("https://doctor-appointment-system-9chq.onrender.com/api/models");
      if (response.ok) {
        const data = await response.json();
        setModels(data);
      } else {
        setMessage("Failed to fetch doctors");
      }
    } catch (error) {
      setMessage("Error fetching doctors: " + error.message);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const categories = ["All", ...new Set(models.map((m) => m.category))];

  const filteredModels = models.filter((m) => {
    const matchesSearch = m.model_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Reset messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Handle appointment booking with proper error handling
  const handleBookAppointment = async () => {
    if (
      !appointmentDetails.patientName ||
      !appointmentDetails.email ||
      !appointmentDetails.phone ||
      !appointmentDetails.date ||
      !appointmentDetails.time
    ) {
      setErrorMessage("Please fill all required fields!");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("https://doctor-appointment-system-9chq.onrender.com/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          patientName: appointmentDetails.patientName,
          email: appointmentDetails.email,
          phone: appointmentDetails.phone,
          reason: appointmentDetails.reason,
          date: appointmentDetails.date,
          time: appointmentDetails.time,
        }),
      }).then(response => {
        // Handle the response without throwing errors for expected status codes
        if (response.status === 409) {
          return response.json().then(data => ({ ...data, status: 409 }));
        }
        if (!response.ok) {
          return response.json().then(data => ({ ...data, status: response.status, error: true }));
        }
        return response.json().then(data => ({ ...data, status: response.status }));
      });

      if (res.status === 200 && res.success) {
        setSuccessMessage(
          res.message || "Appointment booked successfully! Confirmation emails have been sent."
        );
        setSelectedDoctor(null);
        setAppointmentDetails({
          patientName: "",
          email: "",
          phone: "",
          reason: "",
          date: "",
          time: "",
        });
      } else if (res.status === 409) {
        // Handle 409 conflict without console error
        setErrorMessage(
          "⚠️ This time slot is already booked! Please select a different time."
        );
      } else {
        setErrorMessage(res.error || "Failed to book appointment");
      }
    } catch (err) {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

      <div className="p-6 pt-20">
        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-md bg-green-100 text-green-700 border border-green-300">
            ✅ {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 p-4 rounded-md bg-red-100 text-red-700 border border-red-300">
            ❌ {errorMessage}
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-500 to-purple-400 text-white text-center py-3 px-3 rounded-3xl mb-4 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your Doctor
          </h1>
          <p className="text-xl opacity-90">
            Book Appointments with experienced zeromedixin professionals
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow">
          <div className="flex items-center w-full md:w-2/3 border rounded-lg px-3 py-2 shadow-sm">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search doctors or specializations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center w-full md:w-1/3 border rounded-lg px-3 py-2 shadow-sm">
            <FaFilter className="text-gray-400 mr-2" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full outline-none bg-transparent"
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredModels.length > 0 ? (
            filteredModels.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center space-x-4">
                  {m.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${m.photo}`}
                      alt={m.model_name}
                      className="h-16 w-16 object-cover rounded-full border"
                    />
                  ) : (
                    <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
                      No Img
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{m.model_name}</h2>
                    <p className="text-blue-600 font-medium">{m.category}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-gray-700 text-sm">
                  <p className="flex items-center">
                    <FaStar className="text-yellow-500 mr-2" /> {m.rating} ⭐
                  </p>
                  <p className="flex items-center">
                    <FaUserMd className="mr-2" /> {m.model_experience} years
                    experience
                  </p>
                  <p className="flex items-center">
                    <FaHospital className="mr-2" /> {m.model_hospital}
                  </p>
                  <p className="flex items-center">
                    <FaMoneyBillWave className="mr-2" /> ₹
                    {parseFloat(m.price).toFixed(2)} consultation fee
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDoctor(m)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Book Appointment
                </button>
              </div>
            ))
          ) : (
            <h1 className="text-center col-span-full text-black">Loading...!</h1>
          )}
        </div>
      </div>
      <Footer />

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              Book Appointment with Dr. {selectedDoctor.model_name}
            </h2>

            {/* Show success/error in modal */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-sm">
                {successMessage}
              </div>
            )}

            {/* Patient Info */}
            <input
              type="text"
              placeholder="Your Name *"
              className="w-full p-2 border rounded mb-2"
              value={appointmentDetails.patientName}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  patientName: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <input
              type="email"
              placeholder="Your Email *"
              className="w-full p-2 border rounded mb-2"
              value={appointmentDetails.email}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  email: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Phone Number *"
              className="w-full p-2 border rounded mb-2"
              value={appointmentDetails.phone}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  phone: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <input
              type="text"
              placeholder="Reason for visit (optional)"
              className="w-full p-2 border rounded mb-2"
              value={appointmentDetails.reason}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  reason: e.target.value,
                })
              }
              disabled={isLoading}
            />

            {/* Date & Time */}
            <input
              type="date"
              className="w-full p-2 border rounded mb-2"
              value={appointmentDetails.date}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  date: e.target.value,
                })
              }
              disabled={isLoading}
            />
            <input
              type="time"
              className="w-full p-2 border rounded mb-4"
              value={appointmentDetails.time}
              onChange={(e) =>
                setAppointmentDetails({
                  ...appointmentDetails,
                  time: e.target.value,
                })
              }
              disabled={isLoading}
            />

            <div className="flex justify-between">
              <button
                onClick={() => {
                  setSelectedDoctor(null);
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="bg-gray-400 text-white px-4 py-2 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>

              <button
                onClick={handleBookAppointment}
                className={`px-4 py-2 rounded text-white ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Booking...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

}
