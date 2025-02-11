import React, { useState } from 'react';

interface TeacherInfoModalProps {
  isOpen: boolean;
  onSubmit: (fullName: string, title: string) => void;
}

export function TeacherInfoModal({ isOpen, onSubmit }: TeacherInfoModalProps) {
  const [fullName, setFullName] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('Ms.');
  const [titleName, setTitleName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !titleName.trim()) return;
    onSubmit(fullName.trim(), `${titlePrefix} ${titleName.trim()}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 sm:p-8 border border-sage/10">
          <h3 className="text-2xl font-bold text-primary-dark mb-2">Complete Your Profile</h3>
          <p className="text-primary mb-6">Please provide your information to continue</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-primary-dark mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-primary-dark mb-1">
                How do students address you?
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={titlePrefix}
                  onChange={(e) => setTitlePrefix(e.target.value)}
                  className="w-full sm:w-24 px-3 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
                >
                  <option value="Ms.">Ms.</option>
                  <option value="Mr.">Mr.</option>
                </select>
                <input
                  type="text"
                  id="title"
                  value={titleName}
                  onChange={(e) => setTitleName(e.target.value)}
                  required
                  className="w-full flex-1 px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark focus:outline-none focus:ring-accent focus:border-accent"
                  placeholder="e.g., Smith, Johnson"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 shadow-soft"
            >
              Complete Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}