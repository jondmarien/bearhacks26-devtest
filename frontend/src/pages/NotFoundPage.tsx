import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] -z-10 animate-pulse delay-75" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="relative mb-8">
          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-gray-700 select-none opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold tracking-tighter text-purple-400">
              LOST IN SPACE
            </span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
          The page you're looking for was either devoured by a bear or moved to
          a different dimension.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
