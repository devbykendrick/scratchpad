import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState } from "react";

interface NavbarProps {
  signedIn: boolean;
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({ signedIn, setSignedIn }: NavbarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  function handleLogout() {
    setShowLogoutModal(true);
  }

  function confirmLogout() {
    setSignedIn(false);
    localStorage.setItem("signedIn", "false");
    googleLogout();
    setShowLogoutModal(false);
    window.location.reload();
  }

  function cancelLogout() {
    setShowLogoutModal(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideMenu = (event.target as HTMLElement).closest(".menu");
      if (!clickedInsideMenu) {
        setShowLogoutModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold">
            Scratch Pad
          </Link>
        </div>
        {signedIn && (
          <>
            <button
              className="flex items-center space-x-4"
              onClick={() => handleLogout()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="30"
                height="30"
                id="logout"
              >
                <path
                  fill="white"
                  d="M4,12a1,1,0,0,0,1,1h7.59l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l4-4a1,1,0,0,0,.21-.33,1,1,0,0,0,0-.76,1,1,0,0,0-.21-.33l-4-4a1,1,0,1,0-1.42,1.42L12.59,11H5A1,1,0,0,0,4,12ZM17,2H7A3,3,0,0,0,4,5V8A1,1,0,0,0,6,8V5A1,1,0,0,1,7,4H17a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V16a1,1,0,0,0-2,0v3a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V5A3,3,0,0,0,17,2Z"
                ></path>
              </svg>
            </button>
            {showLogoutModal && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
                <div className="bg-black text-white p-8 rounded-lg mx-4 menu">
                  <p className="text-lg font-semibold">
                    Are you sure you want to logout of your Google account?
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded mr-4"
                      onClick={() => confirmLogout()}
                    >
                      Logout
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      onClick={() => cancelLogout()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
