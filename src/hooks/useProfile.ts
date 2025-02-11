import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export function useProfile() {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    userProfile,
    activeTab,
    setActiveTab,
    isMobile
  };
}