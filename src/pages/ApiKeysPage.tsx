import { useState } from 'react';
import { Plus, Search, Copy, Trash2, Key } from 'lucide-react';
import { useApiKeys } from '../hooks/useApiKeys';
import CreateApiKeyModal from '../components/apiKeys/CreateApiKeyModal';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

const ApiKeysPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  
  const { apiKeys, createApiKey, revokeApiKey } = useApiKeys();
  
  // Filter API keys based on search query
  const filteredApiKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    key.linkedNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setToast({
        show: true,
        message: 'API Key copied to clipboard',
        type: 'success',
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
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
            setToast({
                show: true,
                message: 'API Key revoked successfully',
                type: 'success',
            });
        } catch (error) {
            const err = error as Error;
            setToast({
                show: true,
                message: err.message || 'Failed to revoke API Key',
                type: 'error',
            });
        }
      
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
    }
    setIsConfirmModalOpen(false);
    setSelectedKeyId(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">API Keys</h1>
        <p className="text-gray-600 mt-1">Create and manage API keys for your WhatsApp numbers</p>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search API keys..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          Create New API Key
        </Button>
      </div>

      {/* API Keys list */}
      {filteredApiKeys.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          {searchQuery ? (
            <div>
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <Button 
                onClick={() => setSearchQuery('')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Clear search
              </Button>
            </div>
          ) : (
            <div className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Key size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No API keys created yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create an API key to authenticate your applications and access the Zapwize API.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="mr-2" />
                Create New API Key
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
                    Key Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Linked Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Key
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      <div className="text-sm text-gray-500">{apiKey.linkedNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {apiKey.permissions.map((permission, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(apiKey.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-100 p-1 rounded flex items-center">
                        <span className="truncate w-24">{apiKey.key}</span>
                        <Button 
                          onClick={() => handleCopyToClipboard(apiKey.key)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                          title="Copy API Key"
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        onClick={() => handleRevokeClick(apiKey.id)}
                        className="text-red-600 hover:text-red-900 flex items-center justify-end"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Revoke
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create API Key Modal */}
      {isCreateModalOpen && (
        <CreateApiKeyModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            const newKey = await createApiKey(data);
            setToast({
              show: true,
              message: 'API Key created successfully',
              type: 'success',
            });
            setIsCreateModalOpen(false);
            
            // Copy the new key to clipboard
            if (newKey) {
              handleCopyToClipboard(newKey.key);
            }
            
            setTimeout(() => {
              setToast(prev => ({ ...prev, show: false }));
            }, 3000);
          }}
        />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={confirmRevoke}
          title="Revoke API Key"
          message="Are you sure you want to revoke this API key? This action cannot be undone and any applications using this key will no longer be able to access the API."
          confirmText="Revoke Key"
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