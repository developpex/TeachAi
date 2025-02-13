import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const getIconComponent = (iconName: string): LucideIcon | null => {
  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in Lucide icons`);
    // Return a default icon
    return LucideIcons.HelpCircle;
  }

  return IconComponent;
};

// Add type safety for icon names
export type LucideIconName = keyof typeof LucideIcons;

// Validate if an icon name exists
export const isValidIconName = (name: string): name is LucideIconName => {
  return name in LucideIcons;
};