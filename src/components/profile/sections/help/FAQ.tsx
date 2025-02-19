import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is TeachAI and how does it help teachers?',
      answer: 'TeachAI is an AI-powered platform designed to help teachers streamline their work. It provides tools for lesson planning, grading, creating quizzes, and managing classroom activities. Our AI assists in generating content, providing suggestions, and automating routine tasks.'
    },
    {
      question: 'How accurate and reliable are the AI-generated materials?',
      answer: 'Our AI tools are trained on high-quality educational content and follow established teaching standards. While the AI provides excellent starting points and suggestions, we recommend teachers review and customize the generated content to ensure it meets their specific needs and teaching style.'
    },
    {
      question: 'What\'s the difference between Free and Plus plans?',
      answer: 'The Free plan includes basic tools like the Lesson Plan Generator and simple quiz creation. The Plus plan offers advanced features such as custom vocabulary exercises, unlimited text writing assistance, priority support, and access to all premium tools.'
    },
    {
      question: 'Can I share resources with other teachers?',
      answer: 'Yes! You can share resources and collaborate with other teachers through our community channels. Plus plan users have additional sharing capabilities and can create collaborative workspaces.'
    },
    {
      question: 'How do I customize the AI-generated content?',
      answer: 'All AI-generated content can be edited and customized. Simply use the edit options available in each tool to modify the content, adjust the formatting, or add your own materials to make it perfect for your needs.'
    },
    {
      question: 'Is my data secure and private?',
      answer: 'Yes, we take data security and privacy seriously. We use industry-standard encryption, secure data storage, and strict access controls. We never share your personal data or content with third parties without your explicit consent.'
    },
    {
      question: 'What if I need help using a specific tool?',
      answer: 'Each tool includes built-in guidance and tooltips. You can also access detailed documentation in our Help Center, or contact our support team for assistance. Plus plan users receive priority support.'
    },
    {
      question: 'Can I cancel my subscription at any time?',
      answer: 'Yes, you can cancel your Plus subscription at any time. Your access will continue until the end of your current billing period. There are no cancellation fees or hidden charges.'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
          <HelpCircle className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Frequently Asked Questions</h3>
          <p className="text-sm text-primary dark:text-dark-text-secondary">Find quick answers to common questions</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-sage/20 dark:border-dark-border rounded-lg">
            <button
              className="w-full flex items-center justify-between p-4 text-left hover:bg-sage/5 dark:hover:bg-dark-surface transition-colors duration-200"
              onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
            >
              <span className="font-medium text-primary-dark dark:text-dark-text">{faq.question}</span>
              {openQuestion === index ? (
                <ChevronUp className="h-5 w-5 text-primary dark:text-dark-text flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary dark:text-dark-text flex-shrink-0" />
              )}
            </button>
            {openQuestion === index && (
              <div className="px-4 pb-4 text-primary dark:text-dark-text-secondary">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}