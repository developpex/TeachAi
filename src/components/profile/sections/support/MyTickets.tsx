import { useState } from 'react';
import { MessageSquare, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useMyTickets } from '../../../../hooks/useMyTickets';
import { SupportService } from '../../../../services/support';
import { TicketModal } from '../../../shared/TicketModal';
import { ROLE, TICKET_CATEGORIES, TICKET_STATUSES } from "../../../../utils/constants.ts";
import { LoadingSpinner } from '../../../shared/LoadingSpinner';

interface MyTicketsProps {
  setTickets: (tickets: any[]) => void;
}

export function MyTickets({ setTickets }: MyTicketsProps) {
  const { tickets, loading } = useMyTickets();
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
      setSelectedTicket(null);
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
      <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
          <MessageSquare className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">My Tickets</h3>
          <p className="text-sm text-primary dark:text-dark-text-secondary">View your support ticket history</p>
        </div>
      </div>

      {/* Active Tickets */}
      <div className="space-y-4">
        {activeTickets.length === 0 ? (
          <div className="text-center py-8 text-primary dark:text-dark-text-secondary">
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
        <div className="mt-8 border-t border-sage/10 dark:border-dark-border pt-6">
          <button
            onClick={() => setShowClosedTickets(!showClosedTickets)}
            className="flex items-center space-x-2 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
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
      className="p-4 border border-sage/20 dark:border-dark-border rounded-lg hover:border-accent/50 dark:hover:border-accent/50 cursor-pointer transition-all duration-200 hover:shadow-md dark:hover:shadow-dark-soft relative bg-white dark:bg-dark-surface"
    >
      {ticket.unreadByUser && ticket.replies?.some((r: any) => !r.read && r.author === ROLE.ADMIN) && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-accent text-white text-xs font-medium rounded-full shadow-lg dark:shadow-dark-soft">
          <MessageSquare className="h-3 w-3 mr-1" />
          {ticket.replies.filter((r: any) => !r.read && r.author === 'Admin').length}
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-xl font-bold text-primary-dark dark:text-dark-text">{ticket.subject}</h4>
          <div className="flex items-center space-x-2">
            <span className="text-primary-dark dark:text-dark-text font-medium">Ticket</span>
            <span className="text-accent font-mono">{ticket.ticketNumber}</span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
          {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
        </span>
      </div>
      
      <p className="text-sm text-primary dark:text-dark-text-secondary mb-3 line-clamp-2">{ticket.message}</p>
      
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-1 rounded-full bg-sage/10 dark:bg-dark-surface text-primary dark:text-dark-text`}>
          {TICKET_CATEGORIES[ticket.category]}
        </span>
        <div className="flex items-center space-x-3 text-xs text-primary/80 dark:text-dark-text-secondary/80">
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
      return 'bg-accent/20 dark:bg-accent/10 text-accent';
    case 'in_progress':
      return 'bg-mint/20 dark:bg-mint/10 text-primary dark:text-dark-text';
    case 'resolved':
      return 'bg-sage/20 dark:bg-sage/10 text-primary-dark dark:text-dark-text';
    case 'cancelled':
      return 'bg-coral/20 dark:bg-coral/10 text-accent-dark';
    case 'closed':
      return 'bg-sage/10 dark:bg-sage/5 text-primary dark:text-dark-text';
    default:
      return 'bg-sage/10 dark:bg-sage/5 text-primary dark:text-dark-text';
  }
}