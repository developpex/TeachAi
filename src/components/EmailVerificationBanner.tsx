import { useState } from 'react';
import { AlertTriangle, X, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function EmailVerificationBanner() {
  const { user, resendVerificationEmail } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!user || user.emailVerified || !isVisible) return null;

  const handleResend = async () => {
    try {
      setIsResending(true);
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send verification email. Please try again later.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border border-sage/10 p-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h3 className="text-sm font-medium text-primary-dark">Email Verification Required</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-primary hover:text-primary-dark"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-sm text-primary">
            Please verify your email address to access all features.
          </p>
          {message && (
            <p className="mt-2 text-sm text-accent">
              {message}
            </p>
          )}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="mt-3 inline-flex items-center text-sm text-accent hover:text-accent-dark disabled:opacity-50"
          >
            <Mail className="h-4 w-4 mr-1" />
            {isResending ? 'Sending...' : 'Resend verification email'}
          </button>
        </div>
      </div>
    </div>
  );
}