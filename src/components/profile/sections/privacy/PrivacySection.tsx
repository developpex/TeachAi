import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface PrivacySectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function PrivacySection({
  icon: Icon,
  title,
  description,
  children
}: PrivacySectionProps) {
  return (
    <div className="p-4 rounded-lg border border-sage/20">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-mint/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-primary-dark">{title}</p>
          <p className="text-sm text-primary">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}