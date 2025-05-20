import { useState, FormEvent } from 'react';
import { CreditCard, XCircle, CheckCircle } from 'lucide-react';

type PaymentMethodFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

const PaymentMethodForm = ({ onSuccess, onCancel }: PaymentMethodFormProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    cardNumber?: string;
    cardName?: string;
    expiryDate?: string;
    cvc?: string;
  }>({});

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }
    
    return formatted.trim().slice(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digits.length > 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    
    return digits;
  };

  const validateForm = () => {
    const newErrors: {
      cardNumber?: string;
      cardName?: string;
      expiryDate?: string;
      cvc?: string;
    } = {};
    let isValid = true;

    // Validate card number (16 digits)
    const cardDigits = cardNumber.replace(/\s/g, '');
    if (!cardDigits) {
      newErrors.cardNumber = 'Card number is required';
      isValid = false;
    } else if (!/^\d{16}$/.test(cardDigits)) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      isValid = false;
    }

    // Validate card name
    if (!cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
      isValid = false;
    }

    // Validate expiry date (MM/YY format)
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
      isValid = false;
    } else {
      const [month, year] = expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100; // Get last 2 digits of year
      const currentMonth = new Date().getMonth() + 1; // 1-12
      
      if (!month || !year || !/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
        newErrors.expiryDate = 'Enter a valid date (MM/YY)';
        isValid = false;
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
        isValid = false;
      } else if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
        isValid = false;
      }
    }

    // Validate CVC (3-4 digits)
    if (!cvc) {
      newErrors.cvc = 'CVC is required';
      isValid = false;
    } else if (!/^\d{3,4}$/.test(cvc)) {
      newErrors.cvc = 'CVC must be 3-4 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call to process payment method
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="mr-3 flex-shrink-0 bg-green-100 p-1 rounded-md">
              <CreditCard size={18} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Add Payment Method
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.cardNumber ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                maxLength={19} // 16 digits + 3 spaces
              />
              {errors.cardNumber ? (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
              ) : (
                <p className="mt-1 text-xs text-gray-500">
                  Enter your 16-digit card number
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <input
                type="text"
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.cardName ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
              />
              {errors.cardName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  maxLength={5} // MM/YY
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.cvc ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  maxLength={4}
                />
                {errors.cvc && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Save Payment Method'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentMethodForm;