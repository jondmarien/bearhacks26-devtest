import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const error = location.state?.error || "An unexpected error occurred.";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="p-4 bg-red-500/10 rounded-full mb-6 border border-red-500/20">
          <svg
            className="w-12 h-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
        <p className="text-gray-400 max-w-md mb-8">
          We encountered a critical error while processing your request. Our
          bears are looking into it.
        </p>

        <div className="bg-black/40 border border-gray-700 rounded-xl p-6 text-left max-w-2xl w-full mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Error Report
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(error, null, 2));
                alert("Copied to clipboard!");
              }}
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Copy Details
            </button>
          </div>
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap custom-scrollbar max-h-40">
            {typeof error === "string" ? error : JSON.stringify(error, null, 2)}
          </pre>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-bold rounded-full hover:brightness-110 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-gray-800 text-white font-bold rounded-full border border-gray-700 hover:bg-gray-700 transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
