import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotAuthorized() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="bg-white rounded-2xl shadow-soft border border-sage/10 p-8">
          <div className="mb-6 inline-flex p-3 bg-coral/10 rounded-full">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          
          <h1 className="text-2xl font-bold text-primary-dark mb-4">
            Not Authorized
          </h1>
          
          <p className="text-primary mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>
          
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}