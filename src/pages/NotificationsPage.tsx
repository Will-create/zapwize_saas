import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Check, X, Filter, CheckCircle, AlertCircle, Info } from 'lucide-react';
import Toast from '../components/ui/Toast';
import { notificationsService } from '../services/api';
import { useAlertStore } from '../store/alertStore';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  isRead: boolean;
  createdAt: string;
};

const NotificationsPage = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { show: showAlert } = useAlertStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const fetchedNotifications = await notificationsService.fetchNotifications(filter);
      setNotifications(fetchedNotifications);
    } catch (error) {
      showAlert('Failed to fetch notifications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      showAlert('Notification marked as read', 'success');
    } catch (error) {
      showAlert('Failed to mark notification as read', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      showAlert('All notifications marked as read', 'success');
    } catch (error) {
      showAlert('Failed to mark all notifications as read', 'error');
    }
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

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
          {notifications.map((notification) => (
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

          {notifications.length === 0 && (
            <div className="p-8 text-center">
              <Bell size={40} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No notifications to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;