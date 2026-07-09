import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#101725] to-[#182336] flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <div className="text-8xl font-bold text-[#57ACAF]/20 mb-4">404</div>
        <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#57ACAF] text-white text-sm font-medium hover:bg-[#57ACAF]/90 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
