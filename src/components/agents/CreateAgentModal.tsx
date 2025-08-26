import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { Input } from '../ui/input';
import AvatarCreator from '../ui/AvatarCreator';

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; avatar?: string }) => Promise<void>;
}

const agentTypes = [
  { name: 'from_scratch', icon: '✨' },
  { name: 'customer_support', icon: '🎧' },
  { name: 'sales_agent', icon: '💰' },
  { name: 'appointment_booking', icon: '📅' },
  { name: 'e-commerce_assistant', icon: '🛒' },
  { name: 'faq_automation', icon: '❓' },
  { name: 'lead_generation', icon: '🎯' },
];

const CreateAgentModal = ({ isOpen, onClose, onSubmit }: CreateAgentModalProps) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('');
  const [avatar, setAvatar] = useState('https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg');
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('agents.createAgentModal.errors.nameRequired'));
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await onSubmit({ name, type, avatar });
      onClose();
    } catch (err) {
      setError(t('agents.createAgentModal.errors.createFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col" style={{ maxHeight: '90vh' }}>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">{t('agents.createAgentModal.title')}</h2>
            <p className="text-gray-600 mt-1">{t('agents.createAgentModal.description')}</p>
          </div>

          <div className="p-6 overflow-y-auto">
            <div className="mb-6">
              <label htmlFor="agentName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('agents.createAgentModal.agentNameLabel')}
              </label>
              <Input
                id="agentName"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder={t('agents.createAgentModal.agentNamePlaceholder')}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('agents.createAgentModal.avatarLabel')}
              </label>
              <div className="flex items-center gap-4">
                <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full bg-gray-200" />
                <Button onClick={() => setIsAvatarCreatorOpen(true)} variant="outline">{t('agents.createAgentModal.designAvatar')}</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {agentTypes.map((type) => (
                <div
                  key={type.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedType === type.name ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedType(type.name)}
                >
                  <div className="text-4xl mb-2">{type.icon}</div>
                  <h3 className="text-lg font-semibold">{t(`agents.agentTypes.${type.name}.title`)}</h3>
                  <p className="text-sm text-gray-500">{t(`agents.agentTypes.${type.name}.description`)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4 p-6 border-t">
            <Button onClick={onClose} variant="secondary" disabled={isLoading}>{t('common.cancel')}</Button>
            <Button onClick={handleSubmit} disabled={!selectedType || !agentName || isLoading}>
              {isLoading ? t('common.creating') : t('common.create')}
            </Button>
          </div>
        </div>
      </div>
      {isAvatarCreatorOpen && (
        <AvatarCreator
          onAvatarChange={setAvatar}
          onClose={() => setIsAvatarCreatorOpen(false)}
          currentAvatar={avatar}
        />
      )}
    </>
  );
};

export default CreateAgentModal;
