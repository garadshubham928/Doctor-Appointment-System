import React from "react";
import { Stethoscope, Phone, Mail, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-12">
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col items-center text-center">
        <p className="text-white text-sm mb-7">
          © 2025 Zeromedixine Appointment System. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
