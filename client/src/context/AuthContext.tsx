import React, { createContext, useReducer, Dispatch, useEffect } from "react";

// Define the user interface based on your user schema
interface User {
  email: string;
  token: string;
}

// Define the state shape for authentication
interface AuthState {
  user: User | null;
}

// Define the action types
type Action = { type: "LOGIN"; user: User } | { type: "LOGOUT" };

// Define the context type
export interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<Action>;
  user: User | null;
}

// Create the initial state
const initialState: AuthState = {
  user: null,
};

// Type for AuthProvider
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define the reducer function
function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "LOGIN":
      return { user: action.user };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
}

// Create the context provider component
export function AuthContextProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user: User = JSON.parse(userString);
      dispatch({ type: "LOGIN", user: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, user: state.user }}>
      {children}
    </AuthContext.Provider>
  );
}
