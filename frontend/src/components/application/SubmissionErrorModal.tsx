import React from "react";

interface SubmissionErrorModalProps {
  error: { message: string; details?: any };
  onClose: () => void;
  onCopy: () => void;
}

const SubmissionErrorModal: React.FC<SubmissionErrorModalProps> = ({
  error,
  onClose,
  onCopy,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gray-800 border border-red-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col ring-1 ring-red-500/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <svg
                className="w-6 h-6 text-red-500"
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
            <h3 className="text-xl font-bold text-white">Submission Error</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor font-bold"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-gray-300 mb-4 font-medium">{error.message}</p>

        <div className="bg-black/50 rounded-xl p-4 mb-6 border border-gray-700">
          <p className="text-xs font-mono text-red-300/80 break-all leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
            {typeof error.details === "object"
              ? JSON.stringify(error.details, null, 2)
              : error.details}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCopy}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-all border border-gray-600 flex items-center justify-center gap-2 group"
          >
            <svg
              className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              />
            </svg>
            Copy Details
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-linear-to-r from-red-600 to-red-500 hover:brightness-110 rounded-xl font-bold transition-all shadow-lg"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionErrorModal;
