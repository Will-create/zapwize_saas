import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import Button from '../../components/ui/Button';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { Agent } from '../../hooks/useAgents';
import { Trash2 } from 'lucide-react';

interface OverviewTabProps {
  agent: Agent;
  onUpdate: (data: Partial<Agent>) => void;
  onAvatarClick: () => void;
  onDelete: () => void;
}

const OverviewTab = ({ agent, onUpdate, onAvatarClick, onDelete }: OverviewTabProps) => {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.overview.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.overview.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="agent-name" className="text-sm font-medium">{t('agents.edit.overview.name')}</label>
          <Input id="agent-name" value={agent.name} onChange={(e) => onUpdate({ name: e.target.value })} placeholder={t('agents.edit.overview.namePlaceholder')} />
        </div>

        <div className="space-y-2">
          <label htmlFor="agent-status" className="text-sm font-medium">{t('agents.edit.overview.status')}</label>
          <Select value={agent.status} onValueChange={(value) => onUpdate({ status: value as Agent['status'] })}>
            <SelectTrigger id="agent-status">
              <SelectValue placeholder={t('agents.edit.overview.statusPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">{t('agents.edit.overview.statusDraft')}</SelectItem>
              <SelectItem value="active">{t('agents.edit.overview.statusActive')}</SelectItem>
              <SelectItem value="inactive">{t('agents.edit.overview.statusInactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="agent-description" className="text-sm font-medium">{t('agents.edit.overview.descriptionLabel')}</label>
        <Textarea id="agent-description" placeholder={t('agents.edit.overview.descriptionPlaceholder')} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t('agents.edit.overview.avatar')}</label>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={agent.avatar} alt={agent.name} />
            <AvatarFallback>{agent.name[0]}</AvatarFallback>
          </Avatar>
          <Button variant="outline" onClick={onAvatarClick}>{t('agents.edit.overview.uploadAvatar')}</Button>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div>
            <h4 className="text-lg font-medium text-red-600">{t('agents.edit.settings.deleteAgent')}</h4>
            <p className="text-sm text-gray-500 mt-1">{t('agents.edit.settings.deleteWarning')}</p>
            <Button variant="destructive" onClick={() => setIsDeleteModalOpen(true)} className="mt-2">
                <Trash2 className="mr-2 h-4 w-4" />
                {t('agents.edit.settings.deleteAgent')}
            </Button>
        </div>
        <Button>{t('common.save')}</Button>
      </div>

      {isDeleteModalOpen && (
        <ConfirmationModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={onDelete}
            title={t('agents.deleteAgent')}
            message={t('agents.deleteConfirm', { agentName: agent.name })}
            confirmText={t('common.delete')}
        />
      )}
    </div>
  );
};

export default OverviewTab;
