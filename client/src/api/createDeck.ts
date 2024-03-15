import { API_URL } from "./config";

export async function createDeck(
  title: string,
  color: string,
  header: string,
  token: string
) {
  const response = await fetch(`${API_URL}/decks`, {
    method: "POST",
    body: JSON.stringify({
      title,
      color,
      header,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
}
