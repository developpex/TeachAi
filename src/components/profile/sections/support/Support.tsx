import { MessageSquare } from 'lucide-react';
import { useSupport } from '../../../../hooks/useSupport';
import { SupportForm } from './SupportForm';
import { MyTickets } from './MyTickets';

export function Support() {
  const {
    formData,
    submitting,
    error,
    success,
    handleSubmit,
    handleChange,
    setTickets
  } = useSupport();

  return (
    <div className="space-y-6">
      {/* My Tickets */}
      <MyTickets setTickets={setTickets} />

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

        {error && (
          <div className="mb-6 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-mint/20 border border-mint rounded-lg text-primary">
            Your support ticket has been submitted successfully. We'll get back to you soon.
          </div>
        )}

        <SupportForm
          category={formData.category}
          subject={formData.subject}
          message={formData.message}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCategoryChange={(value) => handleChange('category', value)}
          onSubjectChange={(value) => handleChange('subject', value)}
          onMessageChange={(value) => handleChange('message', value)}
        />
      </div>
    </div>
  );
}