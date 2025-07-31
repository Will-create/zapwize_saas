import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { notificationsService } from '../../services/api';

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await notificationsService.fetchNotifications('unread');
      setNotifications(fetchedNotifications.slice(0, 5)); // Show only the latest 5 unread notifications
      setUnreadCount(fetchedNotifications.length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <Link
          to="/"
          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 mr-2"
          title="Go to Homepage"
        >
          <Home size={20} />
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
              <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                <Link
                  to="/dashboard/notifications"
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setIsNotificationsOpen(false)}
                >
                  View All
                </Link>
              </div>
              {notifications.map((notification) => (
                <div key={notification.id} className="px-4 py-2 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            className="flex items-center space-x-2 focus:outline-none"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <User size={16} />
              </div>
            )}
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.name || 'User'}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Link
                to="/dashboard/profile"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsProfileOpen(false)}
              >
                <User size={16} className="mr-2" />
                <span>Profile</span>
              </Link>
              <Link
                to="/dashboard/settings"
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsProfileOpen(false)}
              >
                <Settings size={16} className="mr-2" />
                <span>Settings</span>
              </Link>
              <button
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;