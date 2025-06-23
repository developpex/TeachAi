import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { SupportService } from '../services/support';

interface SupportForm {
  category: string;
  subject: string;
  message: string;
}

export function useSupport() {
  const [formData, setFormData] = useState<SupportForm>({
    category: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const { user, userProfile } = useAuth();
  const supportService = SupportService.getInstance();

  const validateForm = (): string | null => {
    if (!formData.category) {
      return 'Please select a category';
    }
    if (!formData.subject.trim()) {
      return 'Please enter a subject';
    }
    if (!formData.message.trim()) {
      return 'Please enter a message';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) {
      setError('You must be logged in to submit a ticket');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const ticketData = {
        userId: user.uid,
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        email: user.email || '',
        username: userProfile.fullName || user.email?.split('@')[0] || 'Anonymous',
        createdAt: new Date().toISOString(), // Ensure correct timestamp format
        updatedAt: new Date().toISOString(),
      };

      console.log("Submitting ticket:", ticketData);

      const ticketId = await supportService.createTicket(ticketData);

      console.log("Ticket created with ID:", ticketId);

      const newTicket = await supportService.getTicketById(ticketId);
      if (newTicket) {
        setTickets(prevTickets => [newTicket, ...prevTickets]);
      }

      setFormData({ category: '', subject: '', message: '' });
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting ticket:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit support ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof SupportForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
    setSuccess(false);
  };

  return {
    formData,
    submitting,
    error,
    success,
    handleSubmit,
    handleChange,
    tickets,
    setTickets
  };
}