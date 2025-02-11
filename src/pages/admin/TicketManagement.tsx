import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import { SupportService, SupportTicket } from '../../services/support';
import { TicketList } from '../../components/admin/tickets/TicketList';
import { TicketModal } from '../../components/shared/TicketModal';

export const TICKET_CATEGORIES = {
  'technical': 'Technical Issues',
  'billing': 'Billing & Subscription',
  'account': 'Account & Security',
  'feature': 'Feature Requests',
  'bug': 'Bug Reports',
  'other': 'Other'
} as const;

export const TICKET_STATUSES = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'resolved': 'Resolved',
  'cancelled': 'Cancelled',
  'closed': 'Closed'
} as const;

export function TicketManagement() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof TICKET_CATEGORIES | 'all'>('all');
  const [draggedTicket, setDraggedTicket] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isOwner, loading: authLoading } = useAdmin();
  const navigate = useNavigate();
  const supportService = SupportService.getInstance();

  useEffect(() => {
    if (!authLoading && !isOwner) {
      navigate('/not-authorized');
    }
  }, [isOwner, authLoading, navigate]);

  useEffect(() => {
    if (!isOwner) return;

    setLoading(true);
    
    // Subscribe to real-time updates for all tickets
    const unsubscribe = supportService.subscribeToAllTickets((updatedTickets) => {
      setTickets(updatedTickets);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [isOwner]);

  const handleStatusChange = async (ticketId: string, newStatus: SupportTicket['status']) => {
    try {
      setError(null);
      await supportService.updateTicketStatus(ticketId, newStatus);
      
      // Update tickets state
      const updatedTickets = tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      );
      setTickets(updatedTickets);
      
      // Update selected ticket if it's the one being modified
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError('Failed to update ticket status. Please try again.');
    }
  };

  const handleReply = async (ticketId: string, message: string) => {
    if (!message.trim()) return;

    try {
      setError(null);
      await supportService.addTicketReply(ticketId, message);
      setReply('');
      
      // Refresh the ticket to show the new reply
      const updatedTicket = await supportService.getTicketById(ticketId);
      if (updatedTicket) {
        setTickets(prev => prev.map(ticket => 
          ticket.id === ticketId ? updatedTicket : ticket
        ));
        setSelectedTicket(updatedTicket);
      }
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to send reply. Please try again.');
    }
  };

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    setDraggedTicket(ticketId);
    e.dataTransfer.setData('text/plain', ticketId);
  };

  const handleDragEnd = () => {
    setDraggedTicket(null);
  };

  const handleDragOver = (e: React.DragEvent, ticketId?: string) => {
    e.preventDefault();
    
    if (ticketId && ticketId !== draggedTicket) {
      const element = e.currentTarget as HTMLElement;
      element.style.borderBottom = '2px solid #FF7D00';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const element = e.currentTarget as HTMLElement;
    element.style.borderBottom = '';
  };

  const handleDrop = async (e: React.DragEvent, newStatus: SupportTicket['status']) => {
    e.preventDefault();
    e.currentTarget.style.borderBottom = '';
    
    const ticketId = e.dataTransfer.getData('text/plain');
    if (!ticketId || !draggedTicket) return;

    try {
      setError(null);
      await handleStatusChange(ticketId, newStatus);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setError('Failed to move ticket. Please try again.');
    }
  };

  const handleTicketClick = async (ticket: SupportTicket) => {
    if (ticket.unreadBySupport) {
      try {
        await supportService.markTicketReadBySupport(ticket.id);
        // Update tickets state to remove unread indicator
        setTickets(prev => prev.map(t => 
          t.id === ticket.id ? { ...t, unreadBySupport: false } : t
        ));
      } catch (error) {
        console.error('Error marking ticket as read:', error);
      }
    }
    setSelectedTicket(ticket);
  };

  const filteredTickets = tickets.filter(ticket => 
    (selectedCategory === 'all' || ticket.category === selectedCategory) &&
    (searchQuery === '' || 
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const groupedByStatus = Object.keys(TICKET_STATUSES).reduce((acc, status) => {
    acc[status] = filteredTickets.filter(ticket => ticket.status === status);
    return acc;
  }, {} as Record<string, SupportTicket[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-dark">Support Tickets</h1>
            <p className="mt-2 text-primary">Manage support tickets from all users</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/60" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border-2 border-sage/30 rounded-lg text-sm placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as keyof typeof TICKET_CATEGORIES | 'all')}
                className="px-3 py-2 border border-sage/30 rounded-lg text-sm focus:border-accent focus:ring-accent"
              >
                <option value="all">All Categories</option>
                {Object.entries(TICKET_CATEGORIES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
            {error}
          </div>
        )}

        <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-12rem)]">
          {Object.entries(TICKET_STATUSES).map(([status, label]) => (
            <TicketList
              key={status}
              tickets={groupedByStatus[status] || []}
              status={status}
              statusLabel={label}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onTicketDragStart={handleDragStart}
              onTicketDragEnd={handleDragEnd}
              onTicketDragOver={handleDragOver}
              onTicketDragLeave={handleDragLeave}
              onTicketClick={handleTicketClick}
              getCategoryColor={getCategoryColor}
              TICKET_CATEGORIES={TICKET_CATEGORIES}
            />
          ))}
        </div>

        {selectedTicket && (
          <TicketModal
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
            onStatusChange={handleStatusChange}
            onReply={handleReply}
            reply={reply}
            setReply={setReply}
            sending={false}
            isAdmin={true}
            TICKET_CATEGORIES={TICKET_CATEGORIES}
            TICKET_STATUSES={TICKET_STATUSES}
          />
        )}
      </div>
    </div>
  );
}

function getCategoryColor(category: string) {
  switch (category) {
    case 'technical':
      return 'bg-sky/20 text-primary-dark';
    case 'billing':
      return 'bg-accent/20 text-accent-dark';
    case 'account':
      return 'bg-mint/20 text-primary';
    case 'feature':
      return 'bg-coral/20 text-accent';
    case 'bug':
      return 'bg-sage/20 text-primary-dark';
    default:
      return 'bg-sage/10 text-primary';
  }
}