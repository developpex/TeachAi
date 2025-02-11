import React from 'react';

interface NotificationToggleProps {
  checked: boolean;
  onChange: () => void;
}

export function NotificationToggle({ checked, onChange }: NotificationToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-sage/30 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-mint/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
    </label>
  );
}