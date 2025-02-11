import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private db = getFirestore();

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Track tool usage
  public async trackToolUsage(userId: string, toolId: string, data: any) {
    if (!userId || !toolId) return;

    try {
      await addDoc(collection(this.db, 'analytics_tool_usage'), {
        userId,
        toolId,
        data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking tool usage:', error);
    }
  }

  // Track feature interactions
  public async trackFeatureInteraction(userId: string, feature: string, action: string, metadata?: Record<string, any>) {
    if (!userId || !feature) return;

    try {
      await addDoc(collection(this.db, 'analytics_feature_interactions'), {
        userId,
        feature,
        action,
        metadata,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking feature interaction:', error);
    }
  }

  // Track time spent
  public async trackTimeSpent(userId: string, page: string, duration: number) {
    if (!userId || !page) return;

    try {
      await addDoc(collection(this.db, 'analytics_time_spent'), {
        userId,
        page,
        duration,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking time spent:', error);
    }
  }

  // Track errors
  public async trackError(userId: string, error: Error, context: any) {
    if (!userId) return;

    try {
      await addDoc(collection(this.db, 'analytics_errors'), {
        userId,
        errorMessage: error.message,
        errorStack: error.stack,
        context,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking error:', error);
    }
  }

  // Track search queries
  public async trackSearch(userId: string, query: string, results: number) {
    if (!userId) return;

    try {
      await addDoc(collection(this.db, 'analytics_searches'), {
        userId,
        query,
        resultsCount: results,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }

  // Track performance metrics
  public async trackPerformance(userId: string, metric: string, value: number, metadata?: Record<string, any>) {
    if (!userId) return;

    try {
      await addDoc(collection(this.db, 'analytics_performance'), {
        userId,
        metric,
        value,
        metadata,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking performance:', error);
    }
  }
}