import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import GlobalAlertBanner from './components/ui/GlobalAlertBanner';

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
  </div>
);

// Lazy load components
const Login = lazy(() => import('./pages/auth/Login' /* webpackChunkName: "auth" */));
const Register = lazy(() => import('./pages/auth/Register' /* webpackChunkName: "auth" */));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword' /* webpackChunkName: "auth" */));
const VerifyAccount = lazy(() => import('./pages/auth/VerifyAccount' /* webpackChunkName: "auth" */));
const ChangePassword = lazy(() => import('./pages/auth/ChangePassword' /* webpackChunkName: "auth" */));

const MainLayout = lazy(() => import('./components/layout/MainLayout' /* webpackChunkName: "layout" */));
const DashboardPage = lazy(() => import('./pages/DashboardPage' /* webpackChunkName: "dashboard" */));
// const ChatsPage = lazy(() => import('./pages/ChatsPage' /* webpackChunkName: "chats" */));
const NumbersPage = lazy(() => import('./pages/NumbersPage' /* webpackChunkName: "numbers" */));
// const CampaignsPage = lazy(() => import('./pages/CampaignsPage' /* webpackChunkName: "campaigns" */));
const ApiKeysPage = lazy(() => import('./pages/ApiKeysPage' /* webpackChunkName: "api-keys" */));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage' /* webpackChunkName: "docs" */));
const BillingPage = lazy(() => import('./pages/BillingPage' /* webpackChunkName: "billing" */));
const SettingsPage = lazy(() => import('./pages/SettingsPage' /* webpackChunkName: "settings" */));
const ProfilePage = lazy(() => import('./pages/ProfilePage' /* webpackChunkName: "profile" */));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage' /* webpackChunkName: "notifications" */));
const PaymentPage = lazy(() => import('./pages/PaymentPage' /* webpackChunkName: "payment" */));
// const TemplatesPage = lazy(() => import('./pages/TemplatesPage' /* webpackChunkName: "templates" */));
const UsersPage = lazy(() => import('./pages/UsersPage' /* webpackChunkName: "users" */));
const AIBotPage = lazy(() => import('./pages/AIBotPage' /* webpackChunkName: "ai-bot" */));

// Auth context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <GlobalAlertBanner />
      <Router>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-account" element={<VerifyAccount />} />
              
              {/* Dashboard routes - wrapped in MainLayout */}
              <Route
                path="/dashboard"
                element={
                  <Suspense fallback={<PageLoader />}>
                    <MainLayout />
                  </Suspense>
                }
              >
                <Route index element={<DashboardPage />} />
                {/* <Route path="chats" element={<ChatsPage />} /> */}
                <Route path="numbers" element={<NumbersPage />} />
                {/* <Route path="campaigns" element={<CampaignsPage />} /> */}
                {/* <Route path="templates" element={<TemplatesPage />} /> */}
                <Route path="ai-bot" element={<AIBotPage />} />
                <Route path="api-keys" element={<ApiKeysPage />} />
                <Route path="documentation" element={<DocumentationPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="billing/payment" element={<PaymentPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/change-password" element={<ChangePassword />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="users" element={<UsersPage />} />
              </Route>
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;