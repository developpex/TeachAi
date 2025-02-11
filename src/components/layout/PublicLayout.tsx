import React from 'react';
import { PublicNavigation } from '../navigation/PublicNavigation';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-cream">
      <PublicNavigation />
      {children}
    </div>
  );
}