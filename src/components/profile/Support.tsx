import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Book, ExternalLink, Send } from 'lucide-react';

export function Support() {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle support ticket submission
    console.log('Support ticket submitted:', { category, message });
    setMessage('');
    setCategory('general');
  };

  const helpResources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using our platform',
      icon: Book,
      link: '#'
    },
    {
      title: 'FAQ',
      description: 'Find answers to common questions',
      icon: HelpCircle,
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: ExternalLink,
      link: '#'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Help Resources */}
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-mint/20 rounded-lg">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Help Resources</h3>
            <p className="text-sm text-primary">Find answers and learn how to use our platform</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {helpResources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <a
                key={index}
                href={resource.link}
                className="p-4 rounded-lg border border-sage/20 hover:border-accent transition-colors duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-mint/10 rounded-lg group-hover:bg-mint/20 transition-colors duration-300">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark">{resource.title}</h4>
                    <p className="text-sm text-primary">{resource.description}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-mint/20 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Contact Support</h3>
            <p className="text-sm text-primary">Get help from our support team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
            >
              <option value="general">General Question</option>
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
              placeholder="Describe your issue or question..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-soft"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </button>
          </div>
        </form>
      </div>

      {/* Support Status */}
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
    </div>
  );
}