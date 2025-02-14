export const CATEGORY_ORDER = ['General', 'Education', 'Students'] as const;

export const ROLE = {
  USER: 'user',
  ADMIN: 'admin',
  OWNER: 'owner',
} as const;

export const PLAN = {
  FREE: 'free',
  PLUS: 'plus',
  ENTERPRISE: 'enterprise'
} as const;

export const TOOL_CATEGORIES = ['all', 'lesson-planning', 'subject-specific', 'student-centered', 'administrative', 'cultural'] as const;

export const PRICING_TIERS = [
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
    price: '9,99',
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
    price: '1000',
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

export const TICKET_CATEGORIES = {
  'technical': 'Technical Issues',
  'billing': 'Billing & Subscription',
  'account': 'Account & Security',
  'feature': 'Feature Requests',
  'bug': 'Bug Reports',
  'other': 'Other'
} as const;

export const TICKET_STATUSES = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'resolved': 'Resolved',
  'cancelled': 'Cancelled',
  'closed': 'Closed'
} as const;