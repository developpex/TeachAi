import React from 'react';
import { Mail } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

interface EmailFormProps {
  email: string;
  currentPassword: string;
  newEmail: string;
  showEmailForm: boolean;
  isResending: boolean;
  onEmailChange: (e: React.FormEvent) => void;
  onResendVerification: () => void;
  setShowEmailForm: (show: boolean) => void;
  setCurrentPassword: (password: string) => void;
  setNewEmail: (email: string) => void;
}

export function EmailForm({
  email,
  currentPassword,
  newEmail,
  showEmailForm,
  isResending,
  onEmailChange,
  onResendVerification,
  setShowEmailForm,
  setCurrentPassword,
  setNewEmail
}: EmailFormProps) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col pb-4 border-b border-sage/20 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary-dark dark:text-dark-text">Email Address</h3>
            <p className="text-sm text-primary dark:text-dark-text-secondary">{email}</p>
            {!user?.emailVerified && (
              <p className="text-sm text-accent mt-1">
                Email not verified
                <button
                  onClick={onResendVerification}
                  disabled={isResending}
                  className="ml-2 text-accent hover:text-accent-dark disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend verification email'}
                </button>
              </p>
            )}
          </div>
        </div>
        <button 
          className="text-sm text-accent hover:text-accent-dark"
          onClick={() => setShowEmailForm(!showEmailForm)}
        >
          Change Email
        </button>
      </div>

      {showEmailForm && (
        <form onSubmit={onEmailChange} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:border-accent focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark dark:text-dark-text mb-1">
              New Email Address
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:border-accent focus:ring-accent"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowEmailForm(false);
                setCurrentPassword('');
                setNewEmail('');
              }}
              className="px-4 py-2 text-sm font-medium text-primary dark:text-dark-text hover:text-primary-dark dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-all duration-300"
            >
              Update Email
            </button>
          </div>
        </form>
      )}
    </div>
  );
}