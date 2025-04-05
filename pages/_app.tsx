import { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-blue-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-4">There was an error loading this page:</p>
      <pre className="bg-red-800 bg-opacity-30 p-4 rounded-lg mb-6 overflow-auto max-w-full">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
      >
        Try again
      </button>
      <button
        onClick={() => window.location.href = '/'}
        className="px-4 py-2 mt-2 bg-gray-700 hover:bg-gray-800 rounded-lg"
      >
        Go to homepage
      </button>
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  // Only render client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp; 