import { API_URL } from "./config";

export interface TDeckProps {
  title: string;
  _id: string;
  createdAt: string;
  color: string;
  header: string;
}

export async function getDecks(): Promise<TDeckProps[]> {
  const response = await fetch(`${API_URL}/decks`);
  return response.json();
}
