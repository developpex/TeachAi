import { 
  getFirestore, 
  doc,
  getDoc,
  setDoc,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { auth } from '../../config/firebase';
import type { ToolUsageEntry, UserToolUsage, UsageLimit } from './types';

const WEEKLY_LIMIT = 5;

export class UsageService {
  private static instance: UsageService;
  private db = getFirestore();

  private constructor() {
    console.log('[UsageService] Initialized');
  }

  public static getInstance(): UsageService {
    if (!UsageService.instance) {
      UsageService.instance = new UsageService();
    }
    return UsageService.instance;
  }

  private getWeekStartDate(date = new Date()): Date {
    const weekStart = new Date(date);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setDate(date.getDate() - date.getDay()); // Set to Sunday
    return weekStart;
  }

  private async getUserToolUsage(userId: string): Promise<UserToolUsage | null> {
    const userToolUsageRef = doc(this.db, 'user_tool_usage', userId);
    const docSnap = await getDoc(userToolUsageRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      userId: data.userId,
      weekStartDate: data.weekStartDate.toDate(),
      usages: data.usages.map((usage: any) => ({
        ...usage,
        timestamp: usage.timestamp.toDate()
      }))
    };
  }

  public subscribeToToolUsage(callback: (limit: UsageLimit) => void): () => void {
    if (!auth.currentUser) {
      console.log('[UsageService] No authenticated user found');
      return () => {};
    }

    const userId = auth.currentUser.uid;
    const userToolUsageRef = doc(this.db, 'user_tool_usage', userId);

    return onSnapshot(userToolUsageRef, (docSnapshot) => {
      const weekStartDate = this.getWeekStartDate();

      if (!docSnapshot.exists()) {
        // No document exists yet
        callback({
          weeklyLimit: WEEKLY_LIMIT,
          currentUsage: 0,
          weekStartDate,
          remainingUses: WEEKLY_LIMIT
        });
        return;
      }

      const data = docSnapshot.data();
      const usageWeekStart = data.weekStartDate.toDate();

      // If document is from a previous week, return full limit
      if (usageWeekStart < weekStartDate) {
        callback({
          weeklyLimit: WEEKLY_LIMIT,
          currentUsage: 0,
          weekStartDate,
          remainingUses: WEEKLY_LIMIT
        });
        return;
      }

      // Calculate current usage and remaining uses
      const usageCount = data.usages.length;
      const remainingUses = Math.max(0, WEEKLY_LIMIT - usageCount);

      callback({
        weeklyLimit: WEEKLY_LIMIT,
        currentUsage: usageCount,
        weekStartDate,
        remainingUses
      });
    }, (error) => {
      console.error('[UsageService] Error in usage subscription:', error);
    });
  }

  public async trackToolUsage(toolId: string, toolName: string): Promise<void> {
    console.log('[UsageService] Starting trackToolUsage', { toolId, toolName });
    
    if (!auth.currentUser) {
      console.log('[UsageService] No authenticated user found');
      throw new Error('User must be authenticated to track tool usage');
    }

    try {
      const userId = auth.currentUser.uid;
      const currentWeekStart = this.getWeekStartDate();
      const userToolUsageRef = doc(this.db, 'user_tool_usage', userId);

      // Get current usage document
      const currentUsage = await this.getUserToolUsage(userId);
      
      // If no document exists or it's from a previous week, create new one
      if (!currentUsage || currentUsage.weekStartDate < currentWeekStart) {
        console.log('[UsageService] Creating new usage document for week');
        await setDoc(userToolUsageRef, {
          userId,
          weekStartDate: Timestamp.fromDate(currentWeekStart),
          usages: [{
            toolId,
            toolName,
            timestamp: Timestamp.now()
          }]
        });
        return;
      }

      // Add new usage to existing document
      await setDoc(userToolUsageRef, {
        userId,
        weekStartDate: Timestamp.fromDate(currentWeekStart),
        usages: [
          ...currentUsage.usages,
          {
            toolId,
            toolName,
            timestamp: Timestamp.now()
          }
        ]
      });

    } catch (error) {
      console.error('[UsageService] Error tracking tool usage:', error);
      throw error;
    }
  }

  public async getWeeklyUsageLimit(): Promise<UsageLimit> {
    console.log('[UsageService] Getting weekly usage limit');
    
    if (!auth.currentUser) {
      console.log('[UsageService] No authenticated user found');
      throw new Error('User must be authenticated to check usage limit');
    }

    try {
      const userId = auth.currentUser.uid;
      const weekStartDate = this.getWeekStartDate();
      
      // Get current usage document
      const currentUsage = await this.getUserToolUsage(userId);
      
      // If no document exists or it's from a previous week, return full limit
      if (!currentUsage || currentUsage.weekStartDate < weekStartDate) {
        return {
          weeklyLimit: WEEKLY_LIMIT,
          currentUsage: 0,
          weekStartDate,
          remainingUses: WEEKLY_LIMIT
        };
      }

      // Calculate current usage and remaining uses
      const usageCount = currentUsage.usages.length;
      const remainingUses = Math.max(0, WEEKLY_LIMIT - usageCount);

      return {
        weeklyLimit: WEEKLY_LIMIT,
        currentUsage: usageCount,
        weekStartDate,
        remainingUses
      };
    } catch (error) {
      console.error('[UsageService] Error getting weekly usage:', error);
      throw error;
    }
  }

  public async canUseTools(): Promise<boolean> {
    console.log('[UsageService] Checking if tools can be used');
    
    if (!auth.currentUser) {
      console.log('[UsageService] No authenticated user found');
      return false;
    }

    try {
      const { remainingUses } = await this.getWeeklyUsageLimit();
      console.log('[UsageService] Can use tools:', remainingUses > 0);
      return remainingUses > 0;
    } catch (error) {
      console.error('[UsageService] Error checking tool usage:', error);
      return false;
    }
  }
}