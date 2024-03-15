import { useAuthContext } from "./useAuthContext";

interface LogoutProps {
  logout: () => void;
}

export function useLogout(): LogoutProps {
  const { dispatch } = useAuthContext();

  function logout() {
    // Remove user from storage
    localStorage.removeItem("user");
    localStorage.setItem("signedIn", "false");

    // Dispatch logout action
    dispatch({ type: "LOGOUT" });
  }

  return { logout };
}
