import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { SupportService, SupportTicket } from '../services/support';

export function useMyTickets() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supportService = SupportService.getInstance();

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time updates for user's tickets
    const unsubscribe = supportService.subscribeToUserTickets(user.uid, (updatedTickets) => {
      setTickets(updatedTickets);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [user]);

  return {
    tickets,
    loading,
    setTickets
  };
}