import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NavbarModal from "./NavbarModal";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Define the title based on the current route
  let title = "Scratch Pad";
  if (location.pathname === "/quick-notes") {
    title = "Scratch Pad -> Quick Notes";
  } else if (location.pathname === "/reminders") {
    title = "Scratch Pad -> Reminders";
  }

  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            {title}
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="hover:underline">
            About
          </Link>
          <Link to="/quick-notes" className="hover:underline">
            Quick Notes
          </Link>
        </div>
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      <NavbarModal isOpen={isOpen} onClose={toggleMenu} />
    </nav>
  );
}

export default Navbar;
