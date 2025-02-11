import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useAccountSettings() {
  const { user, updateUserEmail, updateUserPassword, resendVerificationEmail } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newEmail) {
      setError('Please enter a new email address');
      return;
    }

    try {
      const result = await updateUserEmail(currentPassword, newEmail);
      setMessage(result.message);
      setCurrentPassword('');
      setNewEmail('');
      setShowEmailForm(false);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setError('Please sign in again before changing your email');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else {
        setError(error.message || 'Failed to update email');
      }
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    setError('');
    setMessage('');

    try {
      const result = await updateUserPassword(currentPassword, newPassword);
      setMessage(result.message);
      setShowPasswordForm(false);
    } catch (error: any) {
      if (error.message === 'Current password is incorrect') {
        setError('Current password is incorrect');
      } else if (error.message === 'New password is too weak') {
        setError('New password is too weak. It should be at least 6 characters long');
      } else if (error.message === 'Please sign in again before changing your password') {
        setError('Please sign in again before changing your password');
      } else {
        setError(error.message || 'Failed to update password');
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      setIsResending(true);
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setError('Failed to send verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return {
    email: user?.email || '',
    currentPassword,
    newEmail,
    showEmailForm,
    showPasswordForm,
    error,
    message,
    isResending,
    handleEmailChange,
    handlePasswordChange,
    handleResendVerification,
    setShowEmailForm,
    setShowPasswordForm,
    setCurrentPassword,
    setNewEmail
  };
}