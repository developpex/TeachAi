import React, { useEffect, useRef } from 'react';
import { Users, X, Send, Mail, Hash } from 'lucide-react';
import type { SupportTicket } from '../../../services/support';

interface TicketModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onStatusChange: (ticketId: string, newStatus: string) => void;
  onReply: (ticketId: string) => void;
  reply: string;
  setReply: (value: string) => void;
  getCategoryColor: (category: string) => string;
  TICKET_CATEGORIES: Record<string, string>;
  TICKET_STATUSES: Record<string, string>;
}

export function TicketModal({
  ticket,
  onClose,
  onStatusChange,
  onReply,
  reply,
  setReply,
  getCategoryColor,
  TICKET_CATEGORIES,
  TICKET_STATUSES
}: TicketModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket.replies]);

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] m-4 flex flex-col border border-sage/10">
          {/* Header */}
          <div className="flex justify-between items-start p-6 border-b border-sage/10">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-xl font-semibold text-primary-dark">{ticket.subject}</h2>
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(ticket.category)}`}>
                  {TICKET_CATEGORIES[ticket.category]}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">{ticket.username}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-sm text-primary">{ticket.email}</span>
                  </div>
                </div>
                {/* Ticket Number */}
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-accent" />
                  <code className="text-sm font-mono text-accent">{ticket.ticketNumber}</code>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={ticket.status}
                onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                className="px-3 py-1.5 border border-sage/30 rounded-lg text-sm focus:border-accent focus:ring-accent"
              >
                {Object.entries(TICKET_STATUSES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                onClick={onClose}
                className="text-primary hover:text-primary-dark"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Initial Message */}
            <div className="p-4 bg-sage/5 rounded-lg">
              <p className="text-primary">{ticket.message}</p>
              <div className="mt-2 text-xs text-primary/80">
                Created on {formatDateTime(ticket.createdAt)}
              </div>
            </div>

            {/* Replies */}
            {ticket.replies?.map((reply, index) => (
              <div 
                key={index} 
                className={`p-4 ${
                  reply.author === 'Admin'
                    ? 'border-l-2 border-accent bg-sage/5'
                    : 'border-r-2 border-mint bg-mint/5 ml-8'
                }`}
              >
                <p className="text-primary">{reply.message}</p>
                <div className="mt-2 text-xs text-primary/80">
                  <span className="font-medium">{reply.author === 'Admin' ? 'Support' : reply.author}</span> • {formatDateTime(reply.createdAt.toDate())}
                </div>
              </div>
            ))}
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Input */}
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
                disabled={!reply.trim()}
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-all duration-300 disabled:opacity-50 h-fit"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}