import { Timestamp } from 'firebase/firestore';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  category: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  email: string;
  username: string;
  replies?: Array<{
    message: string;
    author: string;
    createdAt: Timestamp;
    read?: boolean;
  }>;
  unreadByUser?: boolean;
  unreadBySupport?: boolean;
}

export interface CreateTicketData {
  userId: string;
  category: string;
  subject: string;
  message: string;
  email: string;
  username: string;
}

// export interface GetTicketsResult {
//   tickets: SupportTicket[];
//   hasMore: boolean;
//   lastDoc?: any;
// }