import { API_URL } from "./config";

export async function deleteDeck(deckId: string, token: string) {
  fetch(`${API_URL}/decks/${deckId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
