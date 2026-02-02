import React from "react";
import { useNavigate } from "react-router-dom";

interface RsvpStatusCardProps {
  status: {
    hasApplication: boolean;
    accepted: boolean;
    rsvpd: boolean;
  };
  onRsvp: () => void;
}

const RsvpStatusCard: React.FC<RsvpStatusCardProps> = ({ status, onRsvp }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700 font-primary text-center flex flex-col items-center">
      <h1 className="text-3xl font-black mb-8 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 mx-auto">
        RSVP Status
      </h1>

      {!status.hasApplication && (
        <div className="space-y-6 w-full">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-300 font-medium">
            Looks like you haven't started your journey yet!
          </div>
          <button
            onClick={() => navigate("/app/apply")}
            className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl w-full"
          >
            Apply Now &rarr;
          </button>
        </div>
      )}

      {status.hasApplication && !status.accepted && (
        <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-2xl space-y-3 w-full">
          <div className="text-3xl">⏳</div>
          <h2 className="text-xl font-black text-yellow-400">Under Review</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your application is being carefully reviewed by our bears. We'll
            notify you as soon as a decision is made!
          </p>
        </div>
      )}

      {status.hasApplication && status.accepted && !status.rsvpd && (
        <div className="space-y-6 w-full">
          <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl space-y-3">
            <div className="text-3xl">🎉</div>
            <h2 className="text-xl font-black text-green-400">Accepted!</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Welcome to BearHacks 2026! We want you there—please confirm your
              spot.
            </p>
          </div>
          <button
            onClick={onRsvp}
            className="w-full py-4 bg-linear-to-r from-green-600 to-green-500 rounded-2xl font-black text-white text-lg shadow-2xl hover:scale-[1.02] transition-all animate-pulse border border-white/10"
          >
            CONFIRM ATTENDANCE
          </button>
        </div>
      )}

      {status.rsvpd && (
        <div className="space-y-6 w-full flex flex-col items-center">
          <div className="relative inline-block">
            <div className="text-7xl mb-2">🎟️</div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500">
            See You There!
          </h2>
          <p className="text-gray-400 font-medium leading-relaxed">
            Your spot is confirmed. Prepare for a weekend of innovation and
            bears.
          </p>
          <div className="pt-6 border-t border-gray-700/50 w-full">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
              Check email for instructions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RsvpStatusCard;
