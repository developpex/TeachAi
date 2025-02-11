import React, { useState } from 'react';
import { Clock, MessageSquare } from 'lucide-react';
import type { SupportTicket } from '../../../services/support';

interface TicketListProps {
  tickets: SupportTicket[];
  status: string;
  statusLabel: string;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onTicketDragStart: (e: React.DragEvent, ticketId: string) => void;
  onTicketDragEnd: (e: React.DragEvent) => void;
  onTicketDragOver: (e: React.DragEvent, ticketId: string) => void;
  onTicketDragLeave: (e: React.DragEvent) => void;
  onTicketClick: (ticket: SupportTicket) => void;
  getCategoryColor: (category: string) => string;
  TICKET_CATEGORIES: Record<string, string>;
}

export function TicketList({
  tickets,
  status,
  statusLabel,
  onDragOver,
  onDrop,
  onTicketDragStart,
  onTicketDragEnd,
  onTicketDragOver,
  onTicketDragLeave,
  onTicketClick,
  getCategoryColor,
  TICKET_CATEGORIES
}: TicketListProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setIsDragOver(false);
    onTicketDragLeave(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    onDrop(e, status);
  };

  return (
    <div className="flex-1 min-w-[300px] max-w-md">
      <div 
        className={`flex flex-col h-full bg-white rounded-lg shadow-soft border-2 transition-all duration-200 ${
          isDragOver 
            ? 'border-accent shadow-lg scale-[1.02]' 
            : 'border-sage/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Header */}
        <div className={`p-4 border-b border-sage/10 transition-colors duration-200 ${isDragOver ? 'bg-accent/10' : ''}`}>
          <h3 className="font-semibold text-primary-dark">{statusLabel}</h3>
          <p className="text-sm text-primary">{tickets.length} tickets</p>
        </div>

        {/* Tickets List */}
        <div className={`flex-1 p-4 space-y-4 min-h-[200px] overflow-y-auto transition-colors duration-200 ${
          isDragOver ? 'bg-accent/5' : ''
        }`}>
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              draggable
              onDragStart={(e) => onTicketDragStart(e, ticket.id)}
              onDragEnd={onTicketDragEnd}
              onDragOver={(e) => onTicketDragOver(e, ticket.id)}
              onDragLeave={onTicketDragLeave}
              onClick={() => onTicketClick(ticket)}
              className="p-4 rounded-lg border border-sage/20 hover:border-accent/50 cursor-move transition-all duration-200 hover:shadow-md active:shadow-lg relative bg-white"
            >
              {ticket.unreadBySupport && (
                <div className="absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-accent text-white text-xs font-medium rounded-full shadow-lg">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {ticket.replies?.filter(r => !r.read && r.author !== 'Admin').length || 1}
                </div>
              )}
              
              {/* Ticket Number */}
              <div className="flex items-center space-x-2 mb-2">
                <code className="px-2 py-1 bg-accent/10 text-accent rounded font-mono text-sm">
                  {ticket.ticketNumber}
                </code>
              </div>
              
              {/* Subject - Added truncate class */}
              <h4 className="text-lg font-semibold text-primary-dark mb-2 truncate">{ticket.subject}</h4>
              
              {/* Message Preview - Added line-clamp-2 */}
              <p className="text-sm text-primary mb-3 line-clamp-2">{ticket.message}</p>
              
              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(ticket.category)}`}>
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
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Drop Zone Indicator */}
          {isDragOver && (
            <div className="border-2 border-accent border-dashed rounded-lg p-8 flex items-center justify-center">
              <p className="text-accent text-sm">Drop ticket here to change status to {statusLabel}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}