import { API_URL } from "./config";

export async function updateDeck(
  deckId: string,
  newTitle: string,
  token: string
) {
  try {
    const response = await fetch(`${API_URL}/decks/${deckId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });

    if (response.ok) {
      return response.json();
    } else {
      console.error("Error updating user:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
}
