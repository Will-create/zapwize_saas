import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Zap, Link, Unlink } from 'lucide-react';
import { Agent, useAgents } from '@/hooks/useAgents';
import { useNumbers } from '@/hooks/useNumbers';
import AddNumberModal from '@/components/numbers/AddNumberModal';
import QRScanModal, { ConnectionData } from '@/components/numbers/QRScanModal';
import { useAlertStore } from '@/store/alertStore';

type ConnectionsTabProps = {
  agent: Agent;
};

const ConnectionsTab = ({ agent }: ConnectionsTabProps) => {
  const { t } = useTranslation();
  const { numbers } = useNumbers();
  const { updateAgent } = useAgents();
  const { addNumber, reconnectNumber } = useNumbers();
  const { show: showAlert } = useAlertStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAddingNumber, setIsAddingNumber] = useState(false);
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null);

  const connectedNumber = numbers.find(n => agent && n.id === agent.connectionid);

  const handleDisconnect = async () => {
    try {
      await updateAgent(agent.id, { connectionid: undefined });
      showAlert('Number disconnected successfully', 'success');
    } catch (error) {
      showAlert('Failed to disconnect number', 'error');
    }
  };

  const handleAddNumberSubmit = async (data: any) => {
    try {
      setIsAddingNumber(true);
      const newNumber = await addNumber(data);
      if (newNumber) {
        await updateAgent(agent.id, { connectionid: newNumber.id });
        setConnectionData({
          phone: newNumber.phonenumber.replace('+', '').replace(' ', ''),
          baseurl: newNumber.baseurl,
          value: newNumber.value,
          token: newNumber.token,
          webhook: newNumber.webhook,
          userid: newNumber.userid,
          status: newNumber.status,
          type: data.type
        });
        setIsAddModalOpen(false);
        setIsQRModalOpen(true);
        showAlert('WhatsApp number added and connected successfully', 'success');
      }
    } catch (err) {
      const error = err as Error;
      const message = error.message || 'Failed to add WhatsApp number';
      showAlert(message, 'error');
      throw err;
    } finally {
      setIsAddingNumber(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.connections.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.connections.description')}</p>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold">WhatsApp</h4>
              <p className="text-sm text-gray-500">{t('agents.edit.connections.whatsapp.description')}</p>
            </div>
          </div>
          {connectedNumber ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-600">{t('agents.edit.connections.whatsapp.connected')}</span>
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">{t('agents.edit.connections.whatsapp.notConnected')}</span>
              <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            </div>
          )}
        </div>

        {connectedNumber && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <p className="font-semibold">{connectedNumber.name}</p>
            <p className="text-sm text-gray-600">{connectedNumber.phonenumber}</p>
          </div>
        )}

        <div className="mt-4 flex justify-end gap-2">
          {connectedNumber ? (
            <Button variant="outline" onClick={handleDisconnect}>
              <Unlink className="mr-2 h-4 w-4" />
              {t('agents.edit.connections.whatsapp.disconnect')}
            </Button>
          ) : (
            <Button variant="default" onClick={() => setIsAddModalOpen(true)}>
              <Link className="mr-2 h-4 w-4" />
              {t('agents.edit.connections.whatsapp.connect')}
            </Button>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddNumberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          isLoading={isAddingNumber}
          onSubmit={handleAddNumberSubmit}
        />
      )}

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
              showAlert('WhatsApp number reconnected successfully', 'success');
            } catch (err) {
              const error = err as Error;
              showAlert(error.message || 'Failed to connect WhatsApp number', 'error');
            } finally {
              setIsQRModalOpen(false);
              setConnectionData(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default ConnectionsTab;
