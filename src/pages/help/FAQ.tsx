import React from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

export function FAQ() {
  const [openQuestion, setOpenQuestion] = React.useState<number | null>(null);

  const faqs = [
    {
      question: 'What is TeachAI?',
      answer: 'TeachAI is an AI-powered teaching assistant platform that helps educators create lesson plans, grade assignments, and manage their classroom more efficiently.'
    },
    {
      question: 'How do I get started?',
      answer: 'Sign up for a free account, complete your profile, and explore our AI tools. You can start with the lesson plan generator or try our grading assistant.'
    },
    {
      question: 'What features are included in the free plan?',
      answer: 'The free plan includes access to basic lesson planning tools, limited vocabulary lists, and basic text writing assistance. Check our pricing page for more details.'
    },
    {
      question: 'How secure is my data?',
      answer: 'We take data security seriously. All data is encrypted, and we follow strict privacy guidelines. Your content and student information are never shared.'
    },
    {
      question: 'Can I upgrade or downgrade my plan?',
      answer: 'Yes, you can change your plan at any time. Go to your profile settings and select "Subscription" to manage your plan.'
    },
    {
      question: 'How do I get support?',
      answer: 'You can contact our support team through the Support page in your dashboard. We typically respond within 24 hours.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-mint/20 rounded-lg">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Frequently Asked Questions</h3>
            <p className="text-sm text-primary">Find answers to common questions about TeachAI</p>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-sage/20 rounded-lg">
              <button
                onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-sage/5 transition-colors duration-300"
              >
                <span className="font-medium text-primary-dark">{faq.question}</span>
                {openQuestion === index ? (
                  <Minus className="h-5 w-5 text-primary flex-shrink-0" />
                ) : (
                  <Plus className="h-5 w-5 text-primary flex-shrink-0" />
                )}
              </button>
              {openQuestion === index && (
                <div className="px-4 pb-4 text-primary">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}