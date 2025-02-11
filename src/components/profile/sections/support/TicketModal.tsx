import React, { useEffect, useRef, useState } from 'react';
import { Clock, MessageSquare, Send, X, Trash2, Mail, Hash } from 'lucide-react';
import type { SupportTicket } from '../../../../services/support';

interface TicketModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onReply: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
  reply: string;
  setReply: (value: string) => void;
  sending: boolean;
  TICKET_CATEGORIES: Record<string, string>;
}

export function TicketModal({
  ticket,
  onClose,
  onReply,
  onDelete,
  reply,
  setReply,
  sending,
  TICKET_CATEGORIES
}: TicketModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        return 'bg-accent/20 text-accent';
      case 'in_progress':
        return 'bg-mint/20 text-primary';
      case 'resolved':
        return 'bg-sage/20 text-primary-dark';
      case 'closed':
        return 'bg-sage/10 text-primary';
      default:
        return 'bg-sage/10 text-primary';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col border border-sage/10">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-sage/10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold text-primary-dark">{ticket.subject}</h2>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ').charAt(0).toUpperCase() + ticket.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                {/* Ticket Number */}
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-accent" />
                  <code className="text-sm font-mono text-accent">{ticket.ticketNumber}</code>
                </div>
                {/* Created Date */}
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <Clock className="h-4 w-4" />
                  <span>Created on {formatDateTime(ticket.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-accent hover:bg-coral/10 rounded-lg transition-colors duration-200"
                title="Delete ticket"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-sage/10 rounded-lg transition-colors duration-200"
              >
                <X className="h-5 w-5 text-primary" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Initial Message */}
            <div className="p-4 bg-accent/10 border-l-4 border-accent rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-primary-dark">{ticket.username}</span>
                <span className="text-xs text-primary/80">•</span>
                <span className="text-xs text-primary/80">{formatDateTime(ticket.createdAt)}</span>
              </div>
              <p className="text-primary-dark">{ticket.message}</p>
            </div>

            {/* Replies */}
            {ticket.replies && ticket.replies.length > 0 && (
              <div className="space-y-4">
                {ticket.replies.map((reply, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg ${
                      reply.author === 'Admin'
                        ? 'bg-sage/5 border-l-2 border-accent'
                        : 'bg-mint/5 border-r-2 border-mint ml-8'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-primary-dark">
                        {reply.author === 'Admin' ? 'Support Team' : reply.author}
                      </span>
                      <span className="text-xs text-primary/80">•</span>
                      <span className="text-xs text-primary/80">{formatDateTime(reply.createdAt)}</span>
                    </div>
                    <p className="text-primary">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
          {ticket.status !== 'closed' && (
            <div className="p-6 border-t border-sage/10">
              <div className="flex space-x-4">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1 px-4 py-3 border-2 border-sage/30 rounded-lg text-primary-dark placeholder-primary/50 focus:outline-none focus:ring-accent focus:border-accent resize-none"
                  rows={3}
                />
                <button
                  onClick={() => onReply(ticket.id)}
                  disabled={!reply.trim() || sending}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 h-fit"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowDeleteConfirm(false)} />
          
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 border border-sage/10">
              <h3 className="text-xl font-semibold text-primary-dark mb-4">Delete Ticket</h3>
              <p className="text-primary mb-6">
                Are you sure you want to delete this ticket? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-primary hover:text-primary-dark"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(ticket.id);
                    setShowDeleteConfirm(false);
                    onClose();
                  }}
                  className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300"
                >
                  Delete Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}