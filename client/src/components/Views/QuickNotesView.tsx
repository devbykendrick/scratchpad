import React, { useEffect, useState } from "react";
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
    async function fetchDecks() {
      const newDecks = await getDecks();
      setDecks(newDecks);
    }
    fetchDecks();
  }, []);

  return (
    <>
      <main>
        <Navbar />
        <div className="px-4 py-20 overflow-y-auto h-screen">
          <ul>
            {decks.map((deck) => (
              <li key={deck._id} className="flex items-center justify-end mb-2">
                <p className="">{deck.title}</p>
                <div>
                  <DropdownMenu
                    onUpdateClick={() => handleUpdate(deck._id)}
                    onDeleteClick={() => handleDeleteConfirmation(deck._id)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <form
            onSubmit={handleCreateDeck}
            className="flex fixed bottom-0 left-0 right-0 p-4 border-t border-gray-300"
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
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white rounded-lg p-8 w-1/3">
              <h2 className="text-2xl mb-4">Update Title</h2>
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 mb-4 w-full"
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
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white rounded-lg p-8 w-1/3">
              <h2 className="text-2xl mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to remove this item?</p>
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
      </main>
    </>
  );
}

export default QuickNotesView;

{
  /* <div className="flex justify-end">
            <button
              id="dropdownMenuIconButton"
              data-dropdown-toggle="dropdownDots"
              data-dropdown-placement="bottom-start"
              className="inline-flex self-center items-center p-2 mr-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:focus:ring-gray-600"
              type="button"
            >
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 4 15"
              >
                <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
              </svg>
            </button>
            <div
              id="dropdownDots"
              className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-40 dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownMenuIconButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Reply
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Forward
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Copy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Report
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Delete
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-[#217DF7] rounded-s-xl rounded-ee-xl">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-normal text-gray-300">11:46</span>
              </div>
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
                That's awesome. I think our users will really appreciate the
                improvements.
              </p>
            </div>
          </div> */
}
