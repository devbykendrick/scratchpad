import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GOOGLE_API_URL } from "../../api/config";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { deleteDeck } from "../../api/deleteDeck";
import { getDecks, TDeckProps } from "../../api/getDecks";
import { createDeck } from "../../api/createDeck";
import { updateDeck } from "../../api/updateDeck";
import DropdownMenu from "../DropdownMenu";
import Navbar from "../Navbar/Navbar";
import { useAuthContext } from "../../hooks/useAuthContext";

function QuickNotesView() {
  const [decks, setDecks] = useState<TDeckProps[]>([]);
  const [title, setTitle] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deckIdToUpdate, setDeckIdToUpdate] = useState("");
  const [deckIdToDelete, setDeckIdToDelete] = useState("");

  const { user } = useAuthContext();

  /*
   *
   * START Google Calendar API
   *
   */

  const [signedIn, setSignedIn] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const [apiStatus, setApiStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleCalendar(deckId: string) {
    setDeckIdToUpdate(deckId);
    setDeckIdToDelete(deckId);
    setShowCalendarModal(true);
  }

  const login = useGoogleLogin({
    onSuccess: () => {
      setSignedIn(true);
      localStorage.setItem("signedIn", "true");
    },
    onError: (error) => console.log("Login Failed:", error),
    // flow: "auth-code",
  });

  type GroupedDecks = Record<string, TDeckProps[]>;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const groupedDecks: GroupedDecks = decks.reduce(
    (acc: GroupedDecks, deck: TDeckProps) => {
      const date = new Date(deck.createdAt);
      const formattedDate = `${days[date.getDay()]}, ${
        months[date.getMonth()]
      } ${date.getDate()} ${date.getFullYear()}`;
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(deck);
      return acc;
    },
    {}
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    axios
      .post(`${GOOGLE_API_URL}/create-event`, {
        summary,
        description,
        location,
        startDateTime,
        endDateTime,
      })
      .then((response) => {
        console.log(response.data);
        setApiStatus({ success: true, message: "Event created successfully" });
      })
      .catch((error) => {
        console.log(error.message);
        setApiStatus({ success: false, message: "Failed to create event" });
      });
    setSummary("");
    setDescription("");
    setLocation("");
    setStartDateTime("");
    setEndDateTime("");
  }

  useEffect(() => {
    const isSignedIn = localStorage.getItem("signedIn");
    if (isSignedIn === "true") {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, []);

  /*
   *
   * END Google Calendar API
   *
   */

  const chatEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the bottom

  async function handleUpdate(deckId: string) {
    setDeckIdToUpdate(deckId);
    setShowUpdateModal(true);
  }

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      throw new Error("You must be logged in");
    }

    try {
      const deckTitle = title.trim();
      if (deckTitle === "") return;
      const createdDeck = await createDeck(
        deckTitle,
        buttonClicked
          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          : "bg-[#217DF7]",
        buttonClicked ? "TASK" : "NOTES",
        user.token
      ); // Pass color to createDeck
      const newDeck: TDeckProps = {
        title: createdDeck.title,
        _id: createdDeck._id,
        createdAt: createdDeck.createdAt,
        color: buttonClicked
          ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          : "bg-[#217DF7]", // Set color based on button clicked
        header: buttonClicked ? "TASK" : "NOTES",
      };
      setDecks([...decks, newDeck]);
      setTitle("");
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };

  async function handleDeleteConfirmation(deckId: string) {
    setDeckIdToDelete(deckId);
    setShowDeleteModal(true);
  }

  async function handleDeleteDeck() {
    if (!user) {
      throw new Error("You must be logged in");
    }

    if (deckIdToDelete) {
      await deleteDeck(deckIdToDelete, user.token);
      setDecks(decks.filter((deck) => deck._id !== deckIdToDelete));
    }
    setShowDeleteModal(false);
    setShowCalendarModal(false);
  }

  async function saveUpdatedTitle() {
    if (!user) {
      throw new Error("You must be logged in");
    }

    if (deckIdToUpdate) {
      await updateDeck(deckIdToUpdate, newTitle, user.token);
      setDecks(
        decks.map((deck) =>
          deck._id === deckIdToUpdate ? { ...deck, title: newTitle } : deck
        )
      );
      setShowUpdateModal(false);
      setNewTitle("");
      setDeckIdToUpdate("");
    }
  }

  useEffect(() => {
    async function fetchDecks() {
      try {
        if (user) {
          const newDecks = await getDecks(user.token);
          setDecks(newDecks);
        }
      } catch (error) {
        console.error("Error fetching decks:", error);
      }
    }

    fetchDecks();
  }, [user]);

  useLayoutEffect(() => {
    // Scroll to the bottom when component mounts or updates
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }
  }, [decks]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsideMenu = (event.target as HTMLElement).closest(".menu");
      if (!clickedInsideMenu) {
        setShowUpdateModal(false);
        setShowDeleteModal(false);
        setShowCalendarModal(false);
        setApiStatus(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showUpdateModal && deckIdToUpdate) {
      const deckToUpdate = decks.find((deck) => deck._id === deckIdToUpdate);
      if (deckToUpdate) {
        setNewTitle(deckToUpdate.title);
      }
    }
  }, [showUpdateModal, deckIdToUpdate, decks]);

  useEffect(() => {
    if (showCalendarModal && deckIdToUpdate) {
      const deckToUpdate = decks.find((deck) => deck._id === deckIdToUpdate);
      if (deckToUpdate) {
        setDescription(deckToUpdate.title);
      }
    }
  }, [showCalendarModal, deckIdToUpdate, decks]);

  return (
    <>
      <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />
      <main>
        <div className="px-4 my-14 overflow-y-auto">
          {Object.entries(groupedDecks).map(([date, decks]) => (
            <div key={date}>
              <div className="text-gray-400 text-center mt-3 mb-2">{date}</div>
              {decks.map((deck) => (
                <div
                  key={deck._id}
                  className={`${deck.color} flex flex-col w-full leading-1.5 py-4 pl-4 pr-2 border-gray-200 rounded-s-xl rounded-se-xl mb-5`}
                >
                  <div className="flex justify-between items-center space-x-2 rtl:space-x-reverse">
                    <span className="text-xs font-bold text-gray-300">
                      {deck.header} <span> - </span>
                      {new Date(deck.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </span>
                    <div>
                      <DropdownMenu
                        onCalendarClick={() => handleCalendar(deck._id)}
                        onUpdateClick={() => handleUpdate(deck._id)}
                        onDeleteClick={() => handleDeleteConfirmation(deck._id)}
                      />
                    </div>
                  </div>
                  <p className="font-normal py-2.5 text-white">{deck.title}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <form
          onSubmit={handleCreateDeck}
          className="flex fixed bottom-0 left-0 right-0 bg-black bg-opacity-70 backdrop-blur-md p-3"
        >
          <button
            onClick={() => {
              setButtonClicked(true);
            }}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-2 rounded-full mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 46.99 48.49"
              width="24"
              height="24"
              id="task"
            >
              <path
                fill="white"
                d="M44.14 6.91h-2.88v3.86a1.5 1.5 0 0 1-3 0V6.91H25v3.86a1.5 1.5 0 0 1-3 0V6.91H8.77v3.86a1.5 1.5 0 0 1-3 0V6.91H2.85A2.85 2.85 0 0 0 0 9.76v35.86a2.86 2.86 0 0 0 2.85 2.85h41.29a2.85 2.85 0 0 0 2.85-2.85V9.78a2.84 2.84 0 0 0-2.85-2.87Zm-7.52 13.91L20.76 36.7a1.49 1.49 0 0 1-1.06.44 1.51 1.51 0 0 1-1.06-.44l-8.27-8.27a1.503 1.503 0 0 1 2.13-2.12l7.2 7.2 14.8-14.79a1.5 1.5 0 0 1 2.12 2.12Z"
              ></path>
              <path
                fill="white"
                d="M8.77 1.5v5.41h-3V1.48a1.5 1.5 0 1 1 3 0zM25 1.5v5.41h-3V1.48a1.5 1.5 0 1 1 3 0zm16.26 0v5.41h-3V1.48a1.5 1.5 0 1 1 3 0z"
              ></path>
            </svg>
          </button>
          <div className="flex items-center border border-gray-600 bg-black bg-opacity-0 backdrop-blur-sm rounded-full overflow-hidden w-full">
            <input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
              required
              id="deck-title"
              type="text"
              className="flex-1 px-4 py-2 bg-black bg-opacity-0 backdrop-blur-sm focus:outline-none"
            />
            <button
              onClick={() => {
                setButtonClicked(false);
              }}
              className="px-1 py-1 mr-1 focus:outline-none bg-[#217DF7] rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 512 512"
                id="up-arrow"
              >
                <path
                  fill="white"
                  d="M128.4 189.3L233.4 89c5.8-6 13.7-9 22.4-9s16.5 3 22.4 9l105.4 100.3c12.5 11.9 12.5 31.3 0 43.2-12.5 11.9-32.7 11.9-45.2 0L288 184.4v217c0 16.9-14.3 30.6-32 30.6s-32-13.7-32-30.6v-217l-50.4 48.2c-12.5 11.9-32.7 11.9-45.2 0-12.5-12-12.5-31.3 0-43.3z"
                ></path>
              </svg>
            </button>
          </div>
        </form>
        <div ref={chatEndRef}></div> {/* Scroll target */}
        {showUpdateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 px-4">
            <div className="bg-black rounded-lg p-8 w-full menu">
              <h2 className="text-2xl font-bold mb-4">Update Message</h2>
              <textarea
                className="bg-black border border-gray-600 rounded w-full p-2 mb-4"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={() => saveUpdatedTitle()}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 px-4">
            <div className="bg-black w-full rounded-lg p-8 menu">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-5">Are you sure you want to remove this item?</p>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={() => handleDeleteDeck()}
                >
                  Remove
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {showCalendarModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 px-4">
            <div className="rounded-lg p-8 bg-black w-full menu">
              {!apiStatus && !signedIn && (
                <div className="flex flex-col justify-center">
                  <div className="mb-5 text-center">
                    <h2 className="text-3xl font-bold mb-2">Log in</h2>
                    <p className="">
                      Click the button below to connect your Google Calendar!
                    </p>
                  </div>
                  <div onClick={() => login()} className="flex justify-center">
                    <div className="bg-white rounded-full p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        preserveAspectRatio="xMidYMid"
                        viewBox="0 0 256 262"
                        id="google"
                      >
                        <path
                          fill="#4285F4"
                          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        ></path>
                        <path
                          fill="#34A853"
                          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        ></path>
                        <path
                          fill="#FBBC05"
                          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        ></path>
                        <path
                          fill="#EB4335"
                          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              {!apiStatus && signedIn && (
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="summary">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="bg-black border border-gray-600 rounded p-2"
                      type="text"
                      id="summary"
                      onChange={(e) => setSummary(e.target.value)}
                      value={summary}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="bg-black border border-gray-600 rounded p-2"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="location">
                      Location
                    </label>
                    <input
                      className="bg-black border border-gray-600 rounded p-2"
                      type="text"
                      id="location"
                      onChange={(e) => setLocation(e.target.value)}
                      value={location}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="startDateTime">
                      Start Date Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="bg-black border border-gray-600 rounded p-2"
                      type="datetime-local"
                      id="startDateTime"
                      onChange={(e) => setStartDateTime(e.target.value)}
                      value={startDateTime}
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="endDateTime">
                      End Date Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="bg-black border border-gray-600 rounded p-2"
                      type="datetime-local"
                      id="endDateTime"
                      onChange={(e) => setEndDateTime(e.target.value)}
                      value={endDateTime}
                      required
                    />
                  </div>

                  <hr />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                    >
                      Create Calendar Event
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      onClick={() => setShowCalendarModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {apiStatus && signedIn && (
                <>
                  <div
                    className={`text-${
                      apiStatus.success ? "blue" : "red"
                    }-500 mb-4`}
                  >
                    {apiStatus.message}!
                  </div>
                  {apiStatus.success && (
                    <div>
                      <p className="mb-5">
                        Would you like to remove this message now that it's been
                        added to your Google Calendar?
                      </p>
                      <div className="flex justify-end">
                        <button
                          className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                          onClick={() => handleDeleteDeck()}
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => {
                            setShowCalendarModal(false);
                            setApiStatus(null);
                          }}
                          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                        >
                          Keep Message
                        </button>
                      </div>
                    </div>
                  )}
                  {!apiStatus.success && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setShowCalendarModal(false);
                          setApiStatus(null);
                        }}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default QuickNotesView;
