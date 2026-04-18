import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { 
  ActivityLog, 
  User, 
  ChartDataset, 
  ActivityFilters, 
  ActivityType, 
  ActivitySummary,
  DailyActivityData,
  WeeklyTrendData,
  ExportData
} from './activity-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityDashboardService {

  private mockUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john.doe@company.com', department: 'Engineering' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', department: 'Design' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', department: 'Marketing' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', department: 'Sales' },
    { id: 5, name: 'David Brown', email: 'david.brown@company.com', department: 'Support' }
  ];

  private mockActivities: ActivityLog[] = [];

  constructor() {
    this.generateMockActivityData();
  }

  /**
   * Gets all users for filter dropdown
   */
  getUsers(): Observable<User[]> {
    return of(this.mockUsers).pipe(delay(200));
  }

  /**
   * Gets filtered activity logs
   */
  getActivities(filters: ActivityFilters): Observable<ActivityLog[]> {
    let filteredActivities = [...this.mockActivities];

    // Apply date range filter
    if (filters.startDate) {
      filteredActivities = filteredActivities.filter(
        activity => activity.timestamp >= filters.startDate!
      );
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      filteredActivities = filteredActivities.filter(
        activity => activity.timestamp <= endOfDay
      );
    }

    // Apply user filter
    if (filters.selectedUserId) {
      filteredActivities = filteredActivities.filter(
        activity => activity.userId === filters.selectedUserId
      );
    }

    // Apply activity type filter
    if (filters.activityType) {
      filteredActivities = filteredActivities.filter(
        activity => activity.activityType === filters.activityType
      );
    }

    return of(filteredActivities).pipe(delay(300));
  }

  /**
   * Gets daily activity data for bar chart
   */
  getDailyActivityData(filters: ActivityFilters): Observable<ChartDataset[]> {
    return this.getActivities(filters).pipe(
      map(activities => {
        const dailyGroups = this.groupActivitiesByDay(activities);
        
        const chartData: ChartDataset[] = [{
          name: 'Daily Activities',
          series: Object.entries(dailyGroups).map(([date, count]) => ({
            name: this.formatDateForChart(date),
            value: count,
            extra: { fullDate: date }
          }))
        }];

        return chartData;
      })
    );
  }

  /**
   * Gets weekly trend data for line chart
   */
  getWeeklyTrendData(filters: ActivityFilters): Observable<ChartDataset[]> {
    return this.getActivities(filters).pipe(
      map(activities => {
        const weeklyGroups = this.groupActivitiesByWeek(activities);
        
        const chartData: ChartDataset[] = [{
          name: 'Weekly Trend',
          series: Object.entries(weeklyGroups).map(([week, count]) => ({
            name: week,
            value: count,
            extra: { week }
          }))
        }];

        return chartData;
      })
    );
  }

  /**
   * Gets activity summary statistics
   */
  getActivitySummary(filters: ActivityFilters): Observable<ActivitySummary> {
    return this.getActivities(filters).pipe(
      map(activities => {
        if (activities.length === 0) {
          return {
            totalActivities: 0,
            totalDuration: 0,
            averageDuration: 0,
            mostActiveUser: 'No data',
            mostCommonActivity: ActivityType.VIEW
          };
        }

        const totalDuration = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
        const userCounts = this.countByUser(activities);
        const activityTypeCounts = this.countByActivityType(activities);

        return {
          totalActivities: activities.length,
          totalDuration: totalDuration,
          averageDuration: Math.round(totalDuration / activities.length),
          mostActiveUser: this.getMostActiveUser(userCounts),
          mostCommonActivity: this.getMostCommonActivity(activityTypeCounts)
        };
      })
    );
  }

  /**
   * Exports filtered activities to CSV format
   */
  exportToCsv(filters: ActivityFilters): Observable<ExportData> {
    return this.getActivities(filters).pipe(
      map(activities => ({
        fileName: `activity-report-${new Date().toISOString().split('T')[0]}.csv`,
        headers: ['ID', 'User Name', 'Activity Type', 'Description', 'Timestamp', 'Duration (min)'],
        data: activities.map(activity => [
          activity.id,
          activity.userName,
          activity.activityType,
          activity.description,
          activity.timestamp.toLocaleString(),
          activity.duration || 0
        ])
      }))
    );
  }

  /**
   * Generate mock activity data for the last 30 days
   */
  private generateMockActivityData(): void {
    const activities: ActivityLog[] = [];
    const activityTypes = Object.values(ActivityType);
    const descriptions = {
      [ActivityType.LOGIN]: ['User logged into the system', 'Successful authentication'],
      [ActivityType.LOGOUT]: ['User logged out', 'Session ended'],
      [ActivityType.CREATE]: ['Created new document', 'Added new user', 'Created project'],
      [ActivityType.UPDATE]: ['Updated profile', 'Modified document', 'Changed settings'],
      [ActivityType.DELETE]: ['Deleted file', 'Removed user', 'Archived project'],
      [ActivityType.VIEW]: ['Viewed dashboard', 'Opened document', 'Accessed reports'],
      [ActivityType.DOWNLOAD]: ['Downloaded report', 'Exported data', 'Retrieved file'],
      [ActivityType.UPLOAD]: ['Uploaded document', 'Imported data', 'Added attachment'],
      [ActivityType.EXPORT]: ['Exported to CSV', 'Generated report', 'Downloaded backup']
    };

    // Generate activities for the last 30 days
    for (let i = 0; i < 500; i++) {
      const randomUser = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
      const randomActivityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const randomDescription = descriptions[randomActivityType][
        Math.floor(Math.random() * descriptions[randomActivityType].length)
      ];

      // Generate random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );

      activities.push({
        id: i + 1,
        userId: randomUser.id,
        userName: randomUser.name,
        activityType: randomActivityType,
        description: randomDescription,
        timestamp: timestamp,
        duration: Math.floor(Math.random() * 120) + 1, // 1-120 minutes
        metadata: {
          department: randomUser.department,
          source: 'web-app'
        }
      });
    }

    // Sort by timestamp descending
    this.mockActivities = activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Groups activities by day
   */
  private groupActivitiesByDay(activities: ActivityLog[]): { [date: string]: number } {
    return activities.reduce((groups, activity) => {
      const date = activity.timestamp.toISOString().split('T')[0];
      groups[date] = (groups[date] || 0) + 1;
      return groups;
    }, {} as { [date: string]: number });
  }

  /**
   * Groups activities by week
   */
  private groupActivitiesByWeek(activities: ActivityLog[]): { [week: string]: number } {
    return activities.reduce((groups, activity) => {
      const weekStart = this.getWeekStart(activity.timestamp);
      const weekKey = weekStart.toISOString().split('T')[0];
      groups[weekKey] = (groups[weekKey] || 0) + 1;
      return groups;
    }, {} as { [week: string]: number });
  }

  /**
   * Gets the start of the week for a given date
   */
  private getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day;
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
  }

  /**
   * Formats date for chart display
   */
  private formatDateForChart(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /**
   * Counts activities by user
   */
  private countByUser(activities: ActivityLog[]): { [userName: string]: number } {
    return activities.reduce((counts, activity) => {
      counts[activity.userName] = (counts[activity.userName] || 0) + 1;
      return counts;
    }, {} as { [userName: string]: number });
  }

  /**
   * Counts activities by type
   */
  private countByActivityType(activities: ActivityLog[]): { [type: string]: number } {
    return activities.reduce((counts, activity) => {
      counts[activity.activityType] = (counts[activity.activityType] || 0) + 1;
      return counts;
    }, {} as { [type: string]: number });
  }

  /**
   * Gets the most active user
   */
  private getMostActiveUser(userCounts: { [userName: string]: number }): string {
    const maxUser = Object.entries(userCounts).reduce((max, [user, count]) => 
      count > max.count ? { user, count } : max, 
      { user: 'No data', count: 0 }
    );
    return maxUser.user;
  }

  /**
   * Gets the most common activity type
   */
  private getMostCommonActivity(activityTypeCounts: { [type: string]: number }): ActivityType {
    const maxActivity = Object.entries(activityTypeCounts).reduce((max, [type, count]) => 
      count > max.count ? { type: type as ActivityType, count } : max, 
      { type: ActivityType.VIEW, count: 0 }
    );
    return maxActivity.type;
  }
}