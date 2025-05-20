import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';

type AddNumberFormData = {
  id: string;
  name: string;
  phoneNumber: string;
  webhookUrl: string;
};

type AddNumberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddNumberFormData) => void;
};

const AddNumberModal = ({ isOpen, onClose, onSubmit }: AddNumberModalProps) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    phoneNumber?: string;
    webhookUrl?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      phoneNumber?: string;
      webhookUrl?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\+\d{1,3}\s\d{6,12}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid international phone number (e.g., +226 12345678)';
      isValid = false;
    }

    if (webhookUrl && !/^https?:\/\/.+/.test(webhookUrl)) {
      newErrors.webhookUrl = 'Enter a valid URL (e.g., https://example.com/webhook)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        webhookUrl: webhookUrl.trim(),
      });
      
      // Reset form
      setName('');
      setPhoneNumber('');
      setWebhookUrl('');
      setErrors({});
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
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="space-y-4">
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g., My Business WhatsApp"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone Number field */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    placeholder="+226 12345678"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  />
                  {errors.phoneNumber ? (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      Enter in international format with country code (e.g., +226 12345678)
                    </p>
                  )}
                </div>

                {/* Webhook URL field */}
                <div>
                  <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700">
                    Webhook URL (Optional)
                  </label>
                  <input
                    type="text"
                    id="webhookUrl"
                    placeholder="https://example.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.webhookUrl ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                  />
                  {errors.webhookUrl ? (
                    <p className="mt-1 text-sm text-red-600">{errors.webhookUrl}</p>
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
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
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