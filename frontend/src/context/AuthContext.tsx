import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import Logger from "@/utils/Logger";

interface User {
  id: string;
  discordId: string;
  username: string;
  avatar?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithPassword: (username: string, password: string) => Promise<void>;
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

      Logger.debug(`Checking auth status... ${API_URL}/auth/me`);
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      Logger.debug("Auth response:", res.data);
      if (res.data.authenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("authToken");
      }
    } catch (error) {
      Logger.error("Auth check failed:", error);
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

  const loginWithPassword = async (username: string, password: string) => {
    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        { withCredentials: true },
      );
      const { token, user } = res.data;
      localStorage.setItem("authToken", token);
      setUser(user);
    } catch (error) {
      Logger.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("authToken");
      window.location.href = "/";
    } catch (error) {
      Logger.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, loginWithPassword, logout }}
    >
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
