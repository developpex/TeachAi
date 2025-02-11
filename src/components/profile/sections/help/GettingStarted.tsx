import React from 'react';
import { Book, Sparkles, Users, PenTool as Tool, MessageSquare } from 'lucide-react';

export function GettingStarted() {
  const steps = [
    {
      icon: Sparkles,
      title: 'Complete Your Profile',
      description: 'Set up your teacher profile with your name, title, and preferences to personalize your experience.'
    },
    {
      icon: Tool,
      title: 'Explore AI Tools',
      description: 'Browse our collection of AI-powered teaching tools. Start with the Lesson Plan Generator to create your first lesson plan.'
    },
    {
      icon: Users,
      title: 'Join the Community',
      description: 'Connect with other teachers in our chat channels to share ideas and get inspiration.'
    },
    {
      icon: MessageSquare,
      title: 'Try Different Tools',
      description: 'Experiment with various tools like the Quiz Generator, Grading Assistant, and Vocabulary Builder.'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2 bg-mint/20 rounded-lg">
          <Book className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark">Getting Started Guide</h3>
          <p className="text-sm text-primary">Follow these steps to get started with TeachAI</p>
        </div>
      </div>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-sage/5 rounded-lg">
            <div className="p-2 bg-mint/10 rounded-lg flex-shrink-0">
              <step.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-primary-dark mb-1">
                {index + 1}. {step.title}
              </h4>
              <p className="text-sm text-primary">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}