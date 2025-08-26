import { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import * as QRCode from 'qrcode.react';
import { authService } from '../../services/api';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/input';
import Toast from '../../components/ui/Toast';

interface TwoFactorAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TwoFactorAuthModal: FC<TwoFactorAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (isOpen) {
      const fetchSecret = async () => {
        setIsLoading(true);
        try {
          const response = await authService.generateTwoFactorSecret();
          if (response.success) {
            setQrCode(response.value.otpauth_url);
            setSecret(response.value.secret);
          } else {
            setError(response.message || 'Failed to generate 2FA secret.');
          }
        } catch (err: any) {
          setError(err.message || 'An unexpected error occurred.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSecret();
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (!token) {
      setError('Please enter the authentication code.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.enableTwoFactorAuth(token);
      if (response.success) {
        setToast({ show: true, message: '2FA enabled successfully!', type: 'success' });
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Invalid token. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-2xl font-bold mb-4">{t('auth.2fa.title')}</h2>
          {isLoading && !qrCode && <p>{t('common.loading')}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {qrCode && secret && (
            <>
              <p className="mb-4">{t('auth.2fa.scanQrCode')}</p>
              <div className="flex justify-center mb-4 p-4 bg-white">
                <QRCode value={qrCode} size={256} />
              </div>
              <p className="mb-4">
                {t('auth.2fa.manualSetup')} <code className="bg-gray-200 p-1 rounded">{secret}</code>
              </p>
              <div className="mb-4">
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.2fa.enterCode')}
                </label>
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
            </>
          )}
          <div className="flex justify-end gap-4">
            <Button onClick={onClose} variant="secondary" disabled={isLoading}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleVerify} disabled={isLoading || !token}>
              {isLoading ? t('auth.2fa.verifying') : t('auth.2fa.verifyAndEnable')}
            </Button>
          </div>
        </div>
      </div>
      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
};

export default TwoFactorAuthModal;
