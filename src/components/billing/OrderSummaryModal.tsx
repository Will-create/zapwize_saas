import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OrderSummary, CouponValidation } from '../../hooks/useBilling';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  planPrice: number;
  planPrice2: number;
  cycle: 'monthly' | 'yearly';
  selectedNumberId: string;
  linkedNumbers: Array<{ id: string; name: string; phoneNumber: string }>;
  onNumberChange: (numberId: string) => void;
  couponCode: string;
  onCouponChange: (code: string) => void;
  validateCoupon: (code: string) => void;
  couponValidation: CouponValidation | null;
  processingCoupon: boolean;
  orderSummary: OrderSummary | null;
  processingSummary: boolean;
  refreshSummary: () => Promise<void>;
  onCouponValidationChange?: (validation: CouponValidation) => void; // Added prop for updating coupon validation
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  planName,
  planPrice,
  planPrice2,
  cycle,
  selectedNumberId,
  linkedNumbers,
  onNumberChange,
  couponCode,
  onCouponChange,
  validateCoupon,
  couponValidation,
  processingCoupon,
  orderSummary,
  processingSummary,
  refreshSummary,
  onCouponValidationChange // Added prop for updating coupon validation
}) => {
  const { t } = useTranslation();
  const [localCouponCode, setLocalCouponCode] = useState(couponCode);
  const [showCouponMessage, setShowCouponMessage] = useState(false);
  const [lastValidatedCoupon, setLastValidatedCoupon] = useState('');

  // Initialize the component by fetching the summary if not already available
  useEffect(() => {
    
    const loadSummary = async () => {
      if (isOpen && !orderSummary && !processingSummary) {
        try {
          await refreshSummary();
        } catch (error) {
          console.error('Failed to refresh order summary:', error);
          // Don't retry automatically on error to prevent infinite loops
        }
      }
    };
    
    loadSummary();
    
    return () => {
      isMounted = false;
    };
  }, [isOpen]); // Only depend on isOpen, not orderSummary or processingSummary

  // Sync local coupon code with prop
  useEffect(() => {
    setLocalCouponCode(couponCode);
  }, [couponCode]);

  // Show coupon validation message when validation changes
  useEffect(() => {
    if (couponValidation) {
      setShowCouponMessage(true);
      setLastValidatedCoupon(localCouponCode);
      
      // Auto-hide success messages after 5 seconds
      if (couponValidation.valid) {
        const timer = setTimeout(() => {
          setShowCouponMessage(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [couponValidation, localCouponCode]);

  // Clear coupon validation message when code changes
  useEffect(() => {
    if (showCouponMessage && localCouponCode !== couponCode) {
      setShowCouponMessage(false);
    }
  }, [localCouponCode, couponCode, showCouponMessage]);

  // Reset all state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Reset local state
      setLocalCouponCode('');
      setShowCouponMessage(false);
      setLastValidatedCoupon('');
      
      // Reset parent state
      if (couponCode) {
        onCouponChange('');
      }
      
      // Reset coupon validation if callback is provided
      if (onCouponValidationChange) {
        onCouponValidationChange({
          valid: false,
          discountType: null,
          discountValue: null,
          message: null
        });
      }
    }
  }, [isOpen, couponCode, onCouponChange, onCouponValidationChange]);

  // Create a custom close handler that resets state before closing
  const handleModalClose = () => {
    // Reset local state
    setLocalCouponCode('');
    setShowCouponMessage(false);
    setLastValidatedCoupon('');
    
    // Reset parent state
    onCouponChange('');
    
    // Reset coupon validation if callback is provided
    if (onCouponValidationChange) {
      onCouponValidationChange({
        valid: false,
        discountType: null,
        discountValue: null,
        message: null
      });
    }
    
    // Call the original onClose
    onClose();
  };

  // Add this new effect to sync coupon validation with order summary
  useEffect(() => {
    if (orderSummary && localCouponCode && onCouponValidationChange) {
      // If order summary shows a discount but coupon validation shows invalid,
      // update the coupon validation state to match the order summary
      if (orderSummary.discount > 0 && couponValidation && !couponValidation.valid) {
        const updatedValidation: CouponValidation = {
          valid: true,
          discountType: orderSummary.discount === orderSummary.originalPrice ? 'percentage' : 'fixed',
          discountValue: orderSummary.discount,
          message: orderSummary.couponMessage || null
        };
        
        onCouponValidationChange(updatedValidation);
      }
      // If order summary shows no discount but coupon validation shows valid,
      // update the coupon validation state to match the order summary
      else if (orderSummary.discount === 0 && couponValidation && couponValidation.valid) {
        const updatedValidation: CouponValidation = {
          valid: false,
          discountType: null,
          discountValue: null,
          message: orderSummary.couponMessage || null
        };
        
        onCouponValidationChange(updatedValidation);
      }
    }
  }, [orderSummary, localCouponCode, couponValidation, onCouponValidationChange]);

  if (!isOpen) return null;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (localCouponCode.trim()) {
      // Always validate the coupon, even if it's the same as before
      // This allows reapplying the same coupon if needed
      validateCoupon(localCouponCode);
      onCouponChange(localCouponCode);
      setLastValidatedCoupon(localCouponCode);
    } else {
      // If coupon field is cleared, clear the coupon and refresh summary
      onCouponChange('');
      setShowCouponMessage(false);
      setLastValidatedCoupon('');
      refreshSummary();
    }
  };

  const handleCouponInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalCouponCode(newValue);
    
    // Only hide the message if the user changes the coupon code from the last validated one
    if (newValue !== lastValidatedCoupon) {
      setShowCouponMessage(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)}`;
  };

  // Display order summary section
  const renderOrderSummary = () => {
    if (processingSummary) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader size={24} className="animate-spin mr-2" />
          <span>{t('billing.loadingSummary')}</span>
        </div>
      );
    }

    // If no summary is available, show default calculation based on plan price
    if (!orderSummary) {
      const price = cycle === 'monthly' ? planPrice : planPrice2;
      return (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t('billing.subtotal')}</span>
            <span>${formatCurrency(price)}</span>
          </div>
          
          <div className="flex justify-between font-bold border-t pt-2">
            <span>{t('billing.total')}</span>
            <span>${formatCurrency(price)}</span>
          </div>
        </div>
      );
    }

    // Safely access properties with fallbacks
    const originalPrice = orderSummary.originalPrice || 0;
    const discount = orderSummary.discount || 0;
    const finalPrice = orderSummary.finalPrice || originalPrice;
    const couponMessage = orderSummary.couponMessage || '';

    // Show full summary with discount if available
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>{t('billing.subtotal')}</span>
          <span>${formatCurrency(originalPrice)}</span>
        </div>
        
        {/* Show discount only if there is one */}
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>{t('billing.discount')}</span>
            <span>-${formatCurrency(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold border-t pt-2">
          <span>{t('billing.total')}</span>
          <span>${formatCurrency(finalPrice)}</span>
        </div>
        
        {/* Display coupon message if available */}
        {couponMessage && (
          <div className="text-sm text-green-600 mt-2">
            {couponMessage}
          </div>
        )}
      </div>
    );
  };

  const renderCouponButton = () => {
    if (processingCoupon) {
      return (
        <button
          type="submit"
          disabled={true}
          className="px-4 py-2 rounded-md text-white bg-gray-400 cursor-not-allowed"
        >
          <Loader size={16} className="animate-spin" />
        </button>
      );
    }
    
    // Empty coupon field - show "Apply" button
    if (!localCouponCode.trim()) {
      return (
        <button
          type="submit"
          disabled={true}
          className="px-4 py-2 rounded-md text-white bg-gray-400 cursor-not-allowed"
        >
          {t('billing.apply')}
        </button>
      );
    }
    
    // Non-empty coupon field - always allow submission
    return (
      <button
        type="submit"
        className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
      >
        {t('billing.apply')}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{t('billing.orderSummary')}</h2>
          <button
            onClick={handleModalClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{t('billing.planDetails')}</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">{t('billing.plan')}:</span>
                <span className="font-medium">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('billing.billingCycle')}:</span>
                <span className="font-medium capitalize">{cycle}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{t('billing.selectNumber')}</h3>
            <select
              value={selectedNumberId}
              onChange={(e) => onNumberChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {linkedNumbers.map((number) => (
                <option key={number.id} value={number.id}>
                  {number.name} ({number.phoneNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{t('billing.couponCodeLabel')}</h3>
            <form onSubmit={handleCouponSubmit} className="flex space-x-2">
              <input
                type="text"
                value={localCouponCode}
                onChange={handleCouponInputChange}
                placeholder={t('billing.couponCodePlaceholder')}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {renderCouponButton()}
            </form>
            
            {/* Coupon validation message */}
            {showCouponMessage && couponValidation && (
              <div className="mt-2 p-2 rounded-md" role="alert">
                {couponValidation.valid ? (
                  <div className="flex items-center text-green-600 bg-green-50 p-2 rounded">
                    <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                    <span>{couponValidation.message || t('billing.couponValid')}</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                    <span>{couponValidation.message || t('billing.couponInvalid')}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">{t('billing.summary')}</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {renderOrderSummary()}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={handleModalClose}
              className="px-4 py-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none border border-gray-300 hover:bg-gray-50"
            >
              {t('billing.cancel')}
            </button>
            <button
              onClick={onConfirm}
              disabled={processingSummary}
              className={`px-4 py-2 rounded-md text-white ${
                processingSummary ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {processingSummary ? t('billing.processing') : t('billing.confirm')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;