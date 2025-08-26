export interface User {
  id: number;
  registrationNumber: string;
  email: string;
  role: 'student' | 'school_admin' | 'central_admin';
  category?: 'academics' | 'general' | 'hostel';
  flagCount: number;
  isSuspended: boolean;
  isVerified: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    this.user = userData ? JSON.parse(userData) : null;
  }

  setAuth(authData: AuthResponse) {
    this.token = authData.token;
    this.user = authData.user;
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('auth_user', JSON.stringify(authData.user));
  }

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.user !== null;
  }

  getAuthHeaders() {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }
}

export const authService = new AuthService();
