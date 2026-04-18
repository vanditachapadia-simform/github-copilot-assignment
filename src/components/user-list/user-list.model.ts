export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
}

export interface UserApiResponse {
  users: User[];
  total: number;
  page: number;
  pageSize: number;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export interface UserListState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
}