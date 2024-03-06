import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function HomeView() {
  return (
    <main className="relative">
      <Navbar />
      <div className="flex flex-col justify-center items-center h-screen">
        <Link to="/quick-notes">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded mb-4">
            Quick Notes
          </button>
        </Link>
        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded mb-4">
            Reminders
          </button>
        </Link>
        <Link to="/">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded">
            Blank Canvas
          </button>
        </Link>
      </div>
    </main>
  );
}

export default HomeView;
