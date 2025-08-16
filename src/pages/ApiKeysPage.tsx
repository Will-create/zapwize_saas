import { useState, useEffect } from 'react';
import { useApiKeys } from '../hooks/useApiKeys';
import { useNumbers } from '../hooks/useNumbers';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Copy, Trash2, Key, X } from 'lucide-react';
import Button from '../components/ui/Button';
import Toast from '../components/ui/Toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const ApiKeysPage = () => {
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  
  // Form state
  const [name, setName] = useState('');
  const [numberId, setNumberId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    numberId?: string;
    general?: string;
  }>({});
  
  const { apiKeys, createApiKey, revokeApiKey } = useApiKeys();
  const { numbers } = useNumbers();
  const { t } = useTranslation();
  
  // Filter API keys based on search query
  const filteredApiKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.numberid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      showToast(t('apikey.copiedToClipboard'), 'success');
    });
  };

  const handleRevokeClick = (id: string) => {
    setSelectedKeyId(id);
    setIsConfirmModalOpen(true);
  };

  const confirmRevoke = async () => {
    if (selectedKeyId) {
      try {
        await revokeApiKey(selectedKeyId);
        showToast(t('apikey.apiKeyRevokedSuccess'), 'success');
      } catch (error) {
        const err = error as Error;
        showToast(err.message || t('apikey.failedToRevokeApiKey'), 'error');
      }
    }
    setIsConfirmModalOpen(false);
    setSelectedKeyId(null);
  };
  
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({
      show: true,
      message,
      type,
    });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  
  const validateForm = () => {
    const errors: {
      name?: string;
      numberId?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = t('apikey.nameRequired');
      isValid = false;
    }

    if (!numberId) {
      errors.numberId = t('apikey.selectWhatsAppNumber');
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  
  const handleCreateApiKey = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      const newKey = await createApiKey({
        name: name.trim(),
        numberId,
        permissions: ['send_messages', 'receive_messages'] // Default permissions for MVP
      });
      
      showToast(t('apikey.apiKeyCreatedSuccess'), 'success');
      setIsCreatePanelOpen(false);
      
      // Reset form
      setName('');
      setNumberId('');
      
      // Copy the new key to clipboard
      if (newKey) {
        handleCopyToClipboard(newKey.value);
      }
    } catch (error) {
      const err = error as Error;
      setFormErrors({ general: err.message || t('apikey.unexpectedError') });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setNumberId('');
    setFormErrors({});
  };

  return (
    <div className="flex h-full">
      <div className={`flex-1 ${isCreatePanelOpen ? 'mr-80' : ''}`}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{t('apikey.apiKeys')}</h1>
          <p className="text-gray-600 mt-1">{t('apikey.apiKeysDescription')}</p>
        </div>

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('apikey.searchApiKeys')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              resetForm();
              setIsCreatePanelOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Plus size={16} className="mr-2" />
            {t('apikey.createNewApiKey')}
          </Button>
        </div>

        {/* API Keys list */}
        {filteredApiKeys.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            {searchQuery ? (
              <div>
                <p className="text-gray-500 mb-2">{t('apikey.noResultsFound', { query: searchQuery })}</p>
                <Button 
                  onClick={() => setSearchQuery('')}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  {t('apikey.clearSearch')}
                </Button>
              </div>
            ) : (
              <div className="py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Key size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('apikey.noApiKeysYet')}</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {t('apikey.noApiKeysDescription')}
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsCreatePanelOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus size={16} className="mr-2" />
                  {t('apikey.createNewApiKey')}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('apikey.keyName')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('apikey.linkedNumber')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('apikey.createdAt')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('apikey.apiKey')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('apikey.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApiKeys.map((apiKey) => (
                    <tr key={apiKey.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{apiKey.numberid}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{apiKey.dtcreated}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-mono bg-gray-100 p-1 rounded flex items-center">
                          <span className="truncate w-24">{apiKey.value}</span>
                          <Button 
                            onClick={() => handleCopyToClipboard(apiKey.value)}
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            title={t('apikey.copyApiKey')}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button 
                          onClick={() => apiKey.id && handleRevokeClick(apiKey.id)}
                          className="text-red-600 hover:text-red-900 flex items-center justify-end"
                        >
                          <Trash2 size={16} className="mr-1" />
                          {t('apikey.revoke')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Side Panel for Creating API Key */}
      {isCreatePanelOpen && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-20 border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">{t('apikey.createApiKey')}</h2>
              <button
                onClick={() => setIsCreatePanelOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            {formErrors.general && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{formErrors.general}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Name field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t('apikey.keyName')}
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder={t('apikey.keyNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>

              {/* WhatsApp Number Select */}
              <div>
                <label htmlFor="numberId" className="block text-sm font-medium text-gray-700">
                  {t('apikey.whatsappNumber')}
                </label>
                
                {numbers.length === 0 ? (
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                    <p className="text-sm text-gray-500">
                      {t('apikey.noWhatsappNumbers')}
                    </p>
                  </div>
                ) : (
                  <>
                    <select
                      id="numberId"
                      value={numberId}
                      onChange={(e) => setNumberId(e.target.value)}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
                        formErrors.numberId ? 'border-red-300' : 'border-gray-300'
                      } focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md`}
                    >
                      <option value="">{t('apikey.selectWhatsAppNumber')}</option>
                      {numbers.map((number) => (
                        <option key={number.id} value={number.id}>
                          {number.name} ({number.phonenumber})
                        </option>
                      ))}
                    </select>
                    {formErrors.numberId && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.numberId}</p>
                    )}
                  </>
                )}
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleCreateApiKey}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? t('apikey.creating') : t('apikey.createApiKey')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmRevoke}
          title={t('apikey.revokeApiKey')}
          message={t('apikey.revokeApiKeyConfirmation')}
          confirmText={t('apikey.revokeKey')}
          confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
      )}

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default ApiKeysPage;