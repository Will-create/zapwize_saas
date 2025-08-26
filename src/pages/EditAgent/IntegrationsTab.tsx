import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import {
  Calendar,
  Users,
  ShoppingCart,
  CreditCard,
  Zap,
  Database,
  Link,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { Agent } from '@/hooks/useAgents';

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
};

const integrations: Integration[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'agents.edit.integrations.googleCalendar.description',
    icon: <Calendar className="h-6 w-6 text-blue-600" />,
    category: 'Scheduling',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'agents.edit.integrations.hubspot.description',
    icon: <Users className="h-6 w-6 text-orange-600" />,
    category: 'CRM',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'agents.edit.integrations.salesforce.description',
    icon: <Database className="h-6 w-6 text-cyan-600" />,
    category: 'CRM',
  },
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'agents.edit.integrations.shopify.description',
    icon: <ShoppingCart className="h-6 w-6 text-green-600" />,
    category: 'E-commerce',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'agents.edit.integrations.stripe.description',
    icon: <CreditCard className="h-6 w-6 text-indigo-600" />,
    category: 'Payments',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'agents.edit.integrations.zapier.description',
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    category: 'Automation',
  },
];

type IntegrationsTabProps = {
  agent: Agent;
};

const IntegrationsTab = ({ agent }: IntegrationsTabProps) => {
  const { t } = useTranslation();
  const [connectedIntegrations, setConnectedIntegrations] = useState<string[]>(['google-calendar']);

  const handleToggleConnection = (integrationId: string) => {
    setConnectedIntegrations(prev =>
      prev.includes(integrationId)
        ? prev.filter(id => id !== integrationId)
        : [...prev, integrationId]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.integrations.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.integrations.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(integration => {
          const isConnected = connectedIntegrations.includes(integration.id);
          return (
            <div key={integration.id} className="p-4 bg-white rounded-lg shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-2 bg-gray-100 rounded-lg">{integration.icon}</div>
                  <div>
                    <h4 className="text-lg font-semibold">{integration.name}</h4>
                    <p className="text-xs text-gray-500">{integration.category}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 min-h-[40px]">{t(integration.description)}</p>
              </div>
              <div className="mt-4 flex items-center justify-end">
                {isConnected ? (
                  <>
                    <span className="text-sm text-green-600 font-medium flex items-center mr-4">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('agents.edit.integrations.connected')}
                    </span>
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('agents.edit.integrations.configure')}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => handleToggleConnection(integration.id)}>
                    <Link className="mr-2 h-4 w-4" />
                    {t('agents.edit.integrations.connect')}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationsTab;
