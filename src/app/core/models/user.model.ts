// src/app/core/models/user.model.ts
export type UserRole = 'STUDENT' | 'TUTOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
