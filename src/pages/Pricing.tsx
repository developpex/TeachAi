import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingCard } from '../components/PricingCard';
import { PublicNavigation } from '../components/PublicNavigation';
import { ContactSalesModal } from '../components/ContactSalesModal';
import { useAuth } from '../context/AuthContext';
import type { PricingTier } from '../types';

export function Pricing() {
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const pricingTiers: PricingTier[] = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for trying out our basic AI tools',
      features: [
        'Access to Lesson Plan Generator',
        'Basic vocabulary lists',
        'Limited text writing assistance',
        'Email support'
      ],
      buttonText: 'Get Started'
    },
    {
      name: 'Plus',
      price: '29',
      description: 'Unlock all features for individual teachers',
      features: [
        'All Free features',
        'Advanced lesson planning',
        'Custom vocabulary exercises',
        'Unlimited text writing',
        'Priority support'
      ],
      buttonText: 'Start Free Trial',
      recommended: true
    },
    {
      name: 'Enterprise',
      price: '99',
      description: 'Complete solution for schools and institutions',
      features: [
        'All Plus features',
        'School-wide deployment',
        'Admin dashboard',
        'Custom integrations',
        'Training sessions',
        '24/7 dedicated support'
      ],
      buttonText: 'Contact Sales'
    }
  ];

  const handlePricingAction = (tier: PricingTier) => {
    switch (tier.name.toLowerCase()) {
      case 'free':
        navigate('/signup');
        break;
      case 'plus':
        navigate('/signup-trial');
        break;
      case 'enterprise':
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