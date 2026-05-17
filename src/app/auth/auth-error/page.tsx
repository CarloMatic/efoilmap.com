import Link from 'next/link';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const errorMsg = params.error || "There was a problem authenticating your account. This could be due to an expired link or a connection issue.";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Authentication Error</h1>
        <p className="text-gray-400 mb-8">
          {errorMsg}
        </p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-blue-900/20"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
