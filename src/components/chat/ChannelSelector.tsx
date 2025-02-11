import React, { useState } from 'react';
import { ChevronDown, Hash } from 'lucide-react';
import type { Channel } from '../../types';

interface ChannelSelectorProps {
  channels: Channel[];
  selectedChannel: Channel;
  onChannelSelect: (channel: Channel) => void;
}

export function ChannelSelector({
  channels,
  selectedChannel,
  onChannelSelect
}: ChannelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-1 hover:bg-sage/10 rounded-lg transition-colors duration-200"
      >
        <ChevronDown className="h-4 w-4 text-primary" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-sage/10 py-2 z-40">
            {channels.map(channel => (
              <button
                key={channel.id}
                onClick={() => {
                  onChannelSelect(channel);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors duration-200 ${
                  channel.id === selectedChannel.id
                    ? 'bg-accent text-white'
                    : 'text-primary hover:bg-sage/10'
                }`}
              >
                <Hash className="h-4 w-4 mr-2" />
                {channel.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}