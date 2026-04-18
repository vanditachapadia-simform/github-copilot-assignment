import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, map, switchMap, catchError, finalize, of } from 'rxjs';
import { ActivityDashboardService } from './activity-dashboard.service';
import { 
  ActivityDashboardState, 
  ActivityFilters, 
  ActivityType, 
  User,
  ActivitySummary,
  ChartDataset,
  ExportData
} from './activity-dashboard.model';

@Component({
  selector: 'app-activity-dashboard',
  templateUrl: './activity-dashboard.component.html',
  styleUrls: ['./activity-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDashboardComponent implements OnInit {

  private stateSubject = new BehaviorSubject<ActivityDashboardState>({
    activities: [],
    users: [],
    dailyData: [],
    weeklyData: [],
    loading: false,
    error: null,
    filters: {
      startDate: this.getDefaultStartDate(),
      endDate: new Date(),
      selectedUserId: null,
      activityType: null
    }
  });

  // Expose state as observable for template
  state$: Observable<ActivityDashboardState> = this.stateSubject.asObservable();

  // Summary data observable
  summary$: Observable<ActivitySummary | null> = this.state$.pipe(
    switchMap(state => {
      if (state.loading) return of(null);
      return this.activityService.getActivitySummary(state.filters);
    })
  );

  // Expose enums for template
  ActivityType = ActivityType;
  activityTypes = Object.values(ActivityType);

  constructor(private activityService: ActivityDashboardService) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.setupFilterSubscription();
  }

  /**
   * Updates date range filter
   */
  onDateRangeChange(startDate: Date | null, endDate: Date | null): void {
    const currentState = this.stateSubject.value;
    this.updateState({
      filters: {
        ...currentState.filters,
        startDate,
        endDate
      }
    });
  }

  /**
   * Handles start date change event
   */
  onStartDateChange(event: any): void {
    const value = event.target.value;
    const startDate = value ? new Date(value) : null;
    const currentState = this.stateSubject.value;
    this.updateState({
      filters: {
        ...currentState.filters,
        startDate
      }
    });
  }

  /**
   * Handles end date change event
   */
  onEndDateChange(event: any): void {
    const value = event.target.value;
    const endDate = value ? new Date(value) : null;
    const currentState = this.stateSubject.value;
    this.updateState({
      filters: {
        ...currentState.filters,
        endDate
      }
    });
  }

  /**
   * Updates user filter
   */
  onUserFilterChange(userId: number | null): void {
    const currentState = this.stateSubject.value;
    this.updateState({
      filters: {
        ...currentState.filters,
        selectedUserId: userId
      }
    });
  }

  /**
   * Updates activity type filter
   */
  onActivityTypeFilterChange(activityType: ActivityType | null): void {
    const currentState = this.stateSubject.value;
    this.updateState({
      filters: {
        ...currentState.filters,
        activityType
      }
    });
  }

  /**
   * Resets all filters to defaults
   */
  resetFilters(): void {
    this.updateState({
      filters: {
        startDate: this.getDefaultStartDate(),
        endDate: new Date(),
        selectedUserId: null,
        activityType: null
      }
    });
  }

  /**
   * Exports current filtered data to CSV
   */
  onExportToCsv(): void {
    const currentState = this.stateSubject.value;
    
    this.activityService.exportToCsv(currentState.filters)
      .pipe(takeUntilDestroyed())
      .subscribe(exportData => {
        this.downloadCsv(exportData);
      });
  }

  /**
   * Chart selection handler
   */
  onChartSelect(event: any): void {
    console.log('Chart data selected:', event);
  }

  /**
   * Chart activation handler
   */
  onChartActivate(event: any): void {
    console.log('Chart activated:', event);
  }

  /**
   * Gets display name for activity type
   */
  getActivityTypeDisplayName(type: ActivityType): string {
    const displayNames = {
      [ActivityType.LOGIN]: 'Login',
      [ActivityType.LOGOUT]: 'Logout',
      [ActivityType.CREATE]: 'Create',
      [ActivityType.UPDATE]: 'Update',
      [ActivityType.DELETE]: 'Delete',
      [ActivityType.VIEW]: 'View',
      [ActivityType.DOWNLOAD]: 'Download',
      [ActivityType.UPLOAD]: 'Upload',
      [ActivityType.EXPORT]: 'Export'
    };
    return displayNames[type];
  }

  /**
   * Formats duration for display
   */
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  /**
   * Gets the maximum value from chart data for scaling
   */
  getMaxValue(series: any[]): number {
    if (!series || series.length === 0) return 100;
    return Math.max(...series.map(item => item.value));
  }

  /**
   * Calculates bar height percentage for custom bar chart
   */
  getBarHeight(value: number, maxValue: number): number {
    if (maxValue === 0) return 0;
    return Math.max((value / maxValue) * 100, 5); // Minimum 5% height for visibility
  }

  /**
   * Generates SVG path for line chart
   */
  getLineChartPath(series: any[]): string {
    if (!series || series.length === 0) return '';
    
    const maxValue = this.getMaxValue(series);
    const points = series.slice(0, 6).map((item, index) => {
      const x = this.getLineChartX(index, series.length);
      const y = this.getLineChartY(item.value, maxValue);
      return `${x},${y}`;
    });
    
    return `M ${points.join(' L ')}`;
  }

  /**
   * Calculates X coordinate for line chart
   */
  getLineChartX(index: number, totalPoints: number): number {
    const chartWidth = 380; // SVG width minus padding
    const stepWidth = chartWidth / Math.max(totalPoints - 1, 1);
    return 10 + (index * stepWidth); // 10px padding
  }

  /**
   * Calculates Y coordinate for line chart
   */
  getLineChartY(value: number, maxValue: number): number {
    const chartHeight = 180; // SVG height minus padding
    const normalizedValue = maxValue > 0 ? (value / maxValue) : 0;
    return 10 + (chartHeight * (1 - normalizedValue)); // Inverted Y (SVG coordinates)
  }

  /**
   * TrackBy function for ngFor optimization
   */
  trackByActivityId(index: number, activity: any): number {
    return activity.id;
  }

  /**
   * Loads initial data (users and activities) - public for template access
   */
  loadInitialData(): void {
    this.updateState({ loading: true, error: null });

    this.activityService.getUsers()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.updateState({ loading: false }))
      )
      .subscribe({
        next: users => {
          this.updateState({ users });
          this.loadDashboardData();
        },
        error: error => {
          console.error('Error loading users:', error);
          this.updateState({ error: 'Failed to load dashboard data. Please try again.' });
        }
      });
  }

  /**
   * Sets up subscription to filter changes
   */
  private setupFilterSubscription(): void {
    this.state$.pipe(
      map(state => state.filters),
      takeUntilDestroyed()
    ).subscribe(() => {
      this.loadDashboardData();
    });
  }

  /**
   * Loads chart data based on current filters
   */
  private loadDashboardData(): void {
    const currentState = this.stateSubject.value;
    
    if (currentState.loading) return;

    this.updateState({ loading: true, error: null });

    // Load both daily and weekly data in parallel
    combineLatest([
      this.activityService.getDailyActivityData(currentState.filters),
      this.activityService.getWeeklyTrendData(currentState.filters),
      this.activityService.getActivities(currentState.filters)
    ]).pipe(
      takeUntilDestroyed(),
      catchError(error => {
        console.error('Error loading dashboard data:', error);
        this.updateState({ 
          loading: false, 
          error: 'Failed to load dashboard data. Please try again.' 
        });
        return of([[], [], []]);
      }),
      finalize(() => this.updateState({ loading: false }))
    ).subscribe(([dailyData, weeklyData, activities]) => {
      this.updateState({
        dailyData,
        weeklyData,
        activities,
        error: null
      });
    });
  }

  /**
   * Gets default start date (30 days ago)
   */
  private getDefaultStartDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  }

  /**
   * Updates the component state immutably
   */
  private updateState(partialState: Partial<ActivityDashboardState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      ...partialState
    });
  }

  /**
   * Downloads CSV file
   */
  private downloadCsv(exportData: ExportData): void {
    const csvContent = this.convertToCsv(exportData.headers, exportData.data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', exportData.fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Converts data to CSV format
   */
  private convertToCsv(headers: string[], data: any[][]): string {
    const csvArray = [headers, ...data];
    return csvArray.map(row => 
      row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  }
}