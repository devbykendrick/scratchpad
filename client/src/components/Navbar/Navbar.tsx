import { Link } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

interface NavbarProps {
  signedIn: boolean;
  setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Navbar({ signedIn, setSignedIn }: NavbarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useLogout();
  const { user } = useAuthContext();

  function handleClick() {
    logout();
  }

  function handleLogout() {
    setShowLogoutModal(true);
  }

  function confirmLogout() {
    setSignedIn(false);
    localStorage.setItem("signedIn", "false");
    googleLogout();
    logout();
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
    <nav className="bg-black text-white p-4 fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <div className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width="60"
              height="60"
            >
              <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M25.485 30.865h0v-6.811h0a4.606 4.606 0 0 1 1.108-3 12.252 12.252 0 0 0 2.929-8.607A11.921 11.921 0 0 0 18.768 1.033a11.8 11.8 0 0 0-12.513 11.5h-.013L4.053 17.87a.935.935 0 0 0 .652 1.221l2.377.546.593 6.729a.911.911 0 0 0 .894.831h4.763v3.668"
              ></path>
              <path
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h2"
              ></path>
              <path
                fill="none"
                stroke="#FBA3E1"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m24.5 7.5-7 9M25.5 8.5l-7 9M20.5 8.5l4 4M19.5 9.5l4 4"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl font-semibold ">Scratch Pad</h1>
        </Link>
        {user && (
          <div>
            <button onClick={handleClick}>Log Out</button>
          </div>
        )}
        {!user && (
          <div>
            <Link to="/login" className="text-xl font-bold">
              Login
            </Link>
            {/* <Link to="/signup" className="text-xl font-bold">
              Signup
            </Link> */}
          </div>
        )}
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
                    Are you sure you want to logout of Scratch Pad?
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
