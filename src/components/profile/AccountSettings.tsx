import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Bell, AlertTriangle } from 'lucide-react';

export function AccountSettings() {
  const { user, updateUserEmail, updateUserPassword, resendVerificationEmail } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  
  // Password change states
  const [currentPasswordForChange, setCurrentPasswordForChange] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    try {
      const result = await updateUserPassword(currentPasswordForChange, newPassword);
      setMessage(result.message);
      setCurrentPasswordForChange('');
      setNewPassword('');
      setConfirmNewPassword('');
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <h2 className="text-2xl font-semibold text-primary-dark mb-6">Account Settings</h2>
        
        {(message || error) && (
          <div className={`p-4 rounded-lg mb-6 flex items-start space-x-3 ${
            message ? 'bg-mint/20 text-primary' : 'bg-coral/20 text-accent-dark'
          }`}>
            {error && <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />}
            <span>{message || error}</span>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sage/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-mint/20 rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-primary-dark">Email Address</h3>
                <p className="text-sm text-primary">{user?.email}</p>
                {!user?.emailVerified && (
                  <p className="text-sm text-accent mt-1">
                    Email not verified
                    <button
                      onClick={handleResendVerification}
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
            <form onSubmit={handleEmailChange} className="space-y-4 pt-4">
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
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-sage/30 rounded-lg focus:border-accent focus:ring-accent"
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
                    setError('');
                    setMessage('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark"
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

          <div className="flex items-center justify-between pb-4 border-b border-sage/20">
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
            <form onSubmit={handlePasswordChange} className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPasswordForChange}
                  onChange={(e) => setCurrentPasswordForChange(e.target.value)}
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
                    setCurrentPasswordForChange('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setError('');
                    setMessage('');
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
      </div>

      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <h3 className="text-xl font-semibold text-primary-dark mb-4">Delete Account</h3>
        <p className="text-primary mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-4 py-2 text-sm font-medium text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300">
          Delete Account
        </button>
      </div>
    </div>
  );
}