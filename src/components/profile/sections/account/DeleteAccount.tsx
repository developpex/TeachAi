import React from 'react';

export function DeleteAccount() {
  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
      <h3 className="text-xl font-semibold text-primary-dark mb-4">Delete Account</h3>
      <p className="text-primary mb-4">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button className="px-4 py-2 text-sm font-medium text-accent border-2 border-accent rounded-lg hover:bg-accent hover:text-white transition-all duration-300">
        Delete Account
      </button>
    </div>
  );
}