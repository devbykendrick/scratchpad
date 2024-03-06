import { API_URL } from "./config";

export interface TDeckProps {
  title: string;
  _id: string;
}

export async function getDecks(): Promise<TDeckProps[]> {
  const response = await fetch(`${API_URL}/decks`);
  return response.json();
}
