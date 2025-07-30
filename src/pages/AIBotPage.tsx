import { useState } from 'react';
import { Bot, Plus, Search, Power, PowerOff } from 'lucide-react';
import { useBots, Bot as BotType } from '../hooks/useBots';
import CreateBotModal from '../components/bots/CreateBotModal';
import BotDetailsPanel from '../components/bots/BotDetailsPanel';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';

const AIBotPage = () => {
  const { bots, createBot, toggleBotStatus, deleteBot } = useBots();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBot, setSelectedBot] = useState<BotType | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  const filteredBots = bots.filter(bot =>
    bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bot.whatsappNumber.includes(searchQuery)
  );

  const handleStatusToggle = async (botId: string) => {
    const originalStatus = bots.find(b => b.id === botId)?.status;
    try {
        await toggleBotStatus(botId);
        setToast({
            show: true,
            message: `Bot ${originalStatus === 'active' ? 'deactivated' : 'activated'} successfully`,
            type: 'success',
        });
    } catch (error) {
        const err = error as Error;
        setToast({
            show: true,
            message: err.message || 'Failed to toggle bot status',
            type: 'error',
        });
    }
  };

  const handleDeleteBot = async (botId: string) => {
    try {
        await deleteBot(botId);
        setToast({
            show: true,
            message: 'Bot deleted successfully',
            type: 'success',
        });
        setSelectedBot(null);
    } catch (error) {
        const err = error as Error;
        setToast({
            show: true,
            message: err.message || 'Failed to delete bot',
            type: 'error',
        });
    }
  };

  const getStatusColor = (status: BotType['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Bots</h1>
        <p className="text-gray-600 mt-1">Create and manage your WhatsApp AI assistants</p>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search bots..."
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
          Create New Bot
        </Button>
      </div>

      {/* Bots list */}
      {filteredBots.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          {searchQuery ? (
            <div>
              <p className="text-gray-500 mb-2">No bots found matching "{searchQuery}"</p>
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
                <Bot size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No AI bots created yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first AI bot to automate customer interactions on WhatsApp.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Plus size={16} className="mr-2" />
                Create First Bot
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
                    Bot Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBots.map((bot) => (
                  <tr 
                    key={bot.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedBot(bot)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bot.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{bot.whatsappNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(bot.status)}`}>
                        {bot.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bot.messageCount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{bot.successRate}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(bot.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusToggle(bot.id);
                        }}
                        className={`${
                          bot.status === 'active' 
                            ? 'text-green-600 hover:text-green-900' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title={bot.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {bot.status === 'active' ? <Power size={16} /> : <PowerOff size={16} />}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Bot Modal */}
      {isCreateModalOpen && (
        <CreateBotModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            await createBot(data);
            setToast({
              show: true,
              message: 'Bot created successfully',
              type: 'success',
            });
          }}
        />
      )}

      {/* Bot Details Panel */}
      {selectedBot && (
        <BotDetailsPanel
          bot={selectedBot}
          onClose={() => setSelectedBot(null)}
          onDelete={handleDeleteBot}
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

export default AIBotPage;