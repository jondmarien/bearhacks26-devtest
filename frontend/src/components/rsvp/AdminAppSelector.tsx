import React from "react";

interface AdminApp {
  _id: string;
  basicInfo: { fullName: string };
  createdAt: string;
}

interface AdminAppSelectorProps {
  apps: AdminApp[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const AdminAppSelector: React.FC<AdminAppSelectorProps> = ({
  apps,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="mb-8 w-full max-w-md bg-gray-800 p-4 rounded-xl border border-gray-700 font-primary text-center">
      <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-2">
        Select Test Application
      </label>
      <div className="relative group">
        <select
          className="w-full bg-gray-700 p-3 rounded-xl text-white outline-none border border-gray-600 focus:border-purple-500 transition-all appearance-none cursor-pointer pr-10 font-bold"
          value={selectedId || ""}
          onChange={(e) => onSelect(e.target.value)}
        >
          {apps.map((app) => (
            <option key={app._id} value={app._id}>
              {app.basicInfo.fullName} -{" "}
              {new Date(app.createdAt).toLocaleTimeString()}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-400 transition-colors">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AdminAppSelector;
