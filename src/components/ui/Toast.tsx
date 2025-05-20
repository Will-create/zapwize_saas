import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type ToastProps = {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
};

const Toast = ({ show, message, type, duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Auto close after duration
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow for fade out animation
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, duration, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
      role="alert"
    >
      {type === 'success' ? (
        <CheckCircle size={20} className="text-green-500" />
      ) : (
        <AlertCircle size={20} className="text-red-500" />
      )}
      <div className="ml-3 mr-4 text-sm font-medium text-gray-800">
        {message}
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Allow for fade out animation
        }}
        className={`flex-shrink-0 ${
          type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
        }`}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;