import { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, Check, AlertCircle } from 'lucide-react';

export type ConnectionData = {
  phone: string;
  baseurl: string;
  value?: string; // QR code data or pairing code
  type: 'qrcode' | 'code';
};

type QRScanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  connectionData: ConnectionData;
  onSuccess: () => void;
  onError?: (error: string) => void;
};

type ConnectionState = 'connecting' | 'waiting' | 'connected' | 'expired' | 'error';

const QRScanModal = ({ 
  isOpen, 
  onClose, 
  connectionData, 
  onSuccess, 
  onError 
}: QRScanModalProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [qrCodeData, setQrCodeData] = useState<string>('');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds for QR, will be set to 360 for pairing
  const [error, setError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const isQRCode = connectionData.type === 'qrcode';
  const maxTime = isQRCode ? 30 : 360; // 30 seconds for QR, 6 minutes for pairing

  // Initialize timer based on connection type
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(maxTime);
      setConnectionState('connecting');
      setError('');
      
      // Set initial data if available
      if (connectionData.value) {
        if (isQRCode) {
          setQrCodeData(connectionData.value);
        } else {
          setPairingCode(connectionData.value);
        }
        setConnectionState('waiting');
      }
    }
  }, [isOpen, connectionData, isQRCode, maxTime]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || connectionState !== 'waiting') return;

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

  // Auto-refresh QR code every 30 seconds
  useEffect(() => {
    if (!isOpen || !isQRCode || connectionState !== 'waiting') return;

    const refreshInterval = setInterval(() => {
      refreshConnection();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [isOpen, isQRCode, connectionState]);

  // Poll for connection status
  useEffect(() => {
    if (!isOpen || connectionState !== 'waiting') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${connectionData.baseurl}/api/instances/${connectionData.phone}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.state === 'open' || data.state === 'connected') {
            setConnectionState('connected');
            clearInterval(pollInterval);
            
            // Show success message briefly then call onSuccess
            setTimeout(() => {
              onSuccess();
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Error polling connection status:', error);
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [isOpen, connectionState, connectionData, onSuccess]);

  const refreshConnection = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setError('');

    try {
      const endpoint = isQRCode 
        ? `${connectionData.baseurl}/api/instances/${connectionData.phone}/qr`
        : `${connectionData.baseurl}/api/instances/${connectionData.phone}/pairing`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to refresh: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.value) {
        if (isQRCode) {
          setQrCodeData(data.value);
        } else {
          setPairingCode(data.value);
        }
        setTimeLeft(maxTime);
        setConnectionState('waiting');
      } else {
        throw new Error('No connection data received');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh connection';
      setError(errorMessage);
      setConnectionState('error');
      onError?.(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, isQRCode, connectionData, maxTime, onError]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQRCode = () => {
    if (!qrCodeData) {
      return (
        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center rounded-lg">
          <RefreshCw size={32} className="text-gray-400 animate-spin" />
        </div>
      );
    }

    return (
      <div className="relative">
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
          <img 
            src={`data:image/png;base64,${qrCodeData}`}
            alt="WhatsApp QR Code"
            className="w-64 h-64 object-contain"
            onError={(e) => {
              // Fallback if the QR code is not a base64 image
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.removeAttribute('hidden');
            }}
          />
          <div hidden className="w-64 h-64 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500 text-center">QR Code Error</p>
          </div>
        </div>
        
        {connectionState === 'expired' && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <p className="text-gray-600 mb-2">QR code expired</p>
              <button
                onClick={refreshConnection}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <RefreshCw size={14} className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPairingCode = () => {
    if (!pairingCode) {
      return (
        <div className="w-full h-16 bg-gray-100 flex items-center justify-center rounded-lg">
          <RefreshCw size={24} className="text-gray-400 animate-spin" />
        </div>
      );
    }

    return (
      <div className="bg-gray-100 px-8 py-4 rounded-lg">
        <span className="text-3xl font-mono font-bold tracking-wider text-gray-800 select-all">
          {pairingCode}
        </span>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="flex justify-between items-start p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Link WhatsApp Number
            </h3>
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                <AlertCircle size={16} className="text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {connectionState === 'connected' ? (
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <Check size={24} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  WhatsApp Successfully Linked!
                </h3>
                <p className="text-sm text-gray-500">
                  Your WhatsApp number has been successfully linked to your account.
                </p>
              </div>
            ) : isQRCode ? (
              <div className="text-center">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Scan this QR code with WhatsApp on your phone
                </h4>
                
                <div className="flex justify-center mb-4">
                  {renderQRCode()}
                </div>
                
                {connectionState === 'waiting' && timeLeft > 0 && (
                  <p className="text-sm text-gray-500 mb-3">
                    QR code expires in <span className="font-medium">{timeLeft}</span> seconds
                  </p>
                )}
                
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>1. Open WhatsApp on your phone</p>
                  <p>2. Tap Menu or Settings and select Linked Devices</p>
                  <p>3. Point your phone at this screen to scan the code</p>
                </div>
                
                <p className="text-xs text-gray-400">
                  Phone number: {connectionData.phone}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Send this code in WhatsApp
                </h4>
                
                <div className="flex justify-center mb-6">
                  {renderPairingCode()}
                </div>
                
                {connectionState === 'waiting' && (
                  <p className="text-sm text-gray-500 mb-3">
                    Code expires in <span className="font-medium">{formatTime(timeLeft)}</span>
                  </p>
                )}
                
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>1. Open WhatsApp on your phone</p>
                  <p>2. Go to Settings → Linked Devices</p>
                  <p>3. Tap "Link a Device" → "Link with phone number instead"</p>
                  <p>4. Send the code above to: <span className="font-medium">{connectionData.phone}</span></p>
                </div>
                
                <p className="text-xs text-gray-400">
                  Phone number: {connectionData.phone}
                </p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
            {(connectionState === 'expired' || connectionState === 'error') && !isQRCode && (
              <button
                type="button"
                onClick={refreshConnection}
                disabled={isRefreshing}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw size={16} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} className="mr-2" />
                    Generate New Code
                  </>
                )}
              </button>
            )}
            
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {connectionState === 'connected' ? 'Close' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanModal;
