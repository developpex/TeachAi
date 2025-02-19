import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Wrench,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  BookOpen,
  UserCircle,
  Shield,
  Building,
  TicketCheck,
  Settings,
  Moon,
  Sun,
  History
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import { useTheme } from '../../context/ThemeContext';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  current: boolean;
  isOpen: boolean;
  isMobile: boolean;
  onClick: () => void;
}

function NavLink({ to, children, current, isOpen, isMobile, onClick }: NavLinkProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`relative flex items-center ${isOpen ? 'justify-start space-x-3' : 'justify-center'} p-3 rounded-lg transition-all duration-300 group ${
        current
          ? 'bg-accent text-white dark:bg-accent shadow-soft dark:shadow-dark-soft'
          : 'text-cream dark:text-dark-text hover:bg-mint/20 dark:hover:bg-dark-surface'
      }`}
    >
      {React.Children.map(children, (child, index) => {
        if (index === 0) return child;
        return isOpen || isMobile ? (
          child
        ) : (
          <span className="absolute left-full ml-2 px-2 py-1 bg-accent dark:bg-accent text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-[9999]">
            {child}
          </span>
        );
      })}
    </Link>
  );
}

interface NavigationProps {
  onToggle: (isOpen: boolean) => void;
}

export function Navigation({ onToggle }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const path = location.pathname === '/' ? '/dashboard' : location.pathname;
  const { user, logout } = useAuth();
  const { isOwner, isAdmin } = useAdmin();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const navigationItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      description: 'View your dashboard'
    },
    {
      title: 'Tools',
      path: '/tools',
      icon: Wrench,
      description: 'Access AI tools'
    },
    {
      title: 'History',
      path: '/history',
      icon: History,
      description: 'View saved responses'
    },
    {
      title: 'Chat',
      path: '/chat',
      icon: MessageSquare,
      description: 'Chat with others'
    },
    {
      title: 'Profile',
      path: '/profile',
      icon: UserCircle,
      description: 'Manage your profile'
    },
    ...(isOwner ? [
      {
        title: 'Admin',
        path: '/admin',
        icon: Shield,
        description: 'Global administration'
      },
      {
        title: 'Manage Tools',
        path: '/manage-tools',
        icon: Settings,
        description: 'Manage AI tools'
      },
      {
        title: 'Tickets',
        path: '/tickets',
        icon: TicketCheck,
        description: 'Manage support tickets'
      }
    ] : []),
    ...(isAdmin && !isOwner ? [
      {
        title: 'School Admin',
        path: '/school-admin',
        icon: Building,
        description: 'School administration'
      }
    ] : [])
  ];

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    onToggle(isOpen);
  }, [isOpen, onToggle]);

  const handleLogout = async () => {
    try {
      await logout();
      if (isMobile) setIsOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNavClick = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 bg-mint dark:bg-dark-nav rounded-full p-2 text-primary-dark dark:text-dark-text hover:bg-sky hover:text-primary transition-all duration-300 shadow-soft dark:shadow-dark-soft"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${isMobile ? 'w-full md:w-64' : isOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-primary-dark to-primary dark:from-dark-nav dark:to-dark-nav transition-all duration-300 z-40 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center justify-center">
            <div className="bg-accent dark:bg-accent p-2.5 rounded-lg shadow-soft dark:shadow-dark-soft flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className={`ml-3 text-xl font-bold text-cream dark:text-dark-text transition-opacity duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 hidden'
            }`}>
              TeachAI
            </span>
          </div>

          {/* Desktop Toggle Button */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mt-4 w-full flex items-center justify-center p-2 bg-mint/20 dark:bg-dark-surface rounded-lg text-cream dark:text-dark-text hover:bg-mint/30 dark:hover:bg-dark-surface/80 transition-all duration-300"
            >
              {isOpen ? (
                <div className="flex items-center">
                  <ChevronLeft size={20} className="mr-2" />
                  <span className="text-sm">Collapse Menu</span>
                </div>
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          )}
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 px-4 flex flex-col justify-start space-y-2 mt-4">
          {navigationItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              current={path === item.path}
              isOpen={isOpen}
              isMobile={isMobile}
              onClick={handleNavClick}
            >
              <item.icon size={24} />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* Theme Toggle and Logout */}
        <div className="p-4 space-y-2">
          <button
            onClick={toggleDarkMode}
            className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-cream dark:text-dark-text bg-mint/20 dark:bg-dark-surface hover:bg-mint/30 dark:hover:bg-dark-surface/80 transition-all duration-300 shadow-soft dark:shadow-dark-soft ${
              !isOpen && !isMobile ? 'px-0' : ''
            }`}
          >
            {isDarkMode ? (
              <Sun className={`h-5 w-5 ${isOpen || isMobile ? 'mr-2' : ''}`} />
            ) : (
              <Moon className={`h-5 w-5 ${isOpen || isMobile ? 'mr-2' : ''}`} />
            )}
            {(isOpen || isMobile) && (
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          <button
            onClick={handleLogout}
            className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg text-white bg-accent dark:bg-accent hover:bg-accent-dark dark:hover:bg-accent transition-all duration-300 shadow-soft dark:shadow-dark-soft ${
              !isOpen && !isMobile ? 'px-0' : ''
            }`}
          >
            <LogOut className={`h-5 w-5 ${isOpen || isMobile ? 'mr-2' : ''}`} />
            {(isOpen || isMobile) && <span>Log Out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}