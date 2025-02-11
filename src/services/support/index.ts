import { TicketOperations } from './operations';
export type { SupportTicket, CreateTicketData, GetTicketsResult } from './types';

export class SupportService {
  private static instance: SupportService;
  private operations: TicketOperations;

  private constructor() {
    this.operations = new TicketOperations();
  }

  public static getInstance(): SupportService {
    if (!SupportService.instance) {
      SupportService.instance = new SupportService();
    }
    return SupportService.instance;
  }

  // Ticket Creation
  public async createTicket(data: CreateTicketData): Promise<string> {
    return this.operations.createTicket(data);
  }

  // Ticket Status Management
  public async updateTicketStatus(ticketId: string, newStatus: SupportTicket['status']): Promise<void> {
    return this.operations.updateTicketStatus(ticketId, newStatus);
  }

  public async cancelTicket(ticketId: string): Promise<void> {
    return this.operations.updateTicketStatus(ticketId, 'cancelled');
  }

  // Replies
  public async addUserReply(ticketId: string, message: string): Promise<void> {
    return this.operations.addReply(ticketId, message, false);
  }

  public async addTicketReply(ticketId: string, message: string): Promise<void> {
    return this.operations.addReply(ticketId, message, true);
  }

  // Read Status
  public async markTicketReadByUser(ticketId: string): Promise<void> {
    return this.operations.markTicketReadByUser(ticketId);
  }

  public async markTicketReadBySupport(ticketId: string): Promise<void> {
    return this.operations.markTicketReadBySupport(ticketId);
  }

  // Subscriptions
  public subscribeToUserTickets(userId: string, callback: (tickets: SupportTicket[]) => void): () => void {
    return this.operations.subscribeToTickets(userId, callback);
  }

  public subscribeToAllTickets(callback: (tickets: SupportTicket[]) => void): () => void {
    return this.operations.subscribeToTickets(null, callback);
  }

  // Maintenance
  public async archiveOldTickets(daysOld: number = 30): Promise<void> {
    return this.operations.archiveOldTickets(daysOld);
  }

  // Get ticket by ID
  public async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    return this.operations.getTicketById(ticketId);
  }
}