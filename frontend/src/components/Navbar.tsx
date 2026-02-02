import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="w-full p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 z-10 border-b border-gray-800">
      <div
        className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer"
        onClick={() => navigate("/")}
      >
        BearHacks 2026
      </div>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300 hidden md:block">
              Hello, {user.username}
            </span>
            {user.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors text-white font-bold"
              >
                Admin
              </button>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors border border-gray-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="px-6 py-2 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg font-bold text-white text-sm transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
