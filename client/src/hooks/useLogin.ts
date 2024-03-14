import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { USER_API_URL } from "../api/config";

export function useLogin() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  async function login(email: string, password: string) {
    setIsLoading(true);
    setError(null);

    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST,PATCH,OPTIONS",
    };

    const response = await fetch(`${USER_API_URL}/api/user/login`, {
      method: "POST",
      headers: headers,
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

  return { login, isLoading, error };
}
