import { useEffect, useState } from "react";
import "./App.css";

interface TDeckProps {
  title: string;
  _id: string;
}

function App() {
  const [decks, setDecks] = useState<TDeckProps[]>([]);
  const [title, setTitle] = useState("");

  function handleCreateDeck(e: React.FormEvent) {
    e.preventDefault();
    fetch("http://localhost:8000/decks", {
      method: "POST",
      body: JSON.stringify({
        title,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setTitle("");
  }

  useEffect(() => {
    async function fetchDecks() {
      const response = await fetch("http://localhost:8000/decks");
      const newDecks = await response.json();
      setDecks(newDecks);
    }
    fetchDecks();
  }, []);

  return (
    <>
      <div className="App">
        <ul className="decks">
          {decks.map((deck) => (
            <li key={deck._id}>{deck.title}</li>
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
