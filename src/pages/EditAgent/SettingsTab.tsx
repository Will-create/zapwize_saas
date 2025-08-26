import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button';

const SettingsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.settings.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.settings.description')}</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="provider" className="text-sm font-medium">{t('agents.edit.settings.provider')}</label>
            <Select>
              <SelectTrigger id="provider">
                <SelectValue placeholder={t('agents.edit.settings.providerPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="google">Google</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="model" className="text-sm font-medium">{t('agents.edit.settings.model')}</label>
            <Select>
              <SelectTrigger id="model">
                <SelectValue placeholder={t('agents.edit.settings.modelPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="claude-2">Claude 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="token-cap" className="text-sm font-medium">{t('agents.edit.settings.tokenCap')}</label>
          <Input id="token-cap" type="number" placeholder={t('agents.edit.settings.tokenCapPlaceholder')} />
        </div>

        <div className="space-y-2">
          <label htmlFor="webhook-url" className="text-sm font-medium">{t('agents.edit.settings.webhookUrl')}</label>
          <Input id="webhook-url" placeholder={t('agents.edit.settings.webhookUrlPlaceholder')} />
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
