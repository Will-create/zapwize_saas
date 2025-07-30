import { FC, useState, useEffect } from 'react';
import { X, Power, Play, Pause } from 'lucide-react';
import { useNumbers, WhatsAppNumber } from '../../hooks/useNumbers';
import Badge from '../ui/Badge';
import Toast from '../ui/Toast';
import Button from '../ui/Button';

interface NumberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  number: WhatsAppNumber;
}

const NumberDetailsModal: FC<NumberDetailsModalProps> = ({ isOpen, onClose, number }) => {
  const { pauseNumber, resumeNumber, statusNumber, logoutNumber } = useNumbers();
  const [isPaused, setIsPaused] = useState(number.status === 'paused');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      statusNumber(number.id).catch(err => {
        const error = err as Error;
        setToast({
          show: true,
          message: `Status update failed: ${error.message}`,
          type: 'error',
        });
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [number.id, statusNumber]);

  const handleTogglePause = async () => {
    setIsLoading(true);
    const action = isPaused ? 'resume' : 'pause';
    try {
      let response;
      if (action === 'pause') {
        response = await pauseNumber(number.id);
      } else {
        response = await resumeNumber(number.id);
      }
      setIsPaused(!isPaused);
      setToast({
        show: true,
        message: `Operation successful: ${JSON.stringify(response)}`,
        type: 'success',
      });
    } catch (err) {
      const error = err as Error;
      setToast({
        show: true,
        message: error.message || 'Operation failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await logoutNumber(number.id);
      setToast({
        show: true,
        message: `Logout successful: ${JSON.stringify(response)}`,
        type: 'success',
      });
      onClose();
    } catch (err) {
      const error = err as Error;
      setToast({
        show: true,
        message: error.message || 'Logout failed',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Number Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Name</p>
            <p className="text-lg text-gray-900">{number.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone Number</p>
            <p className="text-lg text-gray-900">{number.phonenumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <Badge status={number.status} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Webhook URL</p>
            <p className="text-lg text-gray-900 break-all">{number.webhook || 'Not set'}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            onClick={handleTogglePause}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            isLoading={isLoading}
          >
            {isPaused ? <Play size={16} className="mr-2" /> : <Pause size={16} className="mr-2" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            isLoading={isLoading}
          >
            <Power size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default NumberDetailsModal;
