import { useTranslation } from 'react-i18next';
import Button from '@/components/ui/Button';
import { Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const LeadsTab = () => {
  const { t } = useTranslation();

  const leads = [
    { id: '1', contact: 'John Doe', date: '2023-10-27', conversation: 'Hello, I have a question...' },
    { id: '2', contact: 'Jane Smith', date: '2023-10-26', conversation: 'I would like to know more about your services.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t('agents.edit.leads.title')}</h3>
        <p className="text-sm text-gray-500">{t('agents.edit.leads.description')}</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input placeholder={t('agents.edit.leads.searchPlaceholder')} className="pl-10" />
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {t('agents.edit.leads.exportCsv')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.leads.columns.contact')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.leads.columns.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('agents.edit.leads.columns.conversation')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{lead.contact}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{lead.date}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{lead.conversation}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsTab;
