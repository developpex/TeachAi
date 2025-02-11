import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordFormProps {
  showPasswordForm: boolean;
  onPasswordChange: (currentPassword: string, newPassword: string) => void;
  setShowPasswordForm: (show: boolean) => void;
}

export function PasswordForm({
  showPasswordForm,
  onPasswordChange,
  setShowPasswordForm
}: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    onPasswordChange(currentPassword, newPassword);
  };

  return (
    <div className="flex flex-col pb-4 border-b border-sage/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-mint/20 rounded-lg">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary-dark">Password</h3>
            <p className="text-sm text-primary">Change your password</p>
          </div>
        </div>
        <button 
          className="text-sm text-accent hover:text-accent-dark"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          Change Password
        </button>
      </div>

      {showPasswordForm && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <div className="p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary-dark mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                setShowPasswordForm(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setError('');
              }}
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-dark transition-all duration-300"
            >
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
}