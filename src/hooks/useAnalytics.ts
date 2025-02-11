import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnalyticsService } from '../services/analytics';

export function useAnalytics() {
  const location = useLocation();
  const { user } = useAuth();
  const analytics = AnalyticsService.getInstance();
  const pageLoadTime = useRef(Date.now());

  // Track page views and time spent
  useEffect(() => {
    if (!user?.uid) return;

    const startTime = Date.now();
    pageLoadTime.current = startTime;

    // Track performance
    const pageLoadDuration = startTime - performance.timing.navigationStart;
    analytics.trackPerformance(user.uid, 'page_load', pageLoadDuration, {
      page: location.pathname
    });

    // Track feature interaction for page view
    analytics.trackFeatureInteraction(user.uid, 'page_view', 'view', {
      path: location.pathname
    });

    return () => {
      // Track time spent when leaving page
      const endTime = Date.now();
      const duration = endTime - pageLoadTime.current;
      analytics.trackTimeSpent(user.uid, location.pathname, duration);
    };
  }, [location.pathname, user?.uid]);

  const trackToolUsage = async (toolId: string, data: any) => {
    if (!user?.uid) return;
    await analytics.trackToolUsage(user.uid, toolId, data);
  };

  const trackFeature = async (feature: string, action: string, metadata?: Record<string, any>) => {
    if (!user?.uid) return;
    await analytics.trackFeatureInteraction(user.uid, feature, action, metadata);
  };

  const trackError = async (error: Error, context: any) => {
    if (!user?.uid) return;
    await analytics.trackError(user.uid, error, context);
  };

  const trackSearch = async (query: string, results: number) => {
    if (!user?.uid) return;
    await analytics.trackSearch(user.uid, query, results);
  };

  return {
    trackToolUsage,
    trackFeature,
    trackError,
    trackSearch
  };
}