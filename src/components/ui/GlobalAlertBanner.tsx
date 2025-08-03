import { FC, useEffect } from 'react';
import { useAlertStore } from '../../store/alertStore';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import Button from './Button';

const GlobalAlertBanner: FC = () => {
  const { isVisible, message, severity, action, duration, countdown, hide, autoHideTimeout } = useAlertStore();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isVisible && autoHideTimeout) {
      timer = setTimeout(() => {
        hide();
      }, autoHideTimeout * 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoHideTimeout, hide]);

  if (!isVisible) return null;

  const getSeverityStyles = () => {
    switch (severity) {
      case 'success':
        return { bg: 'bg-green-500', icon: <CheckCircle size={20} /> };
      case 'warning':
        return { bg: 'bg-yellow-500', icon: <AlertTriangle size={20} /> };
      case 'error':
        return { bg: 'bg-red-500', icon: <AlertTriangle size={20} /> };
      case 'info':
      default:
        return { bg: 'bg-blue-500', icon: <Info size={20} /> };
    }
  };

  const { bg, icon } = getSeverityStyles();

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 p-4 text-white ${bg}`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <span className="ml-3">{message}</span>
        </div>
        <div className="flex items-center">
          {duration && (
            <span className="mr-4 text-sm">
              Closing in {countdown}s
            </span>
          )}
          {action && (
            <Button onClick={action.onPress} className="mr-4 bg-transparent border border-white hover:bg-white hover:text-black">
              {action.label}
            </Button>
          )}
          <Button onClick={hide} className="bg-transparent">
            <X size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlobalAlertBanner;