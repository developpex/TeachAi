import React from 'react';
import { Check } from 'lucide-react';
import type { PricingTier } from '../types';
import { useNavigate } from 'react-router-dom';

interface PricingCardProps {
  tier: PricingTier;
  onAction: (tier: PricingTier) => void;
}

export function PricingCard({ tier, onAction }: PricingCardProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    onAction(tier);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-soft p-6 border border-sand relative flex flex-col h-full ${
      tier.recommended ? 'ring-2 ring-accent transform scale-105' : ''
    }`}>
      {tier.recommended && (
        <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-soft">
          Recommended
        </span>
      )}
      
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-primary-dark">{tier.name}</h3>
        <p className="mt-2 text-primary text-sm">{tier.description}</p>
        
        <p className="mt-6">
          <span className="text-4xl font-bold text-primary-dark">${tier.price}</span>
          {tier.price !== '0' && <span className="text-primary">/month</span>}
        </p>
        
        <ul className="mt-6 space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-accent flex-shrink-0" />
              <span className="ml-3 text-primary text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button 
        onClick={handleAction}
        className={`mt-6 w-full px-4 py-3 rounded-lg transition-all duration-300 ${
          tier.recommended
            ? 'bg-accent text-white hover:bg-accent-dark shadow-soft'
            : 'border-2 border-accent text-accent hover:bg-accent hover:text-white'
        }`}
      >
        {tier.buttonText}
      </button>
    </div>
  );
}