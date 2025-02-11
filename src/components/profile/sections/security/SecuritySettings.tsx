import React from 'react';
import { SecurityAlerts } from './SecurityAlerts';
import { ActiveSessions } from './ActiveSessions';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SecurityAlerts />
      <ActiveSessions />
    </div>
  );
}