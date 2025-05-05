import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-700/50 mt-12 md:mt-16 lg:mt-20">
      <div className="container mx-auto px-12 py-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400 text-sm mb-4 md:mb-0">AstroStats</p>
        <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
          <Link
            href="/legal/privacy-policy"
            className="text-gray-400 hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="/legal/terms-of-service"
            className="text-gray-400 hover:text-white"
          >
            Terms of Service
          </Link>
        </div>
        <p className="text-gray-500 text-xs mt-4 md:mt-0">
          &copy; {currentYear} AstroStats. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
