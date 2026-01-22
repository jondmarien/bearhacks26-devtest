import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-linear-to-b from-gray-900 to-black text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-12 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-600">
            BearHacks 2026
          </h1>
          <p className="text-2xl text-gray-400">Build. Break. Create.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-b border-gray-800 py-8 w-full max-w-2xl">
          <div>
            <h3 className="text-xl font-bold text-blue-400">Date</h3>
            <p>October 24-26, 2026</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-400">Location</h3>
            <p>Sheridan College, Oakville, Canada</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-400">Prizes</h3>
            <p>$10,000+ in Awards</p>
          </div>
        </div>

        <div>
          <Link
            href="/apply"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-white px-8 font-medium text-neutral-900 duration-300 hover:bg-neutral-200 hover:w-full"
          >
            <span className="mr-2">Apply to Hack</span>
            <span className="ml-1 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <p className="mt-4 text-gray-500 text-xs">
            Applications close October 10th
          </p>
        </div>
      </div>
    </main>
  );
}
