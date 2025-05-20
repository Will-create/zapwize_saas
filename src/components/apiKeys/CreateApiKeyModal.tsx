import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { useNumbers } from '../../hooks/useNumbers';

type CreateApiKeyData = {
  name: string;
  numberId: string;
  permissions: string[];
};

type CreateApiKeyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateApiKeyData) => void;
};

const CreateApiKeyModal = ({ isOpen, onClose, onSubmit }: CreateApiKeyModalProps) => {
  const [name, setName] = useState('');
  const [numberId, setNumberId] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    numberId?: string;
    permissions?: string;
  }>({});

  const { numbers } = useNumbers();

  const handlePermissionChange = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      numberId?: string;
      permissions?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!numberId) {
      newErrors.numberId = 'Please select a WhatsApp number';
      isValid = false;
    }

    if (permissions.length === 0) {
      newErrors.permissions = 'Please select at least one permission';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        numberId,
        permissions,
      });
      
      // Reset form
      setName('');
      setNumberId('');
      setPermissions([]);
      setErrors({});
    }
  };

  if (!isOpen) return null;

  const permissionOptions = [
    { id: 'send_messages', label: 'Send Messages' },
    { id: 'receive_messages', label: 'Receive Messages' },
    { id: 'media_access', label: 'Media Access' },
    { id: 'webhook_events', label: 'Webhook Events' },
  ];

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
              Create New API Key
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
                    Key Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="e.g., Shopify Bot API Key"
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

                {/* WhatsApp Number Select */}
                <div>
                  <label htmlFor="numberId" className="block text-sm font-medium text-gray-700">
                    WhatsApp Number
                  </label>
                  
                  {numbers.length === 0 ? (
                    <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                      <p className="text-sm text-gray-500">
                        No WhatsApp numbers available. Please link a number first.
                      </p>
                    </div>
                  ) : (
                    <>
                      <select
                        id="numberId"
                        value={numberId}
                        onChange={(e) => setNumberId(e.target.value)}
                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                          errors.numberId ? 'border-red-300' : 'border-gray-300'
                        } focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md`}
                      >
                        <option value="">Select a WhatsApp number</option>
                        {numbers.map((number) => (
                          <option key={number.id} value={number.id}>
                            {number.name} ({number.phoneNumber})
                          </option>
                        ))}
                      </select>
                      {errors.numberId && (
                        <p className="mt-1 text-sm text-red-600">{errors.numberId}</p>
                      )}
                    </>
                  )}
                </div>

                {/* Permissions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Permissions
                  </label>
                  
                  <div className="space-y-2">
                    {permissionOptions.map((permission) => (
                      <div key={permission.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={permission.id}
                            type="checkbox"
                            checked={permissions.includes(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={permission.id} className="font-medium text-gray-700">
                            {permission.label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {errors.permissions && (
                    <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={numbers.length === 0}
              >
                Create API Key
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

export default CreateApiKeyModal;