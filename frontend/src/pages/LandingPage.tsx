import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative">
      {/* Navbar */}
      <nav className="w-full p-6 flex justify-between items-center bg-gray-900/50 backdrop-blur-md fixed top-0 left-0 z-10 border-b border-gray-800">
        <div className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 cursor-pointer">
          BearHacks 2026
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 hidden md:block">
                Hello, {user.username}
              </span>
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

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
        <h1 className="text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-500 to-pink-500 text-center leading-tight">
          BearHacks <br /> 2026
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl text-center leading-relaxed">
          The ultimate hackathon experience. <br />
          <span className="text-white">Build</span>,{" "}
          <span className="text-white">Connect</span>, and{" "}
          <span className="text-white">Innovate</span> with us.
        </p>

        {user ? (
          <div className="flex flex-col md:flex-row gap-6">
            <button
              onClick={() => navigate("/app/apply")}
              className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-lg hover:brightness-110 transition-all transform hover:scale-105 shadow-xl"
            >
              Go to Application
            </button>
            <button
              onClick={() => navigate("/app/rsvp")}
              className="px-8 py-4 bg-gray-800 border border-gray-600 hover:border-blue-400 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Check RSVP Status
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            className="px-10 py-5 bg-[#5865F2] hover:bg-[#4752C4] rounded-xl font-bold text-xl text-white transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
          >
            <svg
              className="w-8 h-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
            </svg>
            Login with Discord
          </button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
