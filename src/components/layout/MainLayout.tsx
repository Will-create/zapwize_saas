import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../../context/AuthContext';
import GlobalAlertBanner from '../ui/GlobalAlertBanner';
import { useTranslation } from 'react-i18next';

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <GlobalAlertBanner />
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-2 sm:mb-0">
              &copy; {new Date().getFullYear()} Zapwize. {t('mainlayout.footer.rights')}
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="hover:text-gray-900">{t('mainlayout.footer.home')}</Link>
              <Link to="/documentation" className="hover:text-gray-900">{t('mainlayout.footer.documentation')}</Link>
              <Link to="/terms" className="hover:text-gray-900">{t('mainlayout.footer.terms')}</Link>
              <Link to="/privacy" className="hover:text-gray-900">{t('mainlayout.footer.privacy')}</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
