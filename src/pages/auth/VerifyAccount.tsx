import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyAccount } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setError('Invalid verification link');
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyAccount(token);
        setStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setError(err.message);
      }
    };

    verifyToken();
  }, [searchParams, verifyAccount, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          {status === 'loading' && (
            <div className="h-12 w-12 text-green-500">
              <Loader className="animate-spin" size={48} />
            </div>
          )}
          {status === 'success' && (
            <div className="h-12 w-12 text-green-500">
              <CheckCircle size={48} />
            </div>
          )}
          {status === 'error' && (
            <div className="h-12 w-12 text-red-500">
              <XCircle size={48} />
            </div>
          )}
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {status === 'loading' && 'Verifying your account...'}
          {status === 'success' && 'Account verified!'}
          {status === 'error' && 'Verification failed'}
        </h2>

        <div className="mt-2 text-center text-sm text-gray-600">
          {status === 'loading' && (
            <p>Please wait while we verify your account</p>
          )}
          {status === 'success' && (
            <p>
              Your account has been successfully verified.
              <br />
              Redirecting you to login...
            </p>
          )}
          {status === 'error' && error && (
            <p className="text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;