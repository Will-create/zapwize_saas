import { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, Check, AlertCircle } from 'lucide-react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import Button from '../ui/Button';
import { useNumbers } from '../../hooks/useNumbers';
import { useTranslation } from 'react-i18next';

export type ConnectionData = {
  phone: string;
  baseurl: string;
  token: string;
  userid: string;
  name?: string;
  value?: string;
  webhook: string;
  status: string;
  type: 'qrcode' | 'code';
};

type QRScanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  connectionData: ConnectionData;
  onSuccess: () => void;
  onError?: (error: string) => void;
};

type ConnectionState = 'connecting' | 'connected' | 'expired' | 'error';

const QRScanModal = ({ 
  isOpen, 
  onClose, 
  connectionData, 
  onSuccess, 
  onError 
}: QRScanModalProps) => {
  const { t } = useTranslation();
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [error, setError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isQRCode = connectionData.type === 'qrcode';
  const maxTime = isQRCode ? 30 : 360; 
  const { pairringNumber, qrNumber, stateNumber } = useNumbers();

  // Initialize
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(maxTime);
      setConnectionState('connecting');
      setError('');
      if (connectionData.value) {
        if (isQRCode) setQrCodeData(connectionData.value);
        else setPairingCode(connectionData.value);
      }
    }
  }, [isOpen, connectionData, isQRCode, maxTime]);

  // Countdown
  useEffect(() => {
    if (!isOpen || connectionState !== 'connecting') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setConnectionState('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, connectionState]);

  // Auto-refresh QR
  useEffect(() => {
    if (!isOpen || !isQRCode || connectionState !== 'connecting') return;
    const refreshInterval = setInterval(() => refreshConnection(), 30000);
    return () => clearInterval(refreshInterval);
  }, [isOpen, isQRCode, connectionState]);

  // Poll for state
  useEffect(() => {
    if (!isOpen || connectionState !== 'connecting') return;
    const pollInterval = setInterval(async () => {
      try {
        const response = await stateNumber(connectionData.phone.replace('+', ''));
        if (response.value === 'open' || response.value === 'connected') {
          setConnectionState('connected');
          clearInterval(pollInterval);
          setTimeout(() => onSuccess(), 2000);
        }
      } catch (err) {
        console.error('Error polling state:', err);
      }
    }, 3000);
    return () => clearInterval(pollInterval);
  }, [isOpen, connectionState, connectionData, onSuccess]);

  const refreshConnection = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setError('');
    try {
      const response = isQRCode 
        ? await qrNumber(connectionData.phone.replace('+', '')) 
        : await pairringNumber(connectionData.phone.replace('+', ''), connectionData.value);

      if (response.value) {
        if (isQRCode) setQrCodeData(response.value);
        else setPairingCode(response.value);
        setTimeLeft(maxTime);
        setConnectionState('connecting');
      } else {
        throw new Error(t('numberScan.errors.noData'));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('numberScan.errors.refreshFailed');
      setError(msg);
      setConnectionState('error');
      onError?.(msg);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isQRCode, connectionData, maxTime, onError, t, qrNumber, pairringNumber]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 opacity-75" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:h-screen sm:align-middle">&#8203;</span>

        <div className="inline-block w-full max-w-lg transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:align-middle">
          <div className="flex justify-between items-start border-b border-gray-200 p-4">
            <h3 className="text-lg font-medium text-gray-900">{t('numberScan.title')}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 flex items-start rounded-md border border-red-200 bg-red-50 p-3">
                <AlertCircle size={16} className="mr-2 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {connectionState === 'connected' ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Check size={24} className="text-green-600" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900">{t('numberScan.connected.title')}</h3>
                <p className="text-sm text-gray-500">{t('numberScan.connected.message')}</p>
              </div>
            ) : isQRCode ? (
              <div className="text-center">
                <h4 className="mb-4 text-base font-medium text-gray-900">{t('numberScan.qrcode.title')}</h4>
                <div className="mb-4 flex justify-center">{qrCodeData ? <QRCode value={qrCodeData} size={256}/> : <RefreshCw className="animate-spin text-gray-400" />}</div>
                {connectionState === 'connecting' && timeLeft > 0 && (
                  <p className="mb-3 text-sm text-gray-500">{t('numberScan.qrcode.expiresIn', { time: timeLeft })}</p>
                )}
                <div className="mb-4 space-y-1 text-sm text-gray-500">
                  <p>{t('numberScan.qrcode.step1')}</p>
                  <p>{t('numberScan.qrcode.step2')}</p>
                  <p>{t('numberScan.qrcode.step3')}</p>
                </div>
                <p className="text-xs text-gray-400">{t('numberScan.phone')}: {connectionData.phone}</p>
              </div>
            ) : (
              <div className="text-center">
                <h4 className="mb-4 text-base font-medium text-gray-900">{t('numberScan.pairing.title')}</h4>
                <div className="mb-6 flex justify-center">{pairingCode ? <span className="rounded-lg bg-gray-100 px-8 py-4 text-3xl font-mono font-bold">{pairingCode}</span> : <RefreshCw className="animate-spin text-gray-400" />}</div>
                {connectionState === 'connecting' && (
                  <p className="mb-3 text-sm text-gray-500">{t('numberScan.pairing.expiresIn', { time: formatTime(timeLeft) })}</p>
                )}
                <div className="mb-4 space-y-1 text-sm text-gray-500">
                  <p>{t('numberScan.pairing.step1')}</p>
                  <p>{t('numberScan.pairing.step2')}</p>
                  <p>{t('numberScan.pairing.step3')}</p>
                  <p>{t('numberScan.pairing.step4', { phone: connectionData.phone })}</p>
                </div>
                <p className="text-xs text-gray-400">{t('numberScan.phone')}: {connectionData.phone}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3">
            {(connectionState === 'expired' || connectionState === 'error') && !isQRCode && (
              <Button onClick={refreshConnection} isLoading={isRefreshing} className="bg-green-600 text-white hover:bg-green-700">
                <RefreshCw size={16} className="mr-2" />
                {t('numberScan.pairing.generateNew')}
              </Button>
            )}
            <Button onClick={onClose} className="bg-white text-gray-700 hover:bg-gray-50">
              {connectionState === 'connected' ? t('numberScan.close') : t('numberScan.cancel')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanModal;
