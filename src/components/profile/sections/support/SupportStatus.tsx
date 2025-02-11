import React from 'react';

export function SupportStatus() {
  return (
    <div className="bg-mint/10 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-primary-dark">Support Status</h4>
          <p className="text-sm text-primary mt-1">
            Average response time: <span className="font-medium">2-4 hours</span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2 w-2 bg-mint rounded-full"></span>
          <span className="text-sm font-medium text-primary">Online</span>
        </div>
      </div>
    </div>
  );
}