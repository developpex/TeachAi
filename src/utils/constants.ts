export const CATEGORY_ORDER = ['General', 'Education', 'Students'];

const TOOL_CATEGORIES = {
  'lesson-planning': 'Lesson Planning & Design',
  'subject-specific': 'Subject-Specific Tools',
  'student-centered': 'Student-Centered Tools',
  'administrative': 'Administrative & Support',
  'cultural': 'Cultural & Inclusive Education'
} as const;

const PRICING_TIERS = [
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
    description: 'Unlock advanced features for individual teachers',
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
] as const;