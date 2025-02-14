import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingCard } from '../components/pricing/PricingCard.tsx';
import { PublicNavigation } from '../components/navigation/PublicNavigation.tsx';
import { ContactSalesModal } from '../components/pricing/ContactSalesModal.tsx';
import {PLAN, PRICING_TIERS} from '../utils/constants.ts'
import type { PricingTier } from '../types';

export function Pricing() {
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const pricingTiers: PricingTier[] = PRICING_TIERS;

  const handlePricingAction = (tier: PricingTier) => {
    switch (tier.name.toLowerCase()) {
      case PLAN.FREE:
        navigate('/signup');
        break;
      case PLAN.PLUS:
        navigate('/signup-trial');
        break;
      case PLAN.ENTERPRISE:
        setShowContactModal(true);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavigation />
      
      {/* Added pt-16 to account for fixed navigation height */}
      <div className="flex-1 flex flex-col justify-center py-8 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-primary-dark">Simple, transparent pricing</h2>
            <p className="mt-4 text-xl text-primary">
              Choose the perfect plan for your teaching needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <PricingCard 
                key={index} 
                tier={{
                  ...tier,
                  period: 'month'
                }}
                onAction={handlePricingAction}
              />
            ))}
          </div>
        </div>
      </div>

      <ContactSalesModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}