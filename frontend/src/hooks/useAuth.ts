import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { loginStart, loginSuccess, loginFailure, logout, setAuthFromStorage, clearError } from '@/store/authSlice';
import { useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user, token, isAuthenticated, isLoading, error } = useSelector((state: RootState) => state.auth);

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      toast({
        title: 'Authentication Error',
        description: error,
        variant: 'destructive',
        className: 'bg-red-500 text-white'
      });
      // Clear error after showing it
      dispatch(clearError());
    }
  }, [error, toast, dispatch]);

  // Check if user is already logged in on app load
  useEffect(() => {
    console.log('Running auth check...');
    const verifyToken = async () => {
      try {
        const authData = localStorage.getItem('auth');
        console.log('Auth data from localStorage:', authData);
        
        if (!authData) {
          console.log('No auth data found in localStorage');
          return;
        }
        
        const parsedAuth = JSON.parse(authData);
        const storedToken = parsedAuth?.token;
        
        if (!storedToken) {
          console.log('No token found in auth data');
          return;
        }
        
        console.log('Found stored token, verifying...');
        
        try {
          // Set the token in localStorage for the apiRequest function
          localStorage.setItem('token', storedToken);
          const response = await apiRequest('GET', '/api/auth/me');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const responseData = await response.json();
          console.log('User data from /me endpoint:', responseData);
          
          // Handle both nested user object and direct response
          const userData = responseData.user || responseData;
          
          // Handle Sequelize response structure
          const user = userData.dataValues || userData;
          
          if (!user || !user.role) {
            throw new Error('Invalid user data received from server');
          }
          
          console.log('Dispatching loginSuccess with user:', user);
          dispatch(loginSuccess({ 
            user,
            token: storedToken 
          }));
        } finally {
          // Always clean up the token from localStorage
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('auth');
        dispatch(logout());
      }
    };

    verifyToken();
  }, [dispatch]);

  const login = async (credentials: { registrationNumber: string; password: string }) => {
    dispatch(loginStart());
    try {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      // Parse the response data
      const responseData = await response.json();
      console.log('Login response data:', responseData);
      
      console.log('Raw login response data:', responseData);
      
      // Handle the response format from the backend
      // The token might be at the root level or inside dataValues
      let token = responseData.token;
      let userData = responseData.dataValues || responseData;
      
      // If we have a nested user object, use that
      if (responseData.user) {
        userData = responseData.user.dataValues || responseData.user;
      }
      
      console.log('Extracted token:', token);
      console.log('Extracted user data:', userData);
      
      if (!userData || !token) {
        console.error('Invalid response data:', { userData, token });
        throw new Error('Invalid response from server: missing user data or token');
      }
      
      // Ensure the user object has the required fields
      if (!userData.role) {
        console.error('User data is missing role:', userData);
        throw new Error('User role is missing in the response');
      }
      
      // Ensure all required user fields have values
      const user = {
        id: userData.id,
        registrationNumber: userData.registrationNumber || '',
        fullName: userData.fullName || '',
        email: userData.email || '',
        role: userData.role,
        category: userData.category,
        isVerified: userData.isVerified,
        isSuspended: userData.isSuspended
      };
      
      console.log('Dispatching login with user:', user);
      
      // Update the auth state with the user data
      dispatch(loginSuccess({ 
        user,
        token
      }));
      
      // Force a state update to ensure the UI updates
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      dispatch(loginFailure(error.message || 'Login failed'));
      throw error;
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
  };
};