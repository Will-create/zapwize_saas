import { ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  title: string;
  message: string;
}

const StatusDisplayModal = ({
  isOpen,
  onClose,
  isSuccess,
  title,
  message,
}: StatusDisplayModalProps) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: -100 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl border-2 overflow-hidden bg-gray-900 ${
              isSuccess ? 'border-green-500' : 'border-red-500'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 15 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
              >
                {isSuccess ? (
                  <ShieldCheck size={80} className="text-green-500" />
                ) : (
                  <ShieldAlert size={80} className="text-red-500" />
                )}
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
              <p className="text-gray-400">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StatusDisplayModal;
