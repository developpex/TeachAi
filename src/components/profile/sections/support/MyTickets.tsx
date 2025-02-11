import React, { useState } from 'react';
import { MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useMyTickets } from '../../../../hooks/useMyTickets';
import { SupportService } from '../../../../services/support';
import { TicketModal } from '../../../shared/TicketModal';

const TICKET_CATEGORIES = {
  'technical': 'Technical Issues',
  'billing': 'Billing & Subscription',
  'account': 'Account & Security',
  'feature': 'Feature Requests',
  'bug': 'Bug Reports',
  'other': 'Other'
} as const;

const TICKET_STATUSES = {
  'open': 'Open',
  'in_progress': 'In Progress',
  'resolved': 'Resolved',
  'cancelled': 'Cancelled',
  'closed': 'Closed'
} as const;

interface MyTicketsProps {
  setTickets: (tickets: any[]) => void;
}

export function MyTickets({ setTickets }: MyTicketsProps) {
  const { tickets, loading, error, hasMore, loadMore } = useMyTickets();
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [showClosedTickets, setShowClosedTickets] = useState(false);
  const supportService = SupportService.getInstance();

  // Filter tickets based on status
  const activeTickets = tickets.filter(ticket => 
    !['closed', 'cancelled'].includes(ticket.status)
  );
  
  const closedTickets = tickets.filter(ticket => 
    ['closed', 'cancelled'].includes(ticket.status)
  );

  const handleReply = async (ticketId: string, message: string) => {
    if (!message.trim()) return;

    try {
      setSending(true);
      await supportService.addUserReply(ticketId, message);
      setReply('');
      // Refresh tickets to show new reply
      window.location.reload();
    } catch (err) {
      console.error('Error sending reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await supportService.updateTicketStatus(ticketId, newStatus);
      // Close the modal after status change
      setSelectedTicket(null);
      // Update tickets list
      const updatedTickets = tickets.map(ticket => 
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      );
      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleTicketClick = async (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;

    if (ticket.unreadByUser) {
      try {
        await supportService.markTicketReadByUser(ticketId);
        // Update tickets state to remove unread indicator
        const updatedTickets = tickets.map(t => 
          t.id === ticketId ? { ...t, unreadByUser: false } : t
        );
        setTickets(updatedTickets);
      } catch (error) {
        console.error('Error marking ticket as read:', error);
      }
    }
    setSelectedTicket(ticketId);
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-sage/10 rounded w-1/4"></div>
          <div className="h-4 bg-sage/10 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-20 bg-sage/10 rounded"></div>
            <div className="h-20 bg-sage/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-soft border border-sage/10 p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-mint/20 rounded-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark">My Tickets</h3>
          <p className="text-sm text-primary">View your support ticket history</p>
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-coral/20 border border-accent rounded-lg text-accent-dark">
          {error}
        </div>
      )}

      {/* Active Tickets */}
      <div className="space-y-4">
        {activeTickets.length === 0 ? (
          <div className="text-center py-8 text-primary">
            No active tickets found
          </div>
        ) : (
          activeTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => handleTicketClick(ticket.id)}
              TICKET_CATEGORIES={TICKET_CATEGORIES}
            />
          ))
        )}
      </div>

      {/* Closed Tickets Section */}
      {closedTickets.length > 0 && (
        <div className="mt-8 border-t border-sage/10 pt-6">
          <button
            onClick={() => setShowClosedTickets(!showClosedTickets)}
            className="flex items-center space-x-2 text-primary hover:text-primary-dark"
          >
            {showClosedTickets ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span>
              {showClosedTickets ? 'Hide' : 'Show'} Closed Tickets ({closedTickets.length})
            </span>
          </button>

          {showClosedTickets && (
            <div className="mt-4 space-y-4">
              {closedTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onClick={() => handleTicketClick(ticket.id)}
                  TICKET_CATEGORIES={TICKET_CATEGORIES}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2 text-accent hover:text-accent-dark disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More Tickets'}
          </button>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedTicket && (
        <TicketModal
          ticket={tickets.find(t => t.id === selectedTicket)}
          onClose={() => setSelectedTicket(null)}
          onReply={handleReply}
          onStatusChange={handleStatusChange}
          reply={reply}
          setReply={setReply}
          sending={sending}
          TICKET_CATEGORIES={TICKET_CATEGORIES}
          TICKET_STATUSES={TICKET_STATUSES}
        />
      )}
    </div>
  );
}

// Helper component for ticket cards
function TicketCard({ ticket, onClick, TICKET_CATEGORIES }: { 
  ticket: any; 
  onClick: () => void; 
  TICKET_CATEGORIES: Record<string, string>;
}) {
  return (
    <div
      onClick={onClick}
      className="p-4 border border-sage/20 rounded-lg hover:border-accent/50 cursor-pointer transition-all duration-200 hover:shadow-md relative"
    >
      {ticket.unreadByUser && ticket.replies?.some((r: any) => !r.read && r.author === 'Admin') && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-accent text-white text-xs font-medium rounded-full shadow-lg">
          <MessageSquare className="h-3 w-3 mr-1" />
          {ticket.replies.filter((r: any) => !r.read && r.author === 'Admin').length}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xl font-bold text-primary-dark">{ticket.subject}</h4>
          <div className="flex items-center space-x-2">
            <span className="text-primary-dark font-medium">Ticket</span>
            <span className="text-accent font-mono">{ticket.ticketNumber}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
        </span>
      </div>
      
      <p className="text-sm text-primary mb-3 line-clamp-2">{ticket.message}</p>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full bg-sage/10 text-primary`}>
          {TICKET_CATEGORIES[ticket.category]}
        </span>
        <div className="flex items-center space-x-3 text-xs text-primary/80">
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {ticket.replies.length}
            </div>
          )}
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(ticket.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'open':
      return 'bg-accent/20 text-accent';
    case 'in_progress':
      return 'bg-mint/20 text-primary';
    case 'resolved':
      return 'bg-sage/20 text-primary-dark';
    case 'cancelled':
      return 'bg-coral/20 text-accent-dark';
    case 'closed':
      return 'bg-sage/10 text-primary';
    default:
      return 'bg-sage/10 text-primary';
  }
}