import React from 'react';
import { Camera } from 'lucide-react';

interface ProfilePhotoUploadProps {
  photoURL?: string;
  fullName?: string;
  email?: string;
  onUpload: () => void;
}

export function ProfilePhotoUpload({ photoURL, fullName, email, onUpload }: ProfilePhotoUploadProps) {
  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full bg-sage/10 flex items-center justify-center overflow-hidden">
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl text-sage">
            {fullName?.charAt(0) || email?.charAt(0)}
          </span>
        )}
      </div>
      <button 
        className="absolute bottom-0 right-0 p-2 bg-accent text-white rounded-full shadow-soft hover:bg-accent-dark transition-all duration-300"
        onClick={onUpload}
      >
        <Camera size={16} />
      </button>
    </div>
  );
}