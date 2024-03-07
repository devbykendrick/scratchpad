import React, { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    // Scroll to the bottom only if there are new messages added
    if (chatEndRef.current && decks.length > 0) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [decks]);

  return (
    <>
      <main>
        <Navbar />
        <div className="px-4 py-20 overflow-y-auto h-screen">
          {decks.map((deck) => (
            <div
              key={deck._id}
              className="flex flex-col w-full leading-1.5 p-4 border-gray-200 bg-[#217DF7] rounded-s-xl rounded-ee-xl mb-5"
            >
              <div className="flex justify-between items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-normal text-gray-300">
                  {new Date(deck.createdAt).toLocaleDateString()}
                </span>
                <div>
                  <DropdownMenu
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
