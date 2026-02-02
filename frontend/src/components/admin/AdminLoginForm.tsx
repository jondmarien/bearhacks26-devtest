import React, { useState } from "react";

interface AdminLoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  error?: string;
  loading?: boolean;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSubmit,
  error,
  loading,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(username, password);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-sm w-full border border-gray-700/50 ring-1 ring-white/5 font-primary">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-4 shadow-xl">
          <svg
            className="w-8 h-8 text-purple-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter">
          Admin Portal
        </h2>
        <p className="text-gray-400 text-sm mt-2 font-medium">
          Authorized Access Only
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm text-center font-bold animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
            Username
          </label>
          <input
            type="text"
            placeholder="bear_king"
            className="w-full bg-gray-900/50 p-4 rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600 font-bold"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full bg-gray-900/50 p-4 rounded-xl border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-600 font-bold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-linear-to-r from-purple-600 to-blue-600 hover:brightness-110 rounded-2xl font-black text-xl transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 border border-white/10 mt-4 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Authenticate"
          )}
        </button>
      </form>
    </div>
  );
};

export default AdminLoginForm;
