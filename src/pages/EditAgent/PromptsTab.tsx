import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/Button';
import { Upload, Download } from 'lucide-react';

const PromptsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.prompts.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.prompts.description')}</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="system-prompt" className="text-sm font-medium">{t('agents.edit.prompts.systemPrompt')}</label>
        <Textarea id="system-prompt" placeholder={t('agents.edit.prompts.systemPromptPlaceholder')} rows={10} />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            {t('agents.edit.prompts.import')}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t('agents.edit.prompts.export')}
          </Button>
        </div>
        <Button>{t('common.save')}</Button>
      </div>
    </div>
  );
};

export default PromptsTab;
