// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIXED: process.env removed, direct URL used
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('hackingZoneToken');
        const storedUser = localStorage.getItem('hackingZoneUser');

        if (storedToken && storedUser) {
          // Verify token is still valid
          const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setToken(storedToken);
            setUser(data.data.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('hackingZoneToken');
            localStorage.removeItem('hackingZoneUser');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid tokens on error
        localStorage.removeItem('hackingZoneToken');
        localStorage.removeItem('hackingZoneUser');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [API_URL]);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.data.user);
      setToken(data.token);
      
      localStorage.setItem('hackingZoneToken', data.token);
      localStorage.setItem('hackingZoneUser', JSON.stringify(data.data.user));

      return { success: true, user: data.data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username, email, password, confirmPassword) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setUser(data.data.user);
      setToken(data.token);
      
      localStorage.setItem('hackingZoneToken', data.token);
      localStorage.setItem('hackingZoneUser', JSON.stringify(data.data.user));

      return { success: true, user: data.data.user };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setError(null);
    
    localStorage.removeItem('hackingZoneToken');
    localStorage.removeItem('hackingZoneUser');
    localStorage.removeItem('hackingZoneGameData');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('hackingZoneUser', JSON.stringify(userData));
  };

  const refreshUserData = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.data.user);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const updateUserProgress = async (progressData) => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/auth/update-progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.data.user);
        return { success: true, user: data.data.user };
      } else {
        throw new Error('Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Actions
    login,
    signup,
    logout,
    updateUser,
    refreshUserData,
    updateUserProgress,
    clearError,
    
    // Computed values
    isAuthenticated: !!user && !!token,
    userRank: user?.rank || 'Recruit',
    userXP: user?.xp || 0,
    userLevel: user?.level || 1
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};