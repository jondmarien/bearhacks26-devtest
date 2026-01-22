import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";

export default async function RsvpPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 p-8 border border-gray-800 rounded-2xl bg-gray-900/50 backdrop-blur">
        {!session ? (
          // STATE A: Not Logged In
          <>
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto flex items-center justify-center text-2xl">
              🔒
            </div>
            <h1 className="text-3xl font-bold">Authentication Required</h1>
            <p className="text-gray-400">
              To finish your RSVP and join the hacker community, please verify
              with Discord.
            </p>
            <a
              href="/api/auth/discord"
              className="block w-full py-3 px-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-lg font-medium transition-colors"
            >
              Login with Discord
            </a>
          </>
        ) : (
          // STATE B: Logged In
          <>
            <div className="relative w-24 h-24 mx-auto">
              {session.avatar ? (
                <img
                  src={`https://cdn.discordapp.com/avatars/${session.id}/${session.avatar}.png`}
                  alt={session.username}
                  className="w-full h-full rounded-full border-4 border-green-500"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-blue-500 flex items-center justify-center text-4xl font-bold">
                  {session.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-gray-900 rounded-full"></div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-green-400">
                You're Checked In!
              </h1>
              <p className="text-xl">Welcome, {session.username}</p>
              <p className="text-sm text-gray-400">
                You've been added to the whitelist.
              </p>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="mb-4 text-sm text-gray-400">
                We've also attempted to auto-join you to the server. If you
                don't see it, click below:
              </p>
              <a
                href={process.env.NEXT_PUBLIC_DISCORD_INVITE || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
              >
                Open Discord Server
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
