import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    // Support both new keys and legacy keys used across the app
    const storedUser = localStorage.getItem("user") || localStorage.getItem("learnix_user");
    const storedProfile = localStorage.getItem("profile");
    const storedToken = localStorage.getItem("token") || localStorage.getItem("learnix_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // storedUser might already be a stringified user or just a plain string
        setUser(storedUser);
      }
      if (storedProfile) {
        try { setProfile(JSON.parse(storedProfile)); } catch (e) { setProfile(storedProfile); }
      }
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login function - save to localStorage
  const login = (userData, profileData, authToken) => {
    // Save to both new keys and legacy keys so older components keep working
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("learnix_user", JSON.stringify(userData));
    if (profileData) {
      localStorage.setItem("profile", JSON.stringify(profileData));
    }
    localStorage.setItem("token", authToken);
    localStorage.setItem("learnix_token", authToken);
    setUser(userData);
    setProfile(profileData);
    setToken(authToken);
  };

  // Logout function - clear localStorage
  const logout = () => {
    // Clear both new and legacy keys
    localStorage.removeItem("user");
    localStorage.removeItem("learnix_user");
    localStorage.removeItem("profile");
    localStorage.removeItem("token");
    localStorage.removeItem("learnix_token");
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, profile, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

