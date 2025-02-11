import { CreateTicketData } from './types';

export function validateTicketData(data: CreateTicketData): void {
  if (!data.userId) throw new Error('User ID is required');
  if (!data.category) throw new Error('Category is required');
  if (!data.subject.trim()) throw new Error('Subject is required');
  if (!data.message.trim()) throw new Error('Message is required');
  if (!data.email) throw new Error('Email is required');
  if (!data.username) throw new Error('Username is required');

  const validCategories = ['technical', 'billing', 'account', 'feature', 'bug', 'other'];
  if (!validCategories.includes(data.category)) {
    throw new Error('Invalid ticket category');
  }
}

export function generateTicketNumber(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const year = new Date().getFullYear().toString().slice(-2);
  return `TKT-${year}-${randomNum}`;
}