import { useState, useEffect, useRef } from 'react';
import { ChatService } from '../services/chat';
import { useAuth } from '../context/AuthContext';
import type { Channel, ChatMessage } from '../types';
import { CATEGORY_ORDER } from '../utils/constants';

export function useChat() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, userProfile } = useAuth();
  const chatService = ChatService.getInstance();

  // Subscribe to channels
  useEffect(() => {
    const unsubscribe = chatService.subscribeToChannels(setChannels);
    return () => unsubscribe();
  }, []);

  // Subscribe to messages for selected channel
  useEffect(() => {
    if (selectedChannel) {
      const unsubscribe = chatService.subscribeToMessages(selectedChannel.id, setMessages);
      return () => unsubscribe();
    }
  }, [selectedChannel]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle mobile sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter and group channels
  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedChannels = CATEGORY_ORDER.reduce((acc, category) => {
    const categoryChannels = filteredChannels.filter(channel => channel.category === category);
    if (categoryChannels.length > 0) {
      acc[category] = categoryChannels.sort((a, b) => a.name.localeCompare(b.name));
    }
    return acc;
  }, {} as Record<string, Channel[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedChannel || !user) return;

    try {
      await chatService.sendMessage(
        selectedChannel.id,
        user.uid,
        message.trim(),
        userProfile?.title || user.email?.split('@')[0] || 'Anonymous',
        user.photoURL || undefined
      );
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return {
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
  };
}