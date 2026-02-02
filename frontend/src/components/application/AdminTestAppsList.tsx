import React from "react";

interface AdminApp {
  _id: string;
  basicInfo: { fullName: string };
  accepted: boolean;
  rsvpd: boolean;
  createdAt: string;
}

interface AdminTestAppsListProps {
  apps: AdminApp[];
}

const AdminTestAppsList: React.FC<AdminTestAppsListProps> = ({ apps }) => {
  return (
    <div className="w-full max-w-4xl mb-8 font-primary">
      <h2 className="text-2xl font-bold mb-4 text-purple-400">
        Admin Test Applications
      </h2>
      <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
        {apps.length === 0 ? (
          <p className="text-gray-400">No test applications yet.</p>
        ) : (
          <div className="space-y-2">
            {apps.map((app) => (
              <div
                key={app._id}
                className="flex justify-between items-center bg-gray-700 p-3 rounded"
              >
                <div>
                  <span className="font-bold">{app.basicInfo.fullName}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    {new Date(app.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 text-sm font-bold">
                  <span
                    className={
                      app.accepted ? "text-green-400" : "text-yellow-400"
                    }
                  >
                    {app.accepted ? "Accepted" : "Pending"}
                  </span>
                  <span
                    className={app.rsvpd ? "text-green-400" : "text-gray-400"}
                  >
                    {app.rsvpd ? "RSVP'd" : "No RSVP"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestAppsList;
