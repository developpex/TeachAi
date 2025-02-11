import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface ContactSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactSalesModal({ isOpen, onClose }: ContactSalesModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact Sales Form Submitted:', { subject, message });
    setSubject('');
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 border border-sage/10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-primary-dark">Contact Sales</h3>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-primary-dark mb-1">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent"
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-primary-dark mb-1">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent resize-none"
                placeholder="Type your message..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}