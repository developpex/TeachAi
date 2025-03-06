import React, { useEffect, useRef, useState } from 'react';
import { Clock, MessageSquare, Send, X, Mail, Hash, AlertTriangle } from 'lucide-react';
import { SupportService } from '../../services/support';

interface TicketModalProps {
  ticket: any;
  onClose: () => void;
  onReply: (ticketId: string, message: string) => void;
  onStatusChange?: (ticketId: string, newStatus: string) => void;
  reply: string;
  setReply: (value: string) => void;
  sending: boolean;
  isAdmin?: boolean;
  TICKET_CATEGORIES: Record<string, string>;
  TICKET_STATUSES?: Record<string, string>;
}

export function TicketModal({
  ticket,
  onClose,
  onReply,
  onStatusChange,
  reply,
  setReply,
  sending,
  isAdmin = false,
  TICKET_CATEGORIES,
  TICKET_STATUSES
}: TicketModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supportService = SupportService.getInstance();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.replies]);

  const formatDateTime = (date: Date | { toDate: () => Date }) => {
    const dateObj = date instanceof Date ? date : date.toDate();
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(dateObj);
  };

  const getStatusColor = (status: string) => {
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
  };

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await supportService.cancelTicket(ticket.id);
      if (onStatusChange) {
        onStatusChange(ticket.id, 'cancelled');
      }
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Error cancelling ticket:', error);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-dark-nav rounded-2xl shadow-xl dark:shadow-dark-soft w-full max-w-4xl h-[90vh] flex flex-col border border-sage/10 dark:border-dark-border">
          {/* Header */}
          <div className="flex flex-col space-y-4 p-6 border-b border-sage/10 dark:border-dark-border">
            {/* Title and Status */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <h2 className="text-xl font-semibold text-primary-dark dark:text-dark-text truncate">{ticket.subject}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(ticket.category)}`}>
                    {TICKET_CATEGORIES[ticket.category]}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 flex-shrink-0">
                {isAdmin && TICKET_STATUSES ? (
                  <select
                    value={ticket.status}
                    onChange={(e) => onStatusChange?.(ticket.id, e.target.value)}
                    className="px-3 py-1.5 border border-sage/30 dark:border-dark-border rounded-lg text-sm text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface focus:border-accent focus:ring-accent"
                  >
                    {Object.entries(TICKET_STATUSES).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  ticket.status !== 'cancelled' && ticket.status !== 'closed' && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      className="px-3 py-1.5 text-sm text-accent dark:text-accent hover:text-accent-dark dark:hover:text-accent-dark"
                    >
                      Cancel Ticket
                    </button>
                  )
                )}
                <button
                  onClick={onClose}
                  className="text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary dark:text-dark-text-secondary" />
                <span className="text-primary dark:text-dark-text-secondary">{ticket.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-accent" />
                <code className="font-mono text-accent">{ticket.ticketNumber}</code>
              </div>
              <div className="flex items-center space-x-2 text-primary dark:text-dark-text-secondary">
                <Clock className="h-4 w-4" />
                <span>Created on {formatDateTime(ticket.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Initial Message */}
            <div className="p-4 bg-accent/10 dark:bg-accent/5 border border-accent/20 dark:border-accent/10 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-primary-dark dark:text-dark-text">{ticket.username}</span>
                <span className="text-xs text-primary/80 dark:text-dark-text-secondary/80">•</span>
                <span className="text-xs text-primary/80 dark:text-dark-text-secondary/80">{formatDateTime(ticket.createdAt)}</span>
              </div>
              <p className="text-primary-dark dark:text-dark-text whitespace-pre-wrap break-words">{ticket.message}</p>
            </div>

            {/* Replies */}
            {ticket.replies && ticket.replies.length > 0 && (
              <div className="space-y-4">
                {ticket.replies.map((reply: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      reply.author === 'Admin'
                        ? 'bg-sage/5 dark:bg-dark-surface'
                        : 'bg-mint/5 dark:bg-mint/5 ml-8 border-2 border-mint/20 dark:border-mint/10'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-primary-dark dark:text-dark-text">
                        {reply.author === 'Admin' ? 'Support Team' : reply.author}
                      </span>
                      <span className="text-xs text-primary/80 dark:text-dark-text-secondary/80">•</span>
                      <span className="text-xs text-primary/80 dark:text-dark-text-secondary/80">{formatDateTime(reply.createdAt)}</span>
                    </div>
                    <p className="text-primary dark:text-dark-text-secondary whitespace-pre-wrap break-words">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
          {ticket.status !== 'closed' && ticket.status !== 'cancelled' && (
            <div className="p-6 border-t border-sage/10 dark:border-dark-border">
              <div className="flex items-stretch space-x-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 border-2 border-sage/30 dark:border-dark-border rounded-lg text-primary-dark dark:text-dark-text bg-white dark:bg-dark-surface placeholder-primary/50 dark:placeholder-dark-text-secondary/50 focus:outline-none focus:ring-accent focus:border-accent resize-none"
                  rows={3}
                />
                <button
                  onClick={() => onReply(ticket.id, reply)}
                  disabled={!reply.trim() || sending}
                  className="px-6 flex items-center bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70" onClick={() => setShowCancelConfirm(false)} />
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white dark:bg-dark-nav rounded-xl shadow-xl dark:shadow-dark-soft w-full max-w-md p-6 border border-sage/10 dark:border-dark-border">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-coral/10 dark:bg-coral/5 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary-dark dark:text-dark-text">Cancel Ticket</h3>
              </div>
              
              <p className="text-primary dark:text-dark-text-secondary mb-6">
                Are you sure you want to cancel this ticket? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 text-primary dark:text-dark-text-secondary hover:text-primary-dark dark:hover:text-dark-text"
                  disabled={cancelling}
                >
                  Keep Ticket
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling...' : 'Yes, Cancel Ticket'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}