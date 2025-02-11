import { getFirestore, addDoc, collection } from 'firebase/firestore';

export class EmailService {
  private static instance: EmailService;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendProfileUpdateEmail(userId: string, updates: Record<string, any>) {
    try {
      // Store the email notification in Firestore
      const emailRef = collection(this.db, 'emailNotifications');
      await addDoc(emailRef, {
        userId,
        type: 'PROFILE_UPDATE',
        updates,
        createdAt: new Date(),
        status: 'pending'
      });

      console.log('Profile update email notification queued');
    } catch (error) {
      console.error('Error queueing profile update email:', error);
      throw error;
    }
  }
}