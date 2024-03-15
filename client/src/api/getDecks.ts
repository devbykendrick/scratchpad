import { API_URL } from "./config";
export interface TDeckProps {
  title: string;
  color: string;
  header: string;
  _id: string;
  createdAt: string;
}

// export async function getDecks(): Promise<TDeckProps[]> {
//   const { user } = useAuthContext();

//   const response = await fetch(`${API_URL}/decks`, {
//     headers: {
//       Authorization: `Bearer ${user?.token}`,
//     },
//   });

//   return response.json();
// }

export async function getDecks(token: string): Promise<TDeckProps[]> {
  const response = await fetch(`${API_URL}/decks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}
