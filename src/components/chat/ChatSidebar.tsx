import React from 'react';
import { Menu, X, Search } from 'lucide-react';
import { ChannelList } from './ChannelList';
import { SearchInput } from './SearchInput';
import type { Channel } from '../../types';

interface ChatSidebarProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onChannelSelect: (channel: Channel) => void;
  groupedChannels: Record<string, Channel[]>;
}

export function ChatSidebar({
  channels,
  selectedChannel,
  searchQuery,
  setSearchQuery,
  isSidebarOpen,
  setIsSidebarOpen,
  onChannelSelect,
  groupedChannels
}: ChatSidebarProps) {
  return (
    <>
      {/* Channels Sidebar */}
      <div className={`
        fixed md:relative w-64 bg-white border-r border-sage/10 flex flex-col z-20
        transform transition-transform duration-300 ease-in-out h-full
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
        />

        <ChannelList
          groupedChannels={groupedChannels}
          selectedChannel={selectedChannel}
          onChannelSelect={onChannelSelect}
        />
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}