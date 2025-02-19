import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Activity,
  Settings,
  MessageSquare,
  Lock,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Personal Information',
    path: '/profile/personal',
    icon: User,
    description: 'Manage your personal details'
  },
  {
    title: 'Account Settings',
    path: '/profile/account',
    icon: Settings,
    description: 'Update account preferences'
  },
  {
    title: 'Security',
    path: '/profile/security',
    icon: Shield,
    description: 'Manage security settings'
  },
  {
    title: 'Subscription',
    path: '/profile/subscription',
    icon: CreditCard,
    description: 'View subscription plan'
  },
  {
    title: 'Activity',
    path: '/profile/activity',
    icon: Activity,
    description: 'View recent activity'
  },
  {
    title: 'Notifications',
    path: '/profile/notifications',
    icon: Bell,
    description: 'Manage notifications'
  },
  {
    title: 'Privacy',
    path: '/profile/privacy',
    icon: Lock,
    description: 'Control privacy settings'
  },
  {
    title: 'Help',
    path: '/profile/help',
    icon: HelpCircle,
    description: 'View guides and FAQs'
  },
  {
    title: 'Support',
    path: '/profile/support',
    icon: MessageSquare,
    description: 'Contact support'
  }
];

export function ProfileNavigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const currentItem = navigationItems.find(item => item.path === location.pathname);

  return (
    <div className="relative w-full">
      {/* Mobile Dropdown */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border"
        >
          <div className="flex items-center space-x-3">
            {currentItem && (
              <>
                <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
                  <currentItem.icon className="h-5 w-5 text-primary dark:text-dark-text" />
                </div>
                <span className="font-medium text-primary-dark dark:text-dark-text">{currentItem.title}</span>
              </>
            )}
          </div>
          {isOpen ? <ChevronUp className="h-5 w-5 dark:text-dark-text" /> : <ChevronDown className="h-5 w-5 dark:text-dark-text" />}
        </button>

        {isOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-40 w-full mt-2 bg-white dark:bg-dark-nav rounded-lg shadow-lg border border-sage/10 dark:border-dark-border py-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 hover:bg-mint/10 dark:hover:bg-dark-surface ${
                    location.pathname === item.path ? 'bg-mint/20 dark:bg-mint/10 text-primary-dark dark:text-dark-text' : 'text-primary dark:text-dark-text-secondary'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-8 w-64 bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-4">
        <h2 className="text-lg font-semibold text-primary-dark dark:text-dark-text px-3 mb-4">Settings</h2>
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-primary dark:text-dark-text-secondary hover:bg-mint/10 dark:hover:bg-dark-surface hover:text-primary-dark dark:hover:text-dark-text'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-primary/60 dark:text-dark-text-secondary/60 group-hover:text-primary-dark dark:group-hover:text-dark-text'}`} />
                <span className="ml-3 text-sm font-medium">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}