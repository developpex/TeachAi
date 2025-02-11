import { 
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  writeBatch,
  Timestamp,
  arrayUnion,
  onSnapshot,
  query,
  where
} from 'firebase/firestore';
import { auth } from '../../config/firebase';
import { CreateTicketData, SupportTicket } from './types';
import { validateTicketData, generateTicketNumber } from './validation';
import { buildTicketQueries } from './queries';

export class TicketOperations {
  private db = getFirestore();
  private queries = buildTicketQueries(this.db);

  async createTicket(data: CreateTicketData): Promise<string> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to create a ticket');
    }

    try {
      validateTicketData(data);

      const ticketsRef = collection(this.db, 'support_tickets');
      const now = Timestamp.now();
      const ticketNumber = generateTicketNumber();

      // Check if ticket number already exists
      const existingTicket = await getDocs(
        query(ticketsRef, where('ticketNumber', '==', ticketNumber))
      );

      if (!existingTicket.empty) {
        return this.createTicket(data); // Try again with new number
      }

      const docRef = await addDoc(ticketsRef, {
        ...data,
        ticketNumber,
        status: 'open',
        createdAt: now,
        updatedAt: now,
        replies: [],
        unreadByUser: false,
        unreadBySupport: true
      });

      return docRef.id;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  }

  async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to get ticket');
    }

    try {
      const ticketRef = doc(this.db, 'support_tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        return null;
      }

      const data = ticketDoc.data();
      return {
        id: ticketDoc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as SupportTicket;
    } catch (error) {
      console.error('Error getting ticket:', error);
      throw error;
    }
  }

  async updateTicketStatus(ticketId: string, newStatus: SupportTicket['status']): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to update ticket status');
    }

    try {
      const ticketRef = doc(this.db, 'support_tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);

      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }

      const updates: Record<string, any> = {
        status: newStatus,
        updatedAt: Timestamp.now()
      };

      if (newStatus === 'resolved') {
        updates.resolvedAt = Timestamp.now();
      }

      await updateDoc(ticketRef, updates);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  }

  async addReply(ticketId: string, message: string, isAdmin: boolean): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to reply to ticket');
    }

    try {
      const ticketRef = doc(this.db, 'support_tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);

      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }

      const reply = {
        message,
        author: isAdmin ? 'Admin' : ticketDoc.data().username,
        createdAt: Timestamp.now(),
        read: false
      };

      await updateDoc(ticketRef, {
        replies: arrayUnion(reply),
        updatedAt: Timestamp.now(),
        unreadBySupport: !isAdmin,
        unreadByUser: isAdmin
      });
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  }

  async markTicketReadByUser(ticketId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to mark ticket as read');
    }

    try {
      const ticketRef = doc(this.db, 'support_tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }

      const data = ticketDoc.data();
      const updatedReplies = (data.replies || []).map((reply: any) => ({
        ...reply,
        read: reply.author === 'Admin' ? true : reply.read
      }));

      await updateDoc(ticketRef, {
        replies: updatedReplies,
        unreadByUser: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking ticket read by user:', error);
      throw error;
    }
  }

  async markTicketReadBySupport(ticketId: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to mark ticket as read');
    }

    try {
      const ticketRef = doc(this.db, 'support_tickets', ticketId);
      const ticketDoc = await getDoc(ticketRef);
      
      if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
      }

      const data = ticketDoc.data();
      const updatedReplies = (data.replies || []).map((reply: any) => ({
        ...reply,
        read: reply.author !== 'Admin' ? true : reply.read
      }));

      await updateDoc(ticketRef, {
        replies: updatedReplies,
        unreadBySupport: false,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking ticket read by support:', error);
      throw error;
    }
  }

  async archiveOldTickets(daysOld: number = 30): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to archive tickets');
    }

    try {
      const snapshot = await getDocs(this.queries.getOldTickets(daysOld));
      const batch = writeBatch(this.db);

      snapshot.docs.forEach(doc => {
        const archivedTicketRef = doc(this.db, 'archived_tickets', doc.id);
        batch.set(archivedTicketRef, {
          ...doc.data(),
          archivedAt: Timestamp.now()
        });
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error archiving old tickets:', error);
      throw error;
    }
  }

  subscribeToTickets(userId: string | null, callback: (tickets: SupportTicket[]) => void): () => void {
    if (!auth.currentUser) {
      return () => {};
    }

    const q = userId ? this.queries.getUserTickets(userId) : this.queries.getAllTickets();

    return onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as SupportTicket[];
      callback(tickets);
    }, (error) => {
      console.error('Error in tickets subscription:', error);
    });
  }
}