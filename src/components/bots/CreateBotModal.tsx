import { useState, FormEvent } from 'react';
import { X, Bot, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import { useTranslation } from 'react-i18next';

type CreateBotModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
};

const CreateBotModal = ({ isOpen, onClose, onSubmit }: CreateBotModalProps) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    language: 'en',
    tone: 'professional',
    introEnabled: true,
    introMessage: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex justify-between items-start p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {t('createBotModal.title')}
            </h3>
            <button
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {t('createBotModal.stepIndicator', { step, total: 3 })}
                  </span>
                  <span className="text-xs text-gray-500">
                    {step === 1 ? t('createBotModal.steps.basicInfo') : step === 2 ? t('createBotModal.steps.personality') : t('createBotModal.steps.review')}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('createBotModal.fields.botName')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      placeholder={t('createBotModal.placeholders.botName')}
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                      {t('createBotModal.fields.whatsappNumber')}
                    </label>
                    <input
                      type="tel"
                      id="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      placeholder={t('createBotModal.placeholders.whatsappNumber')}
                    />
                  </div>

                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      {t('createBotModal.fields.language')}
                    </label>
                    <select
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    >
                      <option value="en">{t('createBotModal.languages.en')}</option>
                      <option value="es">{t('createBotModal.languages.es')}</option>
                      <option value="fr">{t('createBotModal.languages.fr')}</option>
                      <option value="de">{t('createBotModal.languages.de')}</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('createBotModal.fields.tone')}
                    </label>
                    <div className="mt-2 space-y-2">
                      {['professional', 'friendly', 'informal'].map((tone) => (
                        <label key={tone} className="inline-flex items-center mr-6">
                          <input
                            type="radio"
                            value={tone}
                            checked={formData.tone === tone}
                            onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                            className="form-radio h-4 w-4 text-green-600"
                          />
                          <span className="ml-2">{t(`tones.${tone}`)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.introEnabled}
                        onChange={(e) => setFormData({ ...formData, introEnabled: e.target.checked })}
                        className="form-checkbox h-4 w-4 text-green-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">{t('createBotModal.fields.enableIntro')}</span>
                    </label>
                    
                    {formData.introEnabled && (
                      <textarea
                        value={formData.introMessage}
                        onChange={(e) => setFormData({ ...formData, introMessage: e.target.value })}
                        className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        rows={3}
                        placeholder={t('createBotModal.placeholders.introMessage')}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">{t('createBotModal.fields.botName')}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">{t('createBotModal.fields.whatsappNumber')}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formData.whatsappNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">{t('createBotModal.fields.language')}</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {t(`languages.${formData.language}`)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">{t('createBotModal.fields.tone')}</dt>
                        <dd className="mt-1 text-sm text-gray-900">{t(`tones.${formData.tone}`)}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Bot className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          {t('createBotModal.reviewMessage')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              {step < 3 ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:text-sm"
                  >
                    {t('createBotModal.buttons.next')}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                    >
                      <ArrowLeft size={16} className="mr-2" />
                      {t('createBotModal.buttons.back')}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:text-sm"
                  >
                    {t('createBotModal.buttons.create')}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    {t('createBotModal.buttons.back')}
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBotModal;
