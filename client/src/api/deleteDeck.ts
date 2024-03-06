import { API_URL } from "./config";

export async function deleteDeck(deckId: string) {
  fetch(`${API_URL}/decks/${deckId}`, {
    method: "DELETE",
  });
}
