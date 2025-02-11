import React from 'react';
import { GettingStarted } from './help/GettingStarted';
import { FAQ } from './help/FAQ';

export function Help() {
  return (
    <div className="space-y-6">
      <GettingStarted />
      <FAQ />
    </div>
  );
}