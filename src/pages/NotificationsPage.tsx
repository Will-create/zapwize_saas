import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, X, Filter, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Toast from '../components/ui/Toast';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isRead: boolean;
  createdAt: string;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Number Successfully Linked',
    message: 'Your WhatsApp number has been successfully linked to your account.',
    type: 'success',
    isRead: false,
    createdAt: '2025-02-20T10:00:00Z',
  },
  {
    id: '2',
    title: 'Campaign Completed',
    message: 'Your broadcast campaign "Flash Sale" has been completed successfully.',
    type: 'info',
    isRead: true,
    createdAt: '2025-02-19T15:30:00Z',
  },
  {
    id: '3',
    title: 'API Key Created',
    message: 'New API key "Marketing Bot" has been created for your account.',
    type: 'success',
    isRead: false,
    createdAt: '2025-02-18T09:15:00Z',
  },
  {
    id: '4',
    title: 'Failed Message Delivery',
    message: 'Some messages in campaign "Newsletter" failed to deliver. Check the campaign details for more information.',
    type: 'error',
    isRead: false,
    createdAt: '2025-02-17T14:20:00Z',
  },
  {
    id: '5',
    title: 'Webhook Configuration Update',
    message: 'Your webhook endpoint configuration has been updated successfully.',
    type: 'info',
    isRead: true,
    createdAt: '2025-02-16T11:45:00Z',
  },
];

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success',
  });

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    setToast({
      show: true,
      message: 'Notification marked as read',
      type: 'success',
    });
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    setToast({
      show: true,
      message: 'All notifications marked as read',
      type: 'success',
    });
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'error':
        return <X className="text-red-500" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-500" size={20} />;
      default:
        return <Info className="text-blue-500" size={20} />;
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('common.notifications')}</h1>
        <p className="text-gray-600 mt-1">View and manage your notifications</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread')}
              className="block w-32 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
            <Filter size={20} className="text-gray-400" />
          </div>
          
          <button
            onClick={markAllAsRead}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Mark all as read
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                !notification.isRead ? 'bg-green-50' : ''
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-4 text-sm text-green-600 hover:text-green-700"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="p-8 text-center">
              <Bell size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications to display</p>
            </div>
          )}
        </div>
      </div>

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
};

export default NotificationsPage;