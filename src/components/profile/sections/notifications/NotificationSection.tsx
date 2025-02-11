import React from 'react';
import { NotificationToggle } from './NotificationToggle';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface NotificationSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

export function NotificationSection({
  icon: Icon,
  title,
  description,
  checked,
  onChange
}: NotificationSectionProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-sage/20">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-mint/10 rounded-lg">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-primary-dark">{title}</p>
          <p className="text-sm text-primary">{description}</p>
        </div>
      </div>
      <NotificationToggle checked={checked} onChange={onChange} />
    </div>
  );
}