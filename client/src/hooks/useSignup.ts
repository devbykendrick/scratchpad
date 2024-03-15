import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { USER_API_URL } from "../api/config";

export function useSignup() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  async function signup(email: string, password: string) {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${USER_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      // Save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      // Update the auth context
      dispatch({ type: "LOGIN", user: json });

      setIsLoading(false);
    }
  }

  return { signup, isLoading, error };
}
