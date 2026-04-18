import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { UserListService } from './user-list.service';
import { User, UserListState, UserRole } from './user-list.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  
  private stateSubject = new BehaviorSubject<UserListState>({
    users: [],
    loading: false,
    error: null,
    total: 0
  });

  // Expose state as observable for template
  state$: Observable<UserListState> = this.stateSubject.asObservable();

  // Expose UserRole enum for template usage
  UserRole = UserRole;

  private currentPage = 1;
  private pageSize = 10;

  constructor(private userListService: UserListService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Loads users from the service
   */
  loadUsers(shouldFail: boolean = false): void {
    this.updateState({ loading: true, error: null });

    this.userListService.getUsers(this.currentPage, this.pageSize, shouldFail)
      .pipe(
        takeUntilDestroyed(),
        catchError(error => {
          console.error('Error loading users:', error);
          this.updateState({ 
            loading: false, 
            error: 'Failed to load users. Please try again.' 
          });
          return of(null);
        }),
        finalize(() => {
          this.updateState({ loading: false });
        })
      )
      .subscribe(response => {
        if (response) {
          this.updateState({
            users: response.users,
            total: response.total,
            error: null
          });
        }
      });
  }

  /**
   * Refreshes the user list
   */
  onRefresh(): void {
    this.loadUsers();
  }

  /**
   * Simulates API error for testing error states
   */
  onSimulateError(): void {
    this.loadUsers(true);
  }

  /**
   * Handles click on individual user
   */
  onUserClick(user: User): void {
    console.log('User clicked:', user);
    // In a real application, this might navigate to user detail or emit event
  }

  /**
   * TrackBy function for ngFor optimization
   */
  trackByUserId(index: number, user: User): number {
    return user.id;
  }

  /**
   * Gets the appropriate CSS class for user role badge
   */
  getRoleBadgeClass(role: UserRole): string {
    switch (role) {
      case UserRole.ADMIN:
        return 'badge-admin';
      case UserRole.MODERATOR:
        return 'badge-moderator';
      case UserRole.USER:
      default:
        return 'badge-user';
    }
  }

  /**
   * Formats phone number for display
   */
  formatPhoneNumber(phone?: string): string {
    if (!phone) return 'N/A';
    return phone;
  }

  /**
   * Updates the component state immutably
   */
  private updateState(partialState: Partial<UserListState>): void {
    const currentState = this.stateSubject.value;
    this.stateSubject.next({
      ...currentState,
      ...partialState
    });
  }
}