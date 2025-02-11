import React from 'react';
import { ChatSidebar } from '../components/chat/ChatSidebar';
import { ChatContent } from '../components/chat/ChatContent';
import { useChat } from '../hooks/useChat';

export function Chat() {
  const {
    selectedChannel,
    setSelectedChannel,
    channels,
    messages,
    message,
    setMessage,
    searchQuery,
    setSearchQuery,
    isSidebarOpen,
    setIsSidebarOpen,
    handleSubmit,
    handleChannelSelect,
    groupedChannels,
    messagesEndRef
  } = useChat();

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar
        channels={channels}
        selectedChannel={selectedChannel}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onChannelSelect={handleChannelSelect}
        groupedChannels={groupedChannels}
      />

      <ChatContent
        selectedChannel={selectedChannel}
        channels={channels}
        messages={messages}
        message={message}
        setMessage={setMessage}
        onSubmit={handleSubmit}
        messagesEndRef={messagesEndRef}
        onChannelSelect={handleChannelSelect}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
    </div>
  );
}