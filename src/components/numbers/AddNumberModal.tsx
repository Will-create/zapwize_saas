import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

type AddNumberFormData = {
  id?: string,
  name: string;
  phonenumber: string;
  webhook: string;
  type: 'code' | 'qrcode';
};

type AddNumberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddNumberFormData) => Promise<void>;
  isLoading?: boolean;
};

const AddNumberModal = ({ isOpen, onClose, onSubmit, isLoading = false }: AddNumberModalProps) => {
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [webhook, setWebhook] = useState('');
  const [type, setType] = useState<'code' | 'qrcode'>('qrcode');
  const [errors, setErrors] = useState<{
    name?: string;
    phonenumber?: string;
    webhook?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      phonenumber?: string;
      webhook?: string;
    } = {};
    let isValid = true;

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    } else if (name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
      isValid = false;
    }

    // Phone number validation - simplified format (e.g., 22656920671)
    if (!phonenumber.trim()) {
      newErrors.phonenumber = 'Phone number is required';
      isValid = false;
    } else {
      const cleanPhone = phonenumber.replace(/\D/g, ''); // remove non-digit characters
      if (!/^\d{11,15}$/.test(cleanPhone)) {
        newErrors.phonenumber = 'Enter a valid phone number starting with country code (e.g., 22656920671)';
        isValid = false;
      }
    }

    // Webhook URL validation
    if (webhook.trim()) {
      try {
        const url = new URL(webhook.trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.webhook = 'URL must use HTTP or HTTPS protocol';
          isValid = false;
        }
      } catch {
        newErrors.webhook = 'Enter a valid URL (e.g., https://example.com/webhook)';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    // Add space after country code (rough approximation)
    if (cleaned.length > 4) {
      const countryCode = cleaned.substring(0, 4);
      const rest = cleaned.substring(4);
      cleaned = countryCode + ' ' + rest;
    }
    
    return cleaned;
  };

  const handlePhonenumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhonenumber(formatted);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        phonenumber: phonenumber.replace(/\s+/g, ''), // Remove spaces for API
        webhook: webhook.trim(),
        type
      });
      
      // Reset form on successful submission
      setName('');
      setPhonenumber('');
      setWebhook('');
      setType('qrcode');
      setErrors({});
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred while creating the number'
      });
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
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
              Add New WhatsApp Number
            </h3>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* General error message */}
              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errors.general}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g., My Business WhatsApp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    maxLength={50}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone Number field */}
                <div>
                  <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phonenumber"
                    placeholder="+226 12345678"
                    value={phonenumber}
                    onChange={handlePhonenumberChange}
                    disabled={isLoading}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.phonenumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                  {errors.phonenumber ? (
                    <p className="mt-1 text-sm text-red-600">{errors.phonenumber}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Enter in international format with country code (e.g., 22612345678)
                    </p>
                  )}
                </div>

                {/* Connection Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Connection Method
                  </label>
                  <div className="flex border border-gray-300 rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setType('qrcode')}
                      disabled={isLoading}
                      className={`flex-1 py-2 px-4 text-sm font-medium ${
                        type === 'qrcode'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      QR Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('code')}
                      disabled={isLoading}
                      className={`flex-1 py-2 px-4 text-sm font-medium ${
                        type === 'code'
                          ? 'bg-green-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Pairing Code
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {type === 'qrcode' 
                      ? 'Scan QR code with WhatsApp camera' 
                      : 'Send confirmation code via WhatsApp'}
                  </p>
                </div>

                {/* Webhook URL field */}
                <div>
                  <label htmlFor="webhook" className="block text-sm font-medium text-gray-700">
                    Webhook URL (Optional)
                  </label>
                  <input
                    type="url"
                    id="webhook"
                    placeholder="https://example.com/webhook"
                    value={webhook}
                    onChange={(e) => setWebhook(e.target.value)}
                    disabled={isLoading}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.webhook ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500`}
                  />
                  {errors.webhook ? (
                    <p className="mt-1 text-sm text-red-600">{errors.webhook}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      URL where we'll send notifications when your WhatsApp number receives messages
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Continue'
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNumberModal;