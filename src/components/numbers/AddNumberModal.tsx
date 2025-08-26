import { useState, FormEvent } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';

type AddNumberFormData = {
  id?: string,
  name: string;
  phonenumber: string;
  webhook: string;
  type: 'code' | 'qrcode';
};

type AddNumberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddNumberFormData) => Promise<void>;
  isLoading?: boolean;
};

const AddNumberModal = ({ isOpen, onClose, onSubmit, isLoading = false }: AddNumberModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [webhook, setWebhook] = useState('');
  const [type, setType] = useState<'code' | 'qrcode'>('qrcode');
  const [errors, setErrors] = useState<{
    name?: string;
    phonenumber?: string;
    webhook?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { name?: string; phonenumber?: string; webhook?: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = t('addNumber.errors.nameRequired');
      isValid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = t('addNumber.errors.nameTooShort');
      isValid = false;
    } else if (name.trim().length > 50) {
      newErrors.name = t('addNumber.errors.nameTooLong');
      isValid = false;
    }

    if (!phonenumber.trim()) {
      newErrors.phonenumber = t('addNumber.errors.phoneRequired');
      isValid = false;
    } else {
      const cleanPhone = phonenumber.replace(/\D/g, '');
      if (!/^\d{11,15}$/.test(cleanPhone)) {
        newErrors.phonenumber = t('addNumber.errors.phoneInvalid');
        isValid = false;
      }
    }

    if (webhook.trim()) {
      try {
        const url = new URL(webhook.trim());
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.webhook = t('addNumber.errors.urlInvalid');
          isValid = false;
        }
      } catch {
        newErrors.webhook = t('addNumber.errors.urlInvalid');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    try {
      await onSubmit({
        name: name.trim(),
        phonenumber: phonenumber.replace(/\s+/g, ''),
        webhook: webhook.trim(),
        type
      });
      setName('');
      setPhonenumber('');
      setWebhook('');
      setType('qrcode');
      setErrors({});
    } catch (error: any) {
      let errorMessage =
        typeof error == 'string'
          ? error
          : error.response?.data?.error ||
            (Array.isArray(error) && error[0]?.error) ||
            (error instanceof Error ? error.message : t('addNumber.errors.unexpected'));

      setErrors({ general: `${t('addNumber.errors.failed')}: ${errorMessage}` });
    }
  };

  const handleClose = () => {
    if (!isLoading) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse">
                <RefreshCw size={48} className="mx-auto text-green-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">{t('addNumber.loading.title')}</h3>
                <p className="mt-2 text-sm text-gray-600">{t('addNumber.loading.subtitle')}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{t('addNumber.title')}</h3>
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  {errors.general && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{errors.general}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        {t('addNumber.fields.name')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder={t('addNumber.placeholders.name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        maxLength={50}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.name ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">
                        {t('addNumber.fields.phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phonenumber"
                        placeholder={t('addNumber.placeholders.phone')}
                        value={phonenumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.phonenumber ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                      />
                      {errors.phonenumber ? (
                        <p className="mt-1 text-sm text-red-600">{errors.phonenumber}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">{t('addNumber.help.phone')}</p>
                      )}
                    </div>

                    {/* Connection Method */}
                    <div>
                      <label htmlFor="connection-type" className="block text-sm font-medium text-gray-700">
                        {t('addNumber.fields.connection')}
                      </label>
                      <select
                        id="connection-type"
                        value={type}
                        onChange={(e) => setType(e.target.value as 'code' | 'qrcode')}
                        disabled={isLoading}
                        className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md focus:ring-green-500"
                      >
                        <option value="qrcode">{t('addNumber.options.qrcode')}</option>
                        <option value="code">{t('addNumber.options.code')}</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        {type === 'qrcode' ? t('addNumber.help.qrcode') : t('addNumber.help.code')}
                      </p>
                    </div>

                    {/* Webhook */}
                    <div>
                      <label htmlFor="webhook" className="block text-sm font-medium text-gray-700">
                        {t('addNumber.fields.webhook')}
                      </label>
                      <input
                        type="url"
                        id="webhook"
                        placeholder={t('addNumber.placeholders.webhook')}
                        value={webhook}
                        onChange={(e) => setWebhook(e.target.value)}
                        disabled={isLoading}
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.webhook ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm`}
                      />
                      {errors.webhook ? (
                        <p className="mt-1 text-sm text-red-600">{errors.webhook}</p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500">{t('addNumber.help.webhook')}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
                  <Button type="submit" isLoading={isLoading} className="bg-green-600 text-white">
                    {t('addNumber.actions.continue')}
                  </Button>
                  <Button type="button" onClick={handleClose} disabled={isLoading} className="bg-white text-gray-700">
                    {t('addNumber.actions.cancel')}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNumberModal;
