import { 
  collection, 
  query, 
  where, 
  orderBy, 
  // limit,
  // startAfter,
  // QueryDocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
// import { SupportTicket } from './types';

export function buildTicketQueries(db: any) {
  return {
    // getTicketsByStatus(status: SupportTicket['status'], ticketLimit: number = 5) {
    //   const ticketsRef = collection(db, 'support_tickets');
    //   return query(
    //     ticketsRef,
    //     where('status', '==', status),
    //     orderBy('updatedAt', 'desc'),
    //     limit(ticketLimit)
    //   );
    // },
    //
    // getMoreTicketsByStatus(
    //   status: SupportTicket['status'],
    //   lastDoc: QueryDocumentSnapshot,
    //   ticketLimit: number = 5
    // ) {
    //   const ticketsRef = collection(db, 'support_tickets');
    //   return query(
    //     ticketsRef,
    //     where('status', '==', status),
    //     orderBy('updatedAt', 'desc'),
    //     startAfter(lastDoc),
    //     limit(ticketLimit)
    //   );
    // },

    getOldTickets(daysOld: number) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const ticketsRef = collection(db, 'support_tickets');
      return query(
        ticketsRef,
        where('status', 'in', ['closed', 'cancelled']),
        where('updatedAt', '<=', Timestamp.fromDate(cutoffDate))
      );
    },

    getAllTickets() {
      const ticketsRef = collection(db, 'support_tickets');
      return query(ticketsRef, orderBy('createdAt', 'desc'));
    },

    getUserTickets(userId: string) {
      const ticketsRef = collection(db, 'support_tickets');
      return query(
        ticketsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
    }
  };
}