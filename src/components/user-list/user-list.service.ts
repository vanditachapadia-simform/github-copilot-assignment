import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { User, UserApiResponse, UserRole } from './user-list.model';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  private mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1-555-0123',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date('2023-01-15')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1-555-0124',
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date('2023-02-20')
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      role: UserRole.MODERATOR,
      isActive: false,
      createdAt: new Date('2023-03-10')
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '+1-555-0126',
      role: UserRole.USER,
      isActive: true,
      createdAt: new Date('2023-04-05')
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@example.com',
      phone: '+1-555-0127',
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date('2023-05-12')
    }
  ];

  /**
   * Fetches users from the mock API
   * Simulates network delay and potential errors
   */
  getUsers(page: number = 1, pageSize: number = 10, shouldFail: boolean = false): Observable<UserApiResponse> {
    // Simulate API call with delay
    const simulateApiCall = () => {
      if (shouldFail || Math.random() < 0.1) { // 10% chance of random failure
        return throwError(() => new Error('Failed to fetch users from API'));
      }

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedUsers = this.mockUsers.slice(startIndex, endIndex);

      const response: UserApiResponse = {
        users: paginatedUsers,
        total: this.mockUsers.length,
        page,
        pageSize
      };

      return of(response);
    };

    return simulateApiCall().pipe(
      delay(500) // Simulate network latency
    );
  }

  /**
   * Gets a specific user by ID
   */
  getUserById(id: number): Observable<User | null> {
    const user = this.mockUsers.find(u => u.id === id) || null;
    return of(user).pipe(delay(300));
  }

  /**
   * Searches users by name or email
   */
  searchUsers(query: string): Observable<User[]> {
    const filteredUsers = this.mockUsers.filter(user =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
    );
    
    return of(filteredUsers).pipe(delay(400));
  }
}