import React from 'react';
import { GettingStarted } from './GettingStarted';
import { FAQ } from './FAQ';

export function Help() {
  return (
    <div className="space-y-6">
      {/* Getting Started Guide */}
      <GettingStarted />

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}