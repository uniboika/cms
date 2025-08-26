import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { loginSuccess, logout, setAuthFromStorage } from '@/store/authSlice';
import { useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user is already logged in on app load
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isAuthenticated) {
      // Verify token with backend
      apiRequest('GET', '/api/auth/me')
        .then(async (response) => {
          const data = await response.json();
          dispatch(setAuthFromStorage({ 
            user: data.user, 
            token: storedToken 
          }));
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        });
    }
  }, [dispatch, isAuthenticated]);

  const login = (userData: any, authToken: string) => {
    dispatch(loginSuccess({ user: userData, token: authToken }));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout: logoutUser,
  };
};