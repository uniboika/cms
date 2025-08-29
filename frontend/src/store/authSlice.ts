import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  registrationNumber: string;
  fullName: string;
  email: string;
  role: 'student' | 'school_admin' | 'central_admin';
  category?: 'academics' | 'general' | 'hostel';
  isVerified?: boolean;
  isSuspended?: boolean;
  flagCount?: number;
  // Add other user properties as needed
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Helper to get initial state
const getInitialState = (): AuthState => {
  try {
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { user, token } = JSON.parse(authData);
      return {
        user,
        token,
        isAuthenticated: !!token,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to parse auth data from localStorage', error);
    localStorage.removeItem('auth');
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

console.log('Initial auth state:', getInitialState());

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      console.log('Login start');
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      // Ensure we have valid user data
      if (!action.payload.user || !action.payload.token) {
        console.error('Invalid user or token in loginSuccess:', action.payload);
        state.isLoading = false;
        state.error = 'Invalid user data received';
        return;
      }

      console.log('Login success:', { user: action.payload.user });
      
      // Ensure the user object has all required fields
      const user = {
        ...action.payload.user,
        // Ensure required fields have default values if missing
        id: action.payload.user.id || 0,
        registrationNumber: action.payload.user.registrationNumber || '',
        fullName: action.payload.user.fullName || '',
        email: action.payload.user.email || '',
        role: action.payload.user.role || 'student', // Default role if missing
      };
      
      state.user = user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // Store both user and token in localStorage
      const authData = {
        user,
        token: action.payload.token
      };
      
      console.log('Saving to localStorage:', authData);
      localStorage.setItem('auth', JSON.stringify(authData));
      // Also store token in root of localStorage for apiRequest
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      console.error('Login failed:', action.payload);
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('auth');
    },
    logout: (state) => {
      console.log('Logging out user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      // Clear all auth-related data from localStorage
      localStorage.removeItem('auth');
      localStorage.removeItem('token');
    },
    setAuthFromStorage: (state, action: PayloadAction<{ user: User; token: string }>) => {
      console.log('Setting auth from storage:', action.payload);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  setAuthFromStorage,
  clearError 
} = authSlice.actions;
export default authSlice.reducer;