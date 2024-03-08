import { useState, useEffect } from "react";

interface DropdownMenuProps {
  onUpdateClick: () => void;
  onDeleteClick: () => void;
  onCalendarClick: () => void;
}

function DropdownMenu({
  onUpdateClick,
  onDeleteClick,
  onCalendarClick,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCalendarClick = () => {
    onCalendarClick();
    setIsOpen(false);
  };

  const handleUpdateClick = () => {
    onUpdateClick();
    setIsOpen(false);
  };

  const handleDeleteClick = () => {
    onDeleteClick();
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideMenu = (event.target as HTMLElement).closest(
        ".dropdown-menu"
      );
      if (!clickedInsideMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="cursor-pointer inline-flex self-center items-center text-sm font-medium text-center focus:bg-[#185FBD] focus:rounded p-2"
      >
        <svg
          className="w-4 h-4 text-gray-300"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute -top-14 right-9 w-36 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dropdown-menu z-50">
          <div className="py-1">
            <button
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              onClick={handleCalendarClick}
            >
              Add to Calendar
            </button>
            <button
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              onClick={handleUpdateClick}
            >
              Edit
            </button>
            <button
              className="block px-4 py-3 text-sm text-red-700 hover:bg-red-100 hover:text-red-900 w-full text-left"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
