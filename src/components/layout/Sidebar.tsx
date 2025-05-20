import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { 
  Smartphone, 
  Key, 
  FileText, 
  CreditCard, 
  Menu, 
  X,
  Puzzle,
  LayoutDashboard,
  MessageSquare,
  MessageCircle,
  Users,
  Bot,
  Home
} from 'lucide-react';

// Navigation items grouped by section
const navItems = {
  main: [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
    { path: '/dashboard/numbers', icon: <Smartphone size={20} />, label: 'Numbers' },
    { path: '/dashboard/ai-bot', icon: <Bot size={20} />, label: 'AI Bot' },
  ],
  comingSoon: [
    { path: '/dashboard/chats', icon: <MessageCircle size={20} />, label: 'Chats' },
    { path: '/dashboard/campaigns', icon: <Puzzle size={20} />, label: 'Campaigns' },
    { path: '/dashboard/templates', icon: <MessageSquare size={20} />, label: 'Templates' },
  ],
  settings: [
    { path: '/dashboard/api-keys', icon: <Key size={20} />, label: 'API Keys' },
    { path: '/dashboard/documentation', icon: <FileText size={20} />, label: 'Documentation' },
    { path: '/dashboard/billing', icon: <CreditCard size={20} />, label: 'Billing' },
    { path: '/dashboard/users', icon: <Users size={20} />, label: 'Users' },
  ],
};

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <>
      {/* Mobile menu button - only visible on small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-md text-gray-700"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - responsive */}
      <aside 
        className={`
          bg-white shadow-md z-10
          lg:block lg:w-64 lg:relative
          fixed inset-y-0 left-0 w-64 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 text-white p-1 rounded">
              <Smartphone size={24} />
            </div>
            <span className="text-xl font-semibold text-gray-800">Zapwize</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-2">
          {/* Landing Page Link */}
          <div className="mb-6">
            <NavLink
              to="/"
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-gray-700 rounded-lg
                hover:bg-gray-100 transition-colors duration-200
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="mr-3"><Home size={20} /></span>
              <span>Landing Page</span>
            </NavLink>
          </div>

          {/* Main Section */}
          <div className="mb-6">
            <ul className="space-y-1">
              {navItems.main.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-gray-700 rounded-lg
                      hover:bg-gray-100 transition-colors duration-200
                      ${isActive ? 'bg-green-50 text-green-600 font-medium' : ''}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Coming Soon Section */}
          <div className="mb-6">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Coming Soon
            </h3>
            <ul className="space-y-1">
              {navItems.comingSoon.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-gray-700 rounded-lg
                      hover:bg-gray-100 transition-colors duration-200
                      ${isActive ? 'bg-green-50 text-green-600 font-medium' : ''}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Settings Section */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Settings
            </h3>
            <ul className="space-y-1">
              {navItems.settings.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.exact}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-gray-700 rounded-lg
                      hover:bg-gray-100 transition-colors duration-200
                      ${isActive ? 'bg-green-50 text-green-600 font-medium' : ''}
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <p>&copy; 2025 Zapwize</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-0"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;