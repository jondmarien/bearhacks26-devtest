import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  discordId: string;
  username: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // 1. Check URL for token (first login)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");
      if (urlToken) {
        localStorage.setItem("authToken", urlToken);
        // Clean URL
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
      }

      // 2. Get token from storage
      const token = localStorage.getItem("authToken");

      console.log("Checking auth status...", `${API_URL}/auth/me`);
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      console.log("Auth response:", res.data);
      if (res.data.authenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      console.error("Auth check failed full error:", error);
      setUser(null);
      // Optional: don't clear default, but if 401, maybe clear?
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    window.location.href = `${API_URL}/auth/discord`;
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("authToken");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
