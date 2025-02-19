import { Clock, BookOpen, Settings, Download } from 'lucide-react';

export function ActivityHistory() {
  const activities = [
    {
      type: 'tool_usage',
      tool: 'Lesson Plan Generator',
      date: '2024-03-15 14:30',
      details: 'Created a lesson plan for "Introduction to Fractions"'
    },
    {
      type: 'account',
      action: 'Password Changed',
      date: '2024-03-14 09:15',
      details: 'Security settings updated'
    },
    {
      type: 'download',
      resource: 'Vocabulary List',
      date: '2024-03-13 16:45',
      details: 'Downloaded "Science Terms - Grade 8"'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'tool_usage':
        return <BookOpen className="h-5 w-5" />;
      case 'account':
        return <Settings className="h-5 w-5" />;
      case 'download':
        return <Download className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-dark-nav rounded-lg shadow-soft dark:shadow-dark-soft border border-sage/10 dark:border-dark-border p-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-mint/20 dark:bg-mint/10 rounded-lg">
          <Clock className="h-5 w-5 text-primary dark:text-dark-text" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-primary-dark dark:text-dark-text">Activity History</h3>
          <p className="text-sm text-primary dark:text-dark-text-secondary">Track your recent activities and usage</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-4 rounded-lg border border-sage/20 dark:border-dark-border"
          >
            <div className="p-2 bg-mint/10 dark:bg-mint/5 rounded-lg">
              {getIcon(activity.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-primary-dark dark:text-dark-text">
                  {activity.tool || activity.action || activity.resource}
                </h4>
                <span className="text-sm text-primary dark:text-dark-text-secondary">
                  {activity.date}
                </span>
              </div>
              <p className="text-sm text-primary dark:text-dark-text-secondary mt-1">
                {activity.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button className="text-sm text-accent hover:text-accent-dark dark:text-accent dark:hover:text-accent-dark">
          Load More Activities
        </button>
      </div>
    </div>
  );
}