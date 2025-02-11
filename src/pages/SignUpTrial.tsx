import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';
import { PublicNavigation } from '../components/PublicNavigation';

export function SignUpTrial() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUpWithEmail, signInWithGoogle, saveUserProfile } = useAuth();
  const navigate = useNavigate();

  const getErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      default:
        return `Error: ${error.message}`;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }

    try {
      const user = await signUpWithEmail(email, password);
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate);
      trialEndDate.setDate(trialStartDate.getDate() + 30); // 30-day trial

      await saveUserProfile(user.uid, {
        fullName: user.email?.split('@')[0] || 'User',
        title: 'Teacher',
        plan: 'plus',
        isTrialActive: true,
        trialStartDate,
        trialEndDate,
        startDate: new Date(),
        isProfileComplete: true
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getErrorMessage(err));
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithGoogle();
      const trialStartDate = new Date();
      const trialEndDate = new Date(trialStartDate);
      trialEndDate.setDate(trialStartDate.getDate() + 30); // 30-day trial

      await saveUserProfile(result.user.uid, {
        fullName: result.user.displayName || result.user.email?.split('@')[0] || 'User',
        title: 'Teacher',
        plan: 'plus',
        isTrialActive: true,
        trialStartDate,
        trialEndDate,
        startDate: new Date(),
        isProfileComplete: true
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to sign up with Google.');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <PublicNavigation />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-2xl shadow-soft p-8 border border-sage/10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-primary-dark mb-2">
                Start Your 30-Day Free Trial
              </h2>
              <p className="text-primary">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-accent hover:text-accent-dark">
                  Sign in here
                </Link>
              </p>
            </div>
            
            {error && (
              <div className="mt-6 bg-coral/20 border border-accent text-accent-dark px-4 py-3 rounded-lg" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="email-address" className="block text-sm font-medium text-primary-dark mb-1">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-primary-dark mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-primary-dark mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-accent hover:bg-accent-dark transition-all duration-300 shadow-soft"
                >
                  Start Free Trial
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-sage/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-primary">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center space-x-3 py-3 px-4 border-2 border-accent rounded-lg shadow-soft bg-white text-sm font-medium text-accent hover:bg-accent hover:text-white transition-all duration-300"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="currentColor"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}