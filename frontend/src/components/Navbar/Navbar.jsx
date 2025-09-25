import React, { useState } from "react";
import { Stethoscope, Menu, X } from "lucide-react";
import { SiWorldhealthorganization } from "react-icons/si";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
            className="px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
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
            href="/Totalappointments"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
          >
            Appointments
          </a>
          <a
            href="/Adminsection"
            className="px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
          >
            Admin Section
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
            href="/Totalappointments"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
          >
            Appointments
          </a>
          <a
            href="/Adminsection"
            className="block px-4 py-2 rounded-md text-gray-700 hover:bg-blue-600 hover:text-white transition"
          >
            Admin Section
          </a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
