import { useState } from 'react';
import { Plus, Search, QrCode, RefreshCw, Edit, Trash2, ExternalLink as External, Power, PowerOff } from 'lucide-react';
import AddNumberModal from '../components/numbers/AddNumberModal';
import QRScanModal, { ConnectionData } from '../components/numbers/QRScanModal';
import { useNumbers } from '../hooks/useNumbers';
import Badge from '../components/ui/Badge';
import Toast from '../components/ui/Toast';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const NumbersPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAddingNumber, setIsAddingNumber] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'remove' | 'stop' | 'logout';
    id: string;
  } | null>(null);
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });
  
  const { 
    numbers, 
    isLoading, 
    error, 
    addNumber, 
    reconnectNumber, 
    removeNumber,
    logoutNumber,
    stopNumber 
  } = useNumbers();
  
  // Filter numbers based on search query
  const filteredNumbers = numbers.filter(number => 
    number.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    number.phonenumber.includes(searchQuery)
  );

  const handleReconnect = (id: string) => {
    const number = numbers.find(n => n.id === id);
    if (number) {
      setConnectionData({ 
        phone: number.phonenumber, 
        baseurl: number.baseurl, 
        type: 'qrcode' 
      });
      setIsQRModalOpen(true);
    }
  };

  const handleAction = async () => {
    if (!confirmAction) return;

    try {
      switch (confirmAction.type) {
        case 'remove':
          await removeNumber(confirmAction.id);
          setToast({
            show: true,
            message: 'WhatsApp number removed successfully',
            type: 'success',
          });
          break;
        case 'stop':
          await stopNumber(confirmAction.id);
          setToast({
            show: true,
            message: 'WhatsApp number stopped successfully',
            type: 'success',
          });
          break;
        case 'logout':
          await logoutNumber(confirmAction.id);
          setToast({
            show: true,
            message: 'WhatsApp number logged out successfully',
            type: 'success',
          });
          break;
      }
    } catch (err: any) {
      setToast({
        show: true,
        message: Array.isArray(err) ? err[0].error : 'Operation failed',
        type: 'error',
      });
    } finally {
      setConfirmAction(null);
      setIsConfirmModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">WhatsApp Numbers</h1>
        <p className="text-gray-600 mt-1">Manage and monitor your connected WhatsApp numbers</p>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search numbers..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <Plus size={16} className="mr-2" />
          Add New Number
        </button>
      </div>

      {/* Numbers list */}
      {filteredNumbers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          {searchQuery ? (
            <div>
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <QrCode size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No WhatsApp numbers linked yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Link your first WhatsApp number to start using the Zapwize API for sending and receiving messages.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="mr-2" />
                Add New Number
              </button>
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
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Webhook URL
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNumbers.map((number) => (
                  <tr key={number.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{number.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{number.phonenumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {number.webhook ? (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="truncate max-w-[150px]">{number.webhook}</span>
                          <a 
                            href={number.webhook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-1 text-gray-400 hover:text-gray-500"
                          >
                            <External size={14} />
                          </a>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={number.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => {/* Open edit modal */}}
                          className="text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        {number.status === 'connected' ? (
                          <button 
                            onClick={() => {
                              setConfirmAction({ type: 'logout', id: number.id });
                              setIsConfirmModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                            title="Logout"
                          >
                            <Power size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleReconnect(number.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Reconnect"
                          >
                            <RefreshCw size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setConfirmAction({ type: 'stop', id: number.id });
                            setIsConfirmModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Stop"
                        >
                          <PowerOff size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            setConfirmAction({ type: 'remove', id: number.id });
                            setIsConfirmModalOpen(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Number Modal */}
      {isAddModalOpen && (
        <AddNumberModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)} 
          isLoading={isAddingNumber}
          onSubmit={async (data) => {
            try {
              setIsAddingNumber(true);
              const newNumber = await addNumber(data);
              if (newNumber) {
                setConnectionData({ 
                  phone: newNumber.phonenumber, 
                  baseurl: newNumber.baseurl, 
                  value: newNumber.value, 
                  type: data.type 
                });
                setIsAddModalOpen(false);
                setIsQRModalOpen(true);
                setToast({
                  show: true,
                  message: 'WhatsApp number added successfully',
                  type: 'success',
                });
              }
            } catch (err: any) {
              const message = err.response?.data?.message || (Array.isArray(err) ? err[0].error : 'Failed to add WhatsApp number');
              setToast({
                show: true,
                message,
                type: 'error',
              });
              throw err; // Re-throw the error to be caught by the modal
            } finally {
              setIsAddingNumber(false);
            }
          }}
        />
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && connectionData && (
        <QRScanModal 
          isOpen={isQRModalOpen}
          onClose={() => {
            setIsQRModalOpen(false);
            setConnectionData(null);
          }}
          connectionData={connectionData}
          onSuccess={async () => {
            try {
              await reconnectNumber(connectionData.phone);
              setToast({
                show: true,
                message: 'WhatsApp number connected successfully',
                type: 'success',
              });
            } catch (err: any) {
              setToast({
                show: true,
                message: Array.isArray(err) ? err[0].error : 'Failed to connect WhatsApp number',
                type: 'error',
              });
            } finally {
              setIsQRModalOpen(false);
              setConnectionData(null);
            }
          }}
        />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && confirmAction && (
        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
            setConfirmAction(null);
          }}
          onConfirm={handleAction}
          title={
            confirmAction.type === 'remove' ? 'Remove WhatsApp Number' :
            confirmAction.type === 'stop' ? 'Stop WhatsApp Number' :
            'Logout WhatsApp Number'
          }
          message={
            confirmAction.type === 'remove' 
              ? 'Are you sure you want to remove this WhatsApp number? This action cannot be undone.'
              : confirmAction.type === 'stop'
              ? 'Are you sure you want to stop this WhatsApp number? It will no longer receive or send messages.'
              : 'Are you sure you want to logout this WhatsApp number? You will need to scan the QR code again to reconnect.'
          }
          confirmText={
            confirmAction.type === 'remove' ? 'Remove' :
            confirmAction.type === 'stop' ? 'Stop' : 'Logout'
          }
          confirmButtonClass={
            confirmAction.type === 'remove' ? 'bg-red-600 hover:bg-red-700' :
            confirmAction.type === 'stop' ? 'bg-yellow-600 hover:bg-yellow-700' :
            'bg-blue-600 hover:bg-blue-700'
          }
        />
      )}

      {/* Toast Notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default NumbersPage;