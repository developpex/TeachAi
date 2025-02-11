import React from 'react';
import { Navigation } from '../navigation/Navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  isNavOpen: boolean;
}

export function MainLayout({ children, isNavOpen }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation onToggle={() => {}} />
      <main className={`flex-1 transition-all duration-300 ${isNavOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        {children}
      </main>
    </div>
  );
}