import React from 'react';
import { Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FallbackPlan() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-soft p-8 border border-sage/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Current Plan</h3>
            <p className="text-sm text-primary">Manage your subscription plan</p>
          </div>
        </div>
      </div>

      <div className="bg-sage/5 rounded-lg p-6 text-center">
        <p className="text-primary mb-4">Unable to load subscription information</p>
        <button
          onClick={() => navigate('/pricing')}
          className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
        >
          View Plans
        </button>
      </div>
    </div>
  );
}