export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-green-400 to-blue-500">
            Apply Now
          </h1>
          <p className="text-gray-400">
            Fill out the form below to secure your spot.
          </p>
        </div>

        <div className="w-full aspect-3/4 md:aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          {/* REPLACE with your actual Google Form Embed URL */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSfD_D3-XqX_X-X_X-X_X/viewform?embedded=true"
            width="100%"
            height="100%"
            className="border-0"
            title="Application Form"
          >
            Loading…
          </iframe>
        </div>

        <div className="text-center p-6 bg-gray-900/50 rounded-lg border border-gray-800">
          <p className="mb-4 text-sm text-gray-300">Already applied?</p>
          <a
            href="/rsvp"
            className="inline-flex items-center justify-center px-6 py-2 border border-blue-500/30 rounded-full text-blue-400 hover:bg-blue-500/10 transition-colors"
          >
            Proceed to RSVP & Discord →
          </a>
        </div>
      </div>
    </div>
  );
}
