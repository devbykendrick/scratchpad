import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteDeck } from "./api/deleteDeck";
import { getDecks, TDeckProps } from "./api/getDecks";
import { createDeck } from "./api/createDeck";
import { updateDeck } from "./api/updateDeck";

function App() {
  const [decks, setDecks] = useState<TDeckProps[]>([]);
  const [title, setTitle] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
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
      <div className="App">
        <ul className="decks">
          {decks.map((deck) => (
            <li key={deck._id}>
              <button onClick={() => handleDeleteConfirmation(deck._id)}>
                X
              </button>
              {deck.title}
              <button onClick={() => handleUpdate(deck._id)}>
                Update User
              </button>
              <Link to={`decks/${deck._id}`}>Decks</Link>
            </li>
          ))}
        </ul>
        <form onSubmit={handleCreateDeck}>
          <label htmlFor="deck-title">Deck Title</label>
          <input
            id="deck-title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
            }}
          />
          <button>Create Deck</button>
        </form>
      </div>
      {showUpdateModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white rounded-lg p-8 w-1/3">
            <h2 className="text-2xl text-black mb-4">Update Title</h2>
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
            <h2 className="text-2xl text-black mb-4">Confirm Deletion</h2>
            <p className="text-black mb-10">
              Are you sure you want to remove this item?
            </p>
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
    </>
  );
}

export default App;
