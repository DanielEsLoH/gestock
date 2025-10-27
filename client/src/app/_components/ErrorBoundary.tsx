"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  React.useEffect(() => {
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong!
        </h2>

        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>

        {error.digest && (
          <p className="text-sm text-gray-500 mb-4">
            Error ID: {error.digest}
          </p>
        )}

        <button
          onClick={reset}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
