import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function HomeView() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <main className="relative">
      <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />
      <div className="flex flex-col justify-center items-center h-screen">
        <Link to="/quick-notes">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded mb-4">
            Quick Notes
          </button>
        </Link>
      </div>
    </main>
  );
}

export default HomeView;
