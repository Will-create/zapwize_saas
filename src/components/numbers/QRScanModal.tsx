import { useState, useEffect } from 'react';
import { X, RefreshCw, QrCode, Check } from 'lucide-react';

type QRScanModalProps = {
  isOpen: boolean;
  onClose: () => void;
  numberId: string;
  onSuccess: () => void;
};

const QRScanModal = ({ isOpen, onClose, numberId, onSuccess }: QRScanModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [method, setMethod] = useState<'qr' | 'code'>('qr');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Generate a random QR code pattern (this is just for demo purposes)
  const generateQRPattern = () => {
    const size = 10;
    const pattern = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        row.push(Math.random() > 0.5 ? 1 : 0);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const [qrPattern, setQrPattern] = useState(generateQRPattern());

  // Generate random confirmation code (this is just for demo purposes)
  useEffect(() => {
    if (method === 'code') {
      setConfirmationCode(Math.floor(100000 + Math.random() * 900000).toString());
    }
  }, [method]);

  // Start countdown timer
  useEffect(() => {
    if (!isOpen || isConnected) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isConnected]);

  // Simulate QR code loading
  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoading(true);
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, [isOpen, method]);

  // Simulate connection (for demo purposes)
  useEffect(() => {
    if (!isOpen || isConnected) return;
    
    const timeout = setTimeout(() => {
      // 30% chance of successful connection after 20 seconds
      if (Math.random() < 0.3) {
        setIsConnected(true);
        
        // Call onSuccess after showing confirmation for 2 seconds
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    }, 20000);
    
    return () => clearTimeout(timeout);
  }, [isOpen, isConnected, onSuccess]);

  const refreshQR = () => {
    setIsLoading(true);
    setTimeLeft(60);
    
    setTimeout(() => {
      setQrPattern(generateQRPattern());
      setIsLoading(false);
    }, 1000);
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
            {/* Method selector */}
            <div className="mb-6">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    method === 'qr'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMethod('qr')}
                >
                  Scan QR Code
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    method === 'code'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setMethod('code')}
                >
                  Confirmation Code
                </button>
              </div>
            </div>

            {isConnected ? (
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
            ) : method === 'qr' ? (
              <div className="text-center">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Scan this QR code with WhatsApp on your phone
                </h4>
                
                <div className="flex justify-center mb-4">
                  {isLoading ? (
                    <div className="w-56 h-56 bg-gray-100 flex items-center justify-center">
                      <RefreshCw size={32} className="text-gray-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="bg-white p-2 border border-gray-300 rounded-lg shadow-sm">
                        {/* QR code visualization (simplified for demo) */}
                        <div className="w-56 h-56 grid grid-cols-10 gap-0">
                          {qrPattern.flatMap((row, i) => 
                            row.map((cell, j) => (
                              <div
                                key={`${i}-${j}`}
                                className={`${cell ? 'bg-black' : 'bg-white'}`}
                              />
                            ))
                          )}
                        </div>
                      </div>
                      
                      {timeLeft === 0 && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                          <div className="text-center">
                            <p className="text-gray-600 mb-2">QR code expired</p>
                            <button
                              onClick={refreshQR}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <RefreshCw size={14} className="mr-1" />
                              Refresh QR Code
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {!isLoading && timeLeft > 0 && (
                  <p className="text-sm text-gray-500 mb-3">
                    QR code expires in <span className="font-medium">{timeLeft}</span> seconds
                  </p>
                )}
                
                <p className="text-sm text-gray-500 mb-4">
                  1. Open WhatsApp on your phone
                  <br />
                  2. Tap Menu or Settings and select Linked Devices
                  <br />
                  3. Point your phone at this screen to scan the code
                </p>
                
                <p className="text-sm text-gray-500">
                  Having trouble? Try the{' '}
                  <button
                    onClick={() => setMethod('code')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    confirmation code
                  </button>{' '}
                  method instead
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h4 className="text-base font-medium text-gray-900 mb-4">
                  Send this code in WhatsApp
                </h4>
                
                <div className="flex justify-center mb-6">
                  {isLoading ? (
                    <div className="w-full h-16 bg-gray-100 flex items-center justify-center rounded-lg">
                      <RefreshCw size={24} className="text-gray-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="bg-gray-100 px-8 py-3 rounded-lg">
                      <span className="text-2xl font-mono font-bold tracking-wider text-gray-800">
                        {confirmationCode}
                      </span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  1. Open WhatsApp on your phone
                  <br />
                  2. Send the code above to{' '}
                  <span className="font-medium">+1 555-123-4567</span>
                  <br />
                  3. Wait for connection to be established
                </p>
                
                <p className="text-sm text-gray-500">
                  Prefer to scan a QR code?{' '}
                  <button
                    onClick={() => setMethod('qr')}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Switch to QR code
                  </button>
                </p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
            {timeLeft === 0 && method === 'qr' && (
              <button
                type="button"
                onClick={refreshQR}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh QR Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanModal;