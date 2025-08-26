import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Bot, Plus, Search, Power, PowerOff, MessageCircle } from 'lucide-react';
import { useAgents, Agent as AgentType } from '../hooks/useAgents';
import CreateAgentModal from '../components/agents/CreateAgentModal';
import AgentDetailsPanel from '../components/agents/AgentDetailsPanel';
import TestAgentModal from '../components/agents/TestAgentModal';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import StatusDisplayModal from '../components/ui/StatusDisplayModal';
import { useTranslation } from 'react-i18next';

const AgentsPage = () => {
  const { t } = useTranslation();
  const { agents, createAgent, toggleAgentStatus, deleteAgent, isLoading } = useAgents();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<AgentType | null>(null);
  const [agentToTest, setAgentToTest] = useState<AgentType | null>(null);
  const [agentToConfirm, setAgentToConfirm] = useState<{ agent: AgentType, action: 'delete' | 'toggle' } | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialTab, setInitialTab] = useState<string | undefined>(undefined);
  const [statusModalInfo, setStatusModalInfo] = useState<{
    isOpen: boolean;
    isSuccess: boolean;
    title: string;
    message: string;
  }>({ isOpen: false, isSuccess: true, title: '', message: '' });

  useEffect(() => {
    if (isLoading) return;

    const agentId = searchParams.get('id');
    const tab = searchParams.get('tab');
    const success = searchParams.get('success');

    if (agentId && agents) {
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        setSelectedAgent(agent);
        if (tab) {
          setInitialTab(tab);
        }
      }
    }

    if (success === 'true') {
      setStatusModalInfo({
        isOpen: true,
        isSuccess: true,
        title: t('agents.paymentSuccessTitle'),
        message: t('agents.paymentSuccessMessage'),
      });
    } else if (success === 'false') {
      setStatusModalInfo({
        isOpen: true,
        isSuccess: false,
        title: t('agents.paymentFailedTitle'),
        message: t('agents.paymentFailedMessage'),
      });
    }
    
    if (agentId || tab || success) {
      // Clean up URL params after processing
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('id');
      newSearchParams.delete('tab');
      newSearchParams.delete('success');
      setSearchParams(newSearchParams, { replace: true });
    }

  }, [agents, isLoading, searchParams, setSearchParams, t]);

  const filteredAgents = (agents || []).filter(agent =>
    agent && agent.name && agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusToggle = async (agentId: string) => {
    const originalStatus = agents.find(a => a.id === agentId)?.status;
    try {
        await toggleAgentStatus(agentId);
        setToast({
            show: true,
            message: t(originalStatus === 'active' ? 'agents.agentDeactivated' : 'agents.agentActivated'),
            type: 'success',
        });
    } catch (error) {
        const err = error as Error;
        setToast({
            show: true,
            message: err.message || t('agents.toggleAgentFailed'),
            type: 'error',
        });
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
        await deleteAgent(agentId);
        setToast({
            show: true,
            message: t('agents.agentDeleted'),
            type: 'success',
        });
        setSelectedAgent(null);
    } catch (error) {
        const err = error as Error;
        setToast({
            show: true,
            message: err.message || t('agents.deleteAgentFailed'),
            type: 'error',
        });
    }
  };

  const getStatusColor = (status: AgentType['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const confirmAction = () => {
    if (agentToConfirm) {
      if (agentToConfirm.action === 'delete') {
        handleDeleteAgent(agentToConfirm.agent.id);
      } else if (agentToConfirm.action === 'toggle') {
        handleStatusToggle(agentToConfirm.agent.id);
      }
      setAgentToConfirm(null);
    }
  };
  
  const getConfirmationMessage = () => {
    if (!agentToConfirm) return '';
    if (agentToConfirm.action === 'delete') {
      return t('agents.deleteConfirm', { agentName: agentToConfirm.agent.name });
    }
    const newStatus = agentToConfirm.agent.status === 'active' ? t('common.inactive') : t('common.active');
    return t('agents.toggleConfirm', { agentName: agentToConfirm.agent.name, status: newStatus });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('agents.pageTitle')}</h1>
        <p className="text-gray-600 mt-1">{t('agents.pageDescription')}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('agents.searchPlaceholder')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          {t('agents.createNewAgent')}
        </Button>
      </div>

      {filteredAgents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          {searchQuery ? (
            <div>
              <p className="text-gray-500 mb-2">{t('agents.noAgentsFound', { query: searchQuery })}</p>
              <Button onClick={() => setSearchQuery('')} variant="link">{t('agents.clearSearch')}</Button>
            </div>
          ) : (
            <div className="py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Bot size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('agents.noAgentsYetTitle')}</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">{t('agents.noAgentsYetDescription')}</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus size={16} className="mr-2" />
                {t('agents.createFirstAgent')}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => setSelectedAgent(agent)}>
              <div>
                <div className="flex items-center mb-4">
                  <img src={agent.avatar || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'} alt={agent.name} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 truncate">{agent.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{t('agents.columns.created')}: {new Date(agent.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end items-center mt-4 gap-2">
                <Button
                  onClick={(e) => { e.stopPropagation(); setAgentToTest(agent); }}
                  variant="outline"
                  size="sm"
                >
                  <MessageCircle size={16} className="mr-2" />
                  {t('agents.test')}
                </Button>
                <Button
                  onClick={(e) => { e.stopPropagation(); setAgentToConfirm({ agent, action: 'toggle' }); }}
                  variant={agent.status === 'active' ? 'destructive' : 'default'}
                  size="sm"
                  aria-label={agent.status === 'active' ? t('agents.deactivate') : t('agents.activate')}
                >
                  {agent.status === 'active' ? <PowerOff size={16} /> : <Power size={16} />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateAgentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={async (data) => {
            await createAgent(data);
            setToast({ show: true, message: t('agents.agentCreated'), type: 'success' });
          }}
        />
      )}

      {selectedAgent && (
        <AgentDetailsPanel 
          agent={selectedAgent} 
          onClose={() => setSelectedAgent(null)} 
          onDelete={() => setAgentToConfirm({ agent: selectedAgent, action: 'delete' })}
          initialTab={initialTab}
        />
      )}

      {agentToTest && (
        <TestAgentModal
          isOpen={!!agentToTest}
          onClose={() => setAgentToTest(null)}
          agent={agentToTest}
        />
      )}

      {agentToConfirm && (
        <ConfirmationModal
          isOpen={!!agentToConfirm}
          onClose={() => setAgentToConfirm(null)}
          onConfirm={confirmAction}
          title={agentToConfirm.action === 'delete' ? t('agents.deleteAgent') : t('agents.toggleStatus')}
          message={getConfirmationMessage()}
          confirmText={agentToConfirm.action === 'delete' ? t('common.delete') : t('common.confirm')}
        />
      )}

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      
      <StatusDisplayModal
        isOpen={statusModalInfo.isOpen}
        onClose={() => setStatusModalInfo({ ...statusModalInfo, isOpen: false })}
        isSuccess={statusModalInfo.isSuccess}
        title={statusModalInfo.title}
        message={statusModalInfo.message}
      />
    </div>
  );
};

export default AgentsPage;
