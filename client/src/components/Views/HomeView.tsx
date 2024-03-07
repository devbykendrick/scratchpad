// import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useState } from "react";
import { API_URL } from "../../api/config";

function HomeView() {
  const [signedIn, setSignedIn] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      setSignedIn(true);
    },
    flow: "auth-code",
  });
  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(`${API_URL}/create-event`, {
        summary,
        description,
        location,
        startDateTime,
        endDateTime,
      })
      .then((response) => {
        console.log(response.data);
        setSignedIn(true);
      })
      .catch((error) => console.log(error.message));
  }
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
      {signedIn ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="summary">Summary</label>
          <input
            type="text"
            id="summary"
            onChange={(e) => setSummary(e.target.value)}
            value={summary}
          />
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            onChange={(e) => setLocation(e.target.value)}
            value={location}
          />
          <label htmlFor="startDateTime">Start Date Time</label>
          <input
            type="datetime-local"
            id="startDateTime"
            onChange={(e) => setStartDateTime(e.target.value)}
            value={startDateTime}
          />
          <label htmlFor="endDateTime">End Date Time</label>
          <input
            type="datetime-local"
            id="endDateTime"
            onChange={(e) => setEndDateTime(e.target.value)}
            value={endDateTime}
          />
          <hr />
          <button type="submit">Create Calendar Event</button>
          <p></p>
          {/* <button onClick={() => signOut()}>Sign Out</button> */}
        </form>
      ) : (
        <button onClick={() => login()}>Sign in with Google 🚀</button>
      )}
    </main>
  );
}

export default HomeView;
