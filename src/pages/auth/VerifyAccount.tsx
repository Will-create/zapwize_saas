import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const VerifyAccount = () => {
  const { t } = useTranslation('verifyAccount');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyAccount } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('verifyAccount.token');
    
    if (!token) {
      setStatus('error');
      setError(t('verifyAccount.invalidToken'));
      return;
    }

    const verifyToken = async () => {
      try {
        await verifyAccount(token);
        setStatus('success');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err: any) {
        setStatus('error');
        setError(err.message);
      }
    };

    verifyToken();
  }, [searchParams, verifyAccount, navigate, t]);

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
          {status === 'loading' && t('verifyAccount.verifyingTitle')}
          {status === 'success' && t('verifyAccount.verifiedTitle')}
          {status === 'error' && t('verifyAccount.errorTitle')}
        </h2>

        <div className="mt-2 text-center text-sm text-gray-600">
          {status === 'loading' && <p>{t('verifyAccount.verifyingDescription')}</p>}
          {status === 'success' && (
            <p className="whitespace-pre-line">{t('verifyAccount.verifiedDescription')}</p>
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
