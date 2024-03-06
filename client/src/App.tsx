import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteDeck } from "./api/deleteDeck";
import { getDecks, TDeckProps } from "./api/getDecks";
import { createDeck } from "./api/createDeck";
import { updateDeck } from "./api/updateDeck";
import "./App.css";

function App() {
  const [decks, setDecks] = useState<TDeckProps[]>([]);
  const [title, setTitle] = useState("");

  async function handleUpdate(deckId: string) {
    try {
      const updatedDeck = await updateDeck(deckId); // Pass new title
      setDecks(decks.map((deck) => (deck._id === deckId ? updatedDeck : deck)));
    } catch (error) {
      console.error("Error updating deck:", error);
    }
  }

  async function handleCreateDeck(e: React.FormEvent) {
    e.preventDefault();
    const deck = await createDeck(title);
    setDecks([...decks, deck]);
    setTitle("");
  }

  async function handleDeleteDeck(deckId: string) {
    await deleteDeck(deckId);
    setDecks(decks.filter((deck) => deck._id !== deckId));
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
              <button onClick={() => handleDeleteDeck(deck._id)}>X</button>
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
    </>
  );
}

export default App;
