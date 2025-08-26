import { useState } from 'react';
import { Trash2, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '../ui/ConfirmationModal';

type BotDetailsPanelProps = {
  bot: {
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'draft';
    whatsappNumber: string;
    createdAt: string;
    messageCount: number;
    successRate: number;
    documents: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
    }>;
    tokenUsage: {
      total: number;
      remaining: number;
      resetDate: string;
    };
  };
  onClose: () => void;
  onDelete: (id: string) => void;
};

const BotDetailsPanel = ({ bot, onClose, onDelete }: BotDetailsPanelProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'knowledge'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{bot.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">{t('botPanel.closePanel')}</span>
            ×
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
            bot.status === 'active' ? 'bg-green-100 text-green-800' :
            bot.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {t(`status.${bot.status}`)}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">{bot.whatsappNumber}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('botPanel.tabs.overview')}
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              activeTab === 'knowledge'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('botPanel.tabs.knowledge')}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${
              activeTab === 'settings'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t('botPanel.tabs.settings')}
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">{t('botPanel.overview.messages')}</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {bot.messageCount.toLocaleString()}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">{t('botPanel.overview.successRate')}</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">
                  {bot.successRate}%
                </div>
              </div>
            </div>

            {/* Token Usage */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('botPanel.overview.tokenUsage')}</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">
                    {bot.tokenUsage.remaining.toLocaleString()} / {bot.tokenUsage.total.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {t('botPanel.overview.resetsOn', { date: new Date(bot.tokenUsage.resetDate).toLocaleDateString() })}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(bot.tokenUsage.remaining / bot.tokenUsage.total) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{t('botPanel.overview.quickActions')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 size={16} className="mr-2" />
                  {t('botPanel.actions.deleteBot')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {bot.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText size={20} className="text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                      <div className="text-xs text-gray-500">{formatBytes(doc.size)}</div>
                    </div>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => {/* Handle remove */}}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {t('botPanel.actions.uploadDocument')}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* LLM Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">{t('botPanel.settings.languageModel')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('botPanel.settings.provider')}</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option>OpenAI</option>
                    <option>DeepInfra</option>
                    <option>Ollama</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('botPanel.settings.model')}</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option>gpt-4</option>
                    <option>gpt-3.5-turbo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('botPanel.settings.maxTokens')}</label>
                  <input
                    type="number"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    defaultValue={4096}
                  />
                </div>
              </div>
            </div>

            {/* Image Generation Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">{t('botPanel.settings.imageGeneration')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('botPanel.settings.model')}</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option>DALL-E 3</option>
                    <option>Stable Diffusion</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Audio Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">{t('botPanel.settings.audioProcessing')}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('botPanel.settings.speechToText')}</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option>Whisper</option>
                    <option>Custom Model</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">{t('botPanel.settings.textToSpeech')}</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                    <option>OpenAI TTS</option>
                    <option>ElevenLabs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(bot.id);
          onClose();
        }}
        title={t('botPanel.modal.deleteTitle')}
        message={t('botPanel.modal.deleteMessage')}
        confirmText={t('botPanel.modal.confirm')}
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default BotDetailsPanel;
