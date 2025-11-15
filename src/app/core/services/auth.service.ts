import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:4000/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'estudiante' | 'tutor';
  studyLevel?: string;
  bio?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'myteacher_auth';

  constructor(private http: HttpClient) {}

  register(data: {
    name: string;
    email: string;
    password: string;
    role: 'estudiante' | 'tutor';
    studyLevel?: string;
    bio?: string;
  }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/register`, data)
      .pipe(tap(res => this.saveSession(res)));
  }

  login(data: { email: string; password: string; role: 'estudiante' | 'tutor' }): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${API_URL}/auth/login`, data)
      .pipe(tap(res => this.saveSession(res)));
  }

  private saveSession(res: AuthResponse) {
    localStorage.setItem(this.storageKey, JSON.stringify(res));
  }

  get token(): string | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    return (JSON.parse(raw) as AuthResponse).token;
  }

  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return null;
    return (JSON.parse(raw) as AuthResponse).user;
  }

  logout() {
    localStorage.removeItem(this.storageKey);
  }
}
