import { createContext, useContext, useMemo, useState } from "react";

// Create the authentication context that will be shared across the app.
const AuthContext = createContext(null);

// Provider component that holds the authenticated user state and token.
export function AuthProvider({ children }) {
  // Initialize auth state from localStorage on app startup.
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Login stores the token and user details, then updates React state.
  const login = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Logout removes auth data from storage and clears React state.
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  // Compute whether the user is currently authenticated.
  const isAuthenticated = Boolean(token);

  // Memoize the context value so consumers do not re-render unnecessarily.
  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated
    }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook for consuming authentication state in components.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
