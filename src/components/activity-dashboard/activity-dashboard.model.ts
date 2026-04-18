export interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  activityType: ActivityType;
  description: string;
  timestamp: Date;
  duration?: number; // in minutes
  metadata?: { [key: string]: any };
}

export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
}

export interface DailyActivityData {
  date: string;
  value: number;
  label?: string;
}

export interface WeeklyTrendData {
  name: string;
  value: number;
  date: Date;
}

export interface ChartDataset {
  name: string;
  series: Array<{
    name: string;
    value: number;
    extra?: any;
  }>;
}

export interface ActivityFilters {
  startDate: Date | null;
  endDate: Date | null;
  selectedUserId: number | null;
  activityType: ActivityType | null;
}

export interface ActivityDashboardState {
  activities: ActivityLog[];
  users: User[];
  dailyData: ChartDataset[];
  weeklyData: ChartDataset[];
  loading: boolean;
  error: string | null;
  filters: ActivityFilters;
}

export interface ActivitySummary {
  totalActivities: number;
  totalDuration: number;
  averageDuration: number;
  mostActiveUser: string;
  mostCommonActivity: ActivityType;
}

export enum ActivityType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  DOWNLOAD = 'download',
  UPLOAD = 'upload',
  EXPORT = 'export'
}

export interface ExportData {
  fileName: string;
  data: any[];
  headers: string[];
}