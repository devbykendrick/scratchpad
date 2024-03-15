import { AuthContext, AuthContextType } from "../context/AuthContext";
import { useContext } from "react";

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("useAuthContext must be used inside an AuthContextProvider");
  }

  return context;
}
