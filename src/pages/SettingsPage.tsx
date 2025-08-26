import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Mail, Shield, Eye } from 'lucide-react';
import Toast from '../components/ui/Toast';
import Button from '../components/ui/Button';
import TwoFactorAuthModal from './auth/TwoFactorAuthModal';
import { authService } from '../services/api';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [is2faModalOpen, setIs2faModalOpen] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  const [settings, setSettings] = useState({
    theme: 'light',
    language: i18n.language,
    emailNotifications: true,
    pushNotifications: true,
    dataCollection: true,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authService.getProfile();
        if (response.success && response.value) {
          setIs2faEnabled(response.value.two_factor_enabled);
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = () => {
    setToast({
      show: true,
      message: t('settings.toastSaved'),
      type: 'success',
    });
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setSettings({ ...settings, language: lang });
  };

  const handle2faSuccess = () => {
    setIs2faEnabled(true);
    setToast({ show: true, message: '2FA enabled successfully!', type: 'success' });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.accountTitle')}</h1>
        <p className="text-gray-600 mt-1">{t('settings.accountDescription')}</p>
      </div>

      <div className="space-y-6">
        {/* Display */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('settings.displayTitle')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.displayTheme')}</label>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="light">{t('settings.displayLight')}</option>
                  <option value="dark">{t('settings.displayDark')}</option>
                  <option value="system">{t('settings.displaySystem')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.displayLanguage')}</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="en">{t('settings.displayEnglish')}</option>
                  <option value="fr">{t('settings.displayFrench')}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('settings.notificationsTitle')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail size={20} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('settings.notificationsEmail')}</p>
                    <p className="text-xs text-gray-500">{t('settings.notificationsEmailDesc')}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell size={20} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('settings.notificationsPush')}</p>
                    <p className="text-xs text-gray-500">{t('settings.notificationsPushDesc')}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('settings.securityTitle')}</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield size={20} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('settings.securityTwoFactor')}</p>
                    <p className="text-xs text-gray-500">{t('settings.securityTwoFactorDesc')}</p>
                  </div>
                </div>
                <Button onClick={() => setIs2faModalOpen(true)} disabled={is2faEnabled}>
                  {is2faEnabled ? t('settings.twoFactorEnabled') : t('settings.enableTwoFactor')}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye size={20} className="text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{t('settings.securityDataCollection')}</p>
                    <p className="text-xs text-gray-500">{t('settings.securityDataCollectionDesc')}</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dataCollection}
                  onChange={(e) => setSettings({ ...settings, dataCollection: e.target.checked })}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            {t('settings.save')}
          </Button>
        </div>
      </div>

      <Toast show={toast.show} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />
      <TwoFactorAuthModal
        isOpen={is2faModalOpen}
        onClose={() => setIs2faModalOpen(false)}
        onSuccess={handle2faSuccess}
      />
    </div>
  );
};

export default SettingsPage;
