import React from 'react';
import { Send } from 'lucide-react';

interface SupportFormProps {
  subject: string;
  message: string;
  category: string;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export function SupportForm({
  subject,
  message,
  category,
  submitting,
  onSubmit,
  onSubjectChange,
  onMessageChange,
  onCategoryChange
}: SupportFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-primary-dark mb-1">
          Problem Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
          required
          disabled={submitting}
        >
          <option value="">Select a category</option>
          <option value="technical">Technical Issue</option>
          <option value="billing">Billing & Subscription</option>
          <option value="account">Account & Security</option>
          <option value="feature">Feature Request</option>
          <option value="bug">Bug Report</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-primary-dark mb-1">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={subject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent"
          placeholder="Enter subject"
          required
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-primary-dark mb-1">
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent resize-none"
          placeholder="Type your message..."
          required
          disabled={submitting}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
      >
        <Send className="h-4 w-4 mr-2" />
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}