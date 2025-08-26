import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAgents, Agent } from '@/hooks/useAgents';
import OverviewTab from './OverviewTab';
import PromptsTab from './PromptsTab';
import KnowledgeBaseTab from './KnowledgeBaseTab';
import ProductsAndServicesTab from './ProductsAndServicesTab';
import ConnectionsTab from './ConnectionsTab';
import IntegrationsTab from './IntegrationsTab';
import LeadsTab from './LeadsTab';
import SettingsTab from './SettingsTab';
import BillingTab from './BillingTab';
import PhoneFrame from '../../components/ui/PhoneFrame';
import { ChatScreen } from '../../components/chat/ChatScreen';
import AvatarCreator from '@/components/ui/AvatarCreator';
import {
    LayoutDashboard, MessageSquare, BookOpen, ShoppingBag, Plug, Puzzle, Users, Settings, FlaskConical, CreditCard
} from 'lucide-react';

const EditAgentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { agents, updateAgent, deleteAgent } = useAgents();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [agentData, setAgentData] = useState<Agent | null>(null);
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);

  useEffect(() => {
    const currentAgent = agents.find(a => a.id === id);
    if (currentAgent) {
      setAgentData(currentAgent);
    }
  }, [agents, id]);

  const handleUpdate = (data: Partial<Agent>) => {
    if (agentData) {
      setAgentData({ ...agentData, ...data });
    }
  };

  const handleDelete = async () => {
    if (agentData) {
      await deleteAgent(agentData.id);
      navigate('/agents');
    }
  };

  const agent = agentData;

  const tabs = [
    { id: 'overview', label: t('agents.edit.tabs.overview'), icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'prompts', label: t('agents.edit.tabs.prompts'), icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'knowledgeBase', label: t('agents.edit.tabs.knowledgeBase'), icon: <BookOpen className="h-5 w-5" /> },
    { id: 'billing', label: t('agents.edit.tabs.billing'), icon: <CreditCard className="h-5 w-5" /> },
    { id: 'productsAndServices', label: t('agents.edit.tabs.productsAndServices'), icon: <ShoppingBag className="h-5 w-5" /> },
    { id: 'connections', label: t('agents.edit.tabs.connections'), icon: <Plug className="h-5 w-5" /> },
    { id: 'integrations', label: t('agents.edit.tabs.integrations'), icon: <Puzzle className="h-5 w-5" /> },
    { id: 'leads', label: t('agents.edit.tabs.leads'), icon: <Users className="h-5 w-5" /> },
    { id: 'settings', label: t('agents.edit.tabs.settings'), icon: <Settings className="h-5 w-5" /> },
    { id: 'test', label: t('agents.edit.tabs.test'), icon: <FlaskConical className="h-5 w-5" /> },
  ];

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{t('agents.edit.notFound.title')}</h2>
          <p className="text-gray-500 mt-2">{t('agents.edit.notFound.description')}</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab agent={agent} onUpdate={handleUpdate} onAvatarClick={() => setIsAvatarCreatorOpen(true)} onDelete={handleDelete} />;
      case 'prompts':
        return <PromptsTab />;
      case 'knowledgeBase':
        return <KnowledgeBaseTab />;
      case 'productsAndServices':
        return <ProductsAndServicesTab />;
      case 'connections':
        return <ConnectionsTab agent={agent} />;
      case 'integrations':
        return <IntegrationsTab agent={agent} />;
      case 'leads':
        return <LeadsTab />;
      case 'billing':
        return <BillingTab />;
      case 'settings':
        return <SettingsTab />;
      case 'test':
        return (
          <PhoneFrame>
            <ChatScreen />
          </PhoneFrame>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
          <p className="text-gray-600 mt-1">{t('agents.edit.description', { agentId: id })}</p>
        </div>
      </div>

      <div>
        <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500"
                onChange={(e) => setActiveTab(e.target.value)}
                value={activeTab}
            >
                {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
            </select>
        </div>
        <div className="hidden sm:block">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                          activeTab === tab.id
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 whitespace-nowrap`}
                      >
                        <span className="mr-2">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    ))}
                </nav>
            </div>
        </div>
        <div className="mt-6">{renderTabContent()}</div>
      </div>
      {isAvatarCreatorOpen && (
        <AvatarCreator
          onClose={() => setIsAvatarCreatorOpen(false)}
          onSave={(svg) => {
            handleUpdate({ avatar: `data:image/svg+xml;base64,${btoa(svg)}` });
            setIsAvatarCreatorOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default EditAgentPage;
