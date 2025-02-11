import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

// Aggregate daily analytics
export const aggregateDailyAnalytics = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(yesterday.setHours(0, 0, 0, 0));
    const endOfDay = new Date(yesterday.setHours(23, 59, 59, 999));

    try {
      // Get all analytics collections
      const [toolUsage, featureInteractions, timeSpent, errors, searches] = await Promise.all([
        db.collection('analytics_tool_usage')
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .get(),
        db.collection('analytics_feature_interactions')
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .get(),
        db.collection('analytics_time_spent')
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .get(),
        db.collection('analytics_errors')
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .get(),
        db.collection('analytics_searches')
          .where('timestamp', '>=', startOfDay)
          .where('timestamp', '<=', endOfDay)
          .get()
      ]);

      // Aggregate the data
      const dailyStats = {
        date: startOfDay.toISOString().split('T')[0],
        toolUsage: {
          total: toolUsage.size,
          byTool: {} as Record<string, number>
        },
        featureInteractions: {
          total: featureInteractions.size,
          byFeature: {} as Record<string, number>
        },
        timeSpent: {
          total: 0,
          byPage: {} as Record<string, number>
        },
        errors: {
          total: errors.size,
          byType: {} as Record<string, number>
        },
        searches: {
          total: searches.size,
          averageResults: 0
        }
      };

      // Process tool usage
      toolUsage.forEach(doc => {
        const data = doc.data();
        dailyStats.toolUsage.byTool[data.toolId] = (dailyStats.toolUsage.byTool[data.toolId] || 0) + 1;
      });

      // Process feature interactions
      featureInteractions.forEach(doc => {
        const data = doc.data();
        dailyStats.featureInteractions.byFeature[data.feature] = 
          (dailyStats.featureInteractions.byFeature[data.feature] || 0) + 1;
      });

      // Process time spent
      timeSpent.forEach(doc => {
        const data = doc.data();
        dailyStats.timeSpent.total += data.duration;
        dailyStats.timeSpent.byPage[data.page] = 
          (dailyStats.timeSpent.byPage[data.page] || 0) + data.duration;
      });

      // Process errors
      errors.forEach(doc => {
        const data = doc.data();
        const errorType = data.errorMessage.split(':')[0];
        dailyStats.errors.byType[errorType] = (dailyStats.errors.byType[errorType] || 0) + 1;
      });

      // Process searches
      let totalResults = 0;
      searches.forEach(doc => {
        const data = doc.data();
        totalResults += data.resultsCount;
      });
      dailyStats.searches.averageResults = searches.size > 0 ? totalResults / searches.size : 0;

      // Store aggregated data
      await db.collection('analytics_daily_stats').add(dailyStats);

      console.log(`Daily analytics aggregated for ${dailyStats.date}`);
      return null;
    } catch (error) {
      console.error('Error aggregating daily analytics:', error);
      throw error;
    }
  });

// Clean up old raw analytics data
export const cleanupOldAnalytics = functions.pubsub
  .schedule('every 168 hours') // Weekly
  .onRun(async (context) => {
    const retentionDays = 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const collections = [
      'analytics_tool_usage',
      'analytics_feature_interactions',
      'analytics_time_spent',
      'analytics_errors',
      'analytics_searches'
    ];

    try {
      for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName)
          .where('timestamp', '<', cutoffDate)
          .get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`Cleaned up ${snapshot.size} old records from ${collectionName}`);
      }

      return null;
    } catch (error) {
      console.error('Error cleaning up old analytics:', error);
      throw error;
    }
  });