import React from 'react';
import { RingLoader } from 'react-spinners';
import { useCliAuth } from '../../hooks/useCliAuth';

const CliAuthPage = () => {
  const { status, error } = useCliAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold text-gray-900">Zapwize CLI Authentication</h1>
          <p className="text-gray-600">Please wait while we verify your identity.</p>
        </div>

        <div className="flex flex-col items-center justify-center p-6">
          {status === 'pending' && (
            <>
              <RingLoader color="#4F46E5" size={80} />
              <p className="mt-4 text-lg text-gray-700">Verifying your identity...</p>
            </>
          )}

          {status === 'success' && (
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <p className="mt-4 text-lg font-semibold text-green-700">Authentication Successful!</p>
              <p className="mt-2 text-gray-600">You can now return to your terminal.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="mt-4 text-lg font-semibold text-red-700">Authentication Failed</p>
              <p className="mt-2 text-gray-600">{error || 'Invalid or expired authentication request. Please try again.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CliAuthPage;

