import React from 'react';
import { X, Star } from 'lucide-react';

interface TrialConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function TrialConfirmationModal({ isOpen, onClose, onConfirm }: TrialConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-sage/10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary-dark">Start Free Trial</h3>
            </div>
            <button onClick={onClose} className="text-primary hover:text-primary-dark">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <p className="text-primary mb-4">
              You're about to start your 30-day free trial of TeachAI Plus. You'll get access to:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-primary">
                <Star className="h-4 w-4 text-accent mr-2" />
                Advanced lesson planning tools
              </li>
              <li className="flex items-center text-primary">
                <Star className="h-4 w-4 text-accent mr-2" />
                Custom vocabulary exercises
              </li>
              <li className="flex items-center text-primary">
                <Star className="h-4 w-4 text-accent mr-2" />
                Unlimited text writing assistance
              </li>
              <li className="flex items-center text-primary">
                <Star className="h-4 w-4 text-accent mr-2" />
                Priority support
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={onConfirm}
              className="w-full px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
            >
              Start My Free Trial
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-sage/30 text-primary rounded-lg hover:bg-sage/5 transition-all duration-300"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}