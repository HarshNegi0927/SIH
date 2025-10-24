import React, { createContext, useContext, useState, useMemo } from "react";

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage, so the user stays logged in on refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // The login function
  const login = (userData, userToken) => {
    // 1. Update React state
    setToken(userToken);
    setUser(userData);

    // 2. Update localStorage
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // The logout function
  const logout = () => {
    // 1. Clear React state
    setToken(null);
    setUser(null);

    // 2. Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Memoize the context value to prevent unnecessary re-renders
  // We also derive `isAuthenticated` from the presence of a token
  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      isAuthenticated: !!token, // True if 'token' is not null or empty
    }),
    [token, user] // Re-compute only when token or user changes
  );

  // Wrap the children components with the AuthContext.Provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
