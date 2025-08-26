import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, ShieldCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastProps = {
  show: boolean;
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
};

const Toast = ({ show, message, type, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const isSuccess = type === 'success';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="fixed top-5 right-5 z-50"
        >
          <div
            className={`flex items-center p-4 rounded-lg shadow-2xl border-2 ${
              isSuccess
                ? 'bg-gray-900 border-green-500 text-white'
                : 'bg-gray-900 border-red-500 text-white'
            }`}
            role="alert"
          >
            <div className="flex-shrink-0">
              {isSuccess ? (
                <ShieldCheck size={24} className="text-green-500" />
              ) : (
                <ShieldAlert size={24} className="text-red-500" />
              )}
            </div>
            <div className="ml-4 mr-6">
              <p className="text-sm font-bold uppercase tracking-wider">
                {isSuccess ? 'Operation Successful' : 'Alert: Operation Failed'}
              </p>
              <p className="text-xs text-gray-400">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="ml-auto -mx-1.5 -my-1.5 bg-gray-800 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-700 inline-flex items-center justify-center h-8 w-8"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
