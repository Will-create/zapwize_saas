import { FC, useState, useEffect } from 'react';
import { X, Power, Play, Pause, RefreshCw, Trash2 } from 'lucide-react';
import { useNumbers, WhatsAppNumber } from '../../hooks/useNumbers';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAlertStore } from '../../store/alertStore';

interface NumberDetailsPanelProps {
  number: WhatsAppNumber;
  onClose: () => void;
  onConfirmAction: (type: 'remove' | 'logout', id: string) => void;
  onReconnect: (id: string) => void;
  isActionLoading: boolean;
}

const NumberDetailsPanel: FC<NumberDetailsPanelProps> = ({
  number,
  onClose,
  onConfirmAction,
  onReconnect,
  isActionLoading,
}) => {
  const { pauseNumber, resumeNumber, statusNumber } = useNumbers();
  const [isPaused, setIsPaused] = useState(number.status === 'paused');
  const [isPauseResumeLoading, setIsPauseResumeLoading] = useState(false);
  const { show: showAlert } = useAlertStore();

  // Auto-update status every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      statusNumber(number.id).catch(err => {
        const error = err as Error;
        showAlert(`Status update failed for ${number.name}: ${error.message}`, 'error');
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [number.id, statusNumber, showAlert, number.name]);

  const handleTogglePause = async () => {
    setIsPauseResumeLoading(true);
    const action = isPaused ? 'resume' : 'pause';
    try {
      let response;
      if (action === 'pause') {
        response = await pauseNumber(number.id);
      } else {
        response = await resumeNumber(number.id);
      }
      setIsPaused(!isPaused);
      showAlert(`Number ${number.name} ${action}d successfully`, 'success', undefined, 3);
    } catch (err) {
      const error = err as Error;
      showAlert(`Failed to ${action} number ${number.name}: ${error.message}`, 'error');
    } finally {
      setIsPauseResumeLoading(false);
    }
  };

  // Determine which buttons should be shown based on status
  const shouldShowPauseResumeButton = ['connected', 'paused'].includes(number.status);
  const shouldShowReconnectButton = number.status !== 'connected' && number.status !== 'connecting';
  const shouldShowLogoutButton = number.status === 'connected' || number.status === 'paused';
  
  // All numbers can be removed regardless of status, but we might want to add a confirmation
  // for active numbers

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg z-40 transform translate-x-0 transition-transform ease-in-out duration-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{number.name} Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
        {/* Add more number details here as needed */}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {shouldShowPauseResumeButton && (
          <Button
            onClick={handleTogglePause}
            isLoading={isPauseResumeLoading}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            {isPaused ? <Play size={16} className="mr-2" /> : <Pause size={16} className="mr-2" />}
            {isPaused ? 'Resume Number' : 'Pause Number'}
          </Button>
        )}
        
        {shouldShowReconnectButton && (
          <Button
            onClick={() => onReconnect(number.id)}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            <RefreshCw size={16} className="mr-2" />
            Reconnect Number
          </Button>
        )}
        
        {shouldShowLogoutButton && (
          <Button
            onClick={() => onConfirmAction('logout', number.id)}
            isLoading={isActionLoading}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
          >
            <Power size={16} className="mr-2" />
            Logout Number
          </Button>
        )}
        
        {/* Remove button is always available */}
        <Button
          onClick={() => onConfirmAction('remove', number.id)}
          isLoading={isActionLoading}
          className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 size={16} className="mr-2" />
          Remove Number
        </Button>
      </div>
    </div>
  );
};

export default NumberDetailsPanel;