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
      const res = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      if (res.data.authenticated) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
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
