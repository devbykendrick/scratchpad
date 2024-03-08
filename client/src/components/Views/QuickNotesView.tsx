import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../api/config";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { deleteDeck } from "../../api/deleteDeck";
import { getDecks, TDeckProps } from "../../api/getDecks";
import { createDeck } from "../../api/createDeck";
import { updateDeck } from "../../api/updateDeck";
import DropdownMenu from "../DropdownMenu";
import Navbar from "../Navbar/Navbar";

function QuickNotesView() {
  const [decks, setDecks] = useState<TDeckProps[]>([]);
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deckIdToUpdate, setDeckIdToUpdate] = useState("");
  const [deckIdToDelete, setDeckIdToDelete] = useState("");

  // START Google Calendar API

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
    flow: "auth-code",
  });

  function handleSubmit(e: React.FormEvent) {
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

  // END Google Calendar API

  const chatEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling to the bottom

  async function handleUpdate(deckId: string) {
    setDeckIdToUpdate(deckId);
    setShowUpdateModal(true);
  }

  async function handleCreateDeck(e: React.FormEvent) {
    e.preventDefault();
    const deck = await createDeck(title);
    setDecks([...decks, deck]);
    setTitle("");
  }

  async function handleDeleteConfirmation(deckId: string) {
    setDeckIdToDelete(deckId);
    setShowDeleteModal(true);
  }

  async function handleDeleteDeck() {
    if (deckIdToDelete) {
      await deleteDeck(deckIdToDelete);
      setDecks(decks.filter((deck) => deck._id !== deckIdToDelete));
    }
    setShowDeleteModal(false);
    setShowCalendarModal(false);
  }

  async function saveUpdatedTitle() {
    if (deckIdToUpdate) {
      await updateDeck(deckIdToUpdate, newTitle);
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
    (async () => {
      const newDecks = await getDecks();
      setDecks(newDecks);
    })();
  }, []);

  useEffect(() => {
    // Scroll to the bottom
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({
        behavior: "smooth",
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

  return (
    <>
      <Navbar signedIn={signedIn} setSignedIn={setSignedIn} />
      <main>
        <div>
          <div className="px-4 mb-3 fixed top-16 bottom-16 left-0 right-0 overflow-y-auto pt-8">
            {" "}
            {/* Position container between Navbar and form */}
            {decks.map((deck) => (
              <div
                key={deck._id}
                className="flex flex-col w-full leading-1.5 py-4 pl-4 pr-2 border-gray-200 bg-[#217DF7] rounded-s-xl rounded-ee-xl mb-5"
              >
                <div className="flex justify-between items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-normal text-gray-300">
                    {new Date(deck.createdAt).toLocaleDateString()}
                  </span>
                  <div>
                    <DropdownMenu
                      onCalendarClick={() => handleCalendar(deck._id)}
                      onUpdateClick={() => handleUpdate(deck._id)}
                      onDeleteClick={() => handleDeleteConfirmation(deck._id)}
                    />
                  </div>
                </div>
                <p className="font-normal py-2.5 text-gray-900 dark:text-white">
                  {deck.title}
                </p>
              </div>
            ))}
            <div ref={chatEndRef}></div> {/* Scroll target */}
          </div>
          <form
            onSubmit={handleCreateDeck}
            className="flex fixed bottom-0 left-0 right-0 p-4 border-t bg-[#242424] border-gray-300"
          >
            <input
              id="deck-title"
              className="border-2 border-gray-300 rounded-lg py-2 px-4 mr-2 w-full focus:outline-none focus:border-blue-500"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(e.target.value);
              }}
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Send
            </button>
          </form>
        </div>
        {showUpdateModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 px-4">
            <div className="bg-[#242424] rounded-lg p-8 w-full menu">
              <h2 className="text-2xl font-bold mb-4">Update Message</h2>
              <textarea
                className="rounded w-full p-2 mb-4"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
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
            <div className="bg-[#242424] w-full rounded-lg p-8 menu">
              <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
              <p className="mb-5">Are you sure you want to remove this item?</p>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={() => handleDeleteDeck()}
                >
                  Yes
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
            <div className="rounded-lg p-8 bg-[#242424] w-full menu">
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
                      Title
                    </label>
                    <input
                      className="rounded p-2"
                      type="text"
                      id="summary"
                      onChange={(e) => setSummary(e.target.value)}
                      value={summary}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      className="rounded p-2"
                      id="description"
                      onChange={(e) => setDescription(e.target.value)}
                      value={description}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="location">
                      Location
                    </label>
                    <input
                      className="rounded p-2"
                      type="text"
                      id="location"
                      onChange={(e) => setLocation(e.target.value)}
                      value={location}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="startDateTime">
                      Start Date Time
                    </label>
                    <input
                      className="rounded p-2"
                      type="datetime-local"
                      id="startDateTime"
                      onChange={(e) => setStartDateTime(e.target.value)}
                      value={startDateTime}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="endDateTime">
                      End Date Time
                    </label>
                    <input
                      className="rounded p-2"
                      type="datetime-local"
                      id="endDateTime"
                      onChange={(e) => setEndDateTime(e.target.value)}
                      value={endDateTime}
                    />
                  </div>

                  <hr />
                  <div>
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
                  {/* <button onClick={() => signOut()}>Sign Out</button> */}
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
                          Yes
                        </button>
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
