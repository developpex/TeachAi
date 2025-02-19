import { useAccountSettings } from '../../../../hooks/useAccountSettings';
import { EmailForm } from './EmailForm';
import { PasswordForm } from './PasswordForm';
import { DeleteAccount } from './DeleteAccount';

export function AccountSettings() {
  const {
    email,
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
  } = useAccountSettings();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
        <h2 className="text-2xl font-semibold text-primary-dark dark:text-dark-text mb-6">Account Settings</h2>
        
        {(message || error) && (
          <div className={`p-4 rounded-lg mb-6 flex items-start space-x-3 ${
            message ? 'bg-mint/20 text-primary dark:text-dark-text' : 'bg-coral/20 text-accent-dark'
          }`}>
            <span>{message || error}</span>
          </div>
        )}
        
        <div className="space-y-6">
          <EmailForm
            email={email}
            currentPassword={currentPassword}
            newEmail={newEmail}
            showEmailForm={showEmailForm}
            isResending={isResending}
            onEmailChange={handleEmailChange}
            onResendVerification={handleResendVerification}
            setShowEmailForm={setShowEmailForm}
            setCurrentPassword={setCurrentPassword}
            setNewEmail={setNewEmail}
          />

          <PasswordForm
            showPasswordForm={showPasswordForm}
            onPasswordChange={handlePasswordChange}
            setShowPasswordForm={setShowPasswordForm}
          />
        </div>
      </div>

      <DeleteAccount />
    </div>
  );
}