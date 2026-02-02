import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/app/apply" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500">
        BearHacks 2026
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-lg text-center">
        The ultimate hackathon experience. Build, connect, and innovate with us.
      </p>
      <button
        onClick={login}
        className="px-8 py-3 bg-[#5865F2] hover:bg-[#4752C4] rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
      >
        Login with Discord
      </button>
    </div>
  );
};

export default LandingPage;
