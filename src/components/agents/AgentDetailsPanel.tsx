import { useState } from 'react';
import { Agent } from '../../hooks/useAgents';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { X } from 'lucide-react';
import OverviewTab from '../../pages/EditAgent/OverviewTab';
import PromptsTab from '../../pages/EditAgent/PromptsTab';
import KnowledgeBaseTab from '../../pages/EditAgent/KnowledgeBaseTab';
import ProductsAndServicesTab from '../../pages/EditAgent/ProductsAndServicesTab';
import ConnectionsTab from '../../pages/EditAgent/ConnectionsTab';
import IntegrationsTab from '../../pages/EditAgent/IntegrationsTab';
import LeadsTab from '../../pages/EditAgent/LeadsTab';
import SettingsTab from '../../pages/EditAgent/SettingsTab';
import BillingTab from '../../pages/EditAgent/BillingTab';
import { ChatScreen } from '../chat/ChatScreen';
import PhoneFrame from '../ui/PhoneFrame';
import AvatarCreator from '../ui/AvatarCreator';

interface AgentDetailsPanelProps {
  agent: Agent;
  onClose: () => void;
  onDelete: (agentId: string) => Promise<void>;
  initialTab?: string;
}

const AgentDetailsPanel = ({ agent, onClose, onDelete, initialTab = 'billing' }: AgentDetailsPanelProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [currentAgent, setCurrentAgent] = useState(agent);

  const handleAvatarSave = (avatar: string) => {
    console.log('Saving avatar:', avatar);
    // Here you would typically call an API to update the agent's avatar
    setCurrentAgent({ ...currentAgent, avatar });
  };

  const tabs = [
    { id: 'overview', label: t('agents.edit.tabs.overview') },
    { id: 'billing', label: t('agents.edit.tabs.billing') },
    { id: 'prompts', label: t('agents.edit.tabs.prompts') },
    { id: 'knowledgeBase', label: t('agents.edit.tabs.knowledgeBase') },
    { id: 'productsAndServices', label: t('agents.edit.tabs.productsAndServices') },
    { id: 'connections', label: t('agents.edit.tabs.connections') },
    { id: 'integrations', label: t('agents.edit.tabs.integrations') },
    { id: 'leads', label: t('agents.edit.tabs.leads') },
    { id: 'settings', label: t('agents.edit.tabs.settings') },
    { id: 'test', label: t('agents.edit.tabs.test') },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab agent={currentAgent} onUpdate={(data) => setCurrentAgent({ ...currentAgent, ...data })} onAvatarClick={() => setIsAvatarCreatorOpen(true)} />;
      case 'billing':
        return <BillingTab />;
      case 'prompts':
        return <PromptsTab />;
      case 'knowledgeBase':
        return <KnowledgeBaseTab />;
      case 'productsAndServices':
        return <ProductsAndServicesTab />;
      case 'connections':
        return <ConnectionsTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'leads':
        return <LeadsTab />;
      case 'settings':
        return <SettingsTab />;
      case 'test':
        return (
          <PhoneFrame>
            <ChatScreen agent={agent} />
          </PhoneFrame>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-white z-40">
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{currentAgent.name}</h2>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto pb-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 flex-grow overflow-y-auto">
            {renderTabContent()}
          </div>

        </div>
      </div>
      {isAvatarCreatorOpen && (
        <AvatarCreator
          onSave={handleAvatarSave}
          onClose={() => setIsAvatarCreatorOpen(false)}
        />
      )}
    </>
  );
};

export default AgentDetailsPanel;
