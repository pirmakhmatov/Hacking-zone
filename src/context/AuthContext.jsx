import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('hackingZoneToken');
        const storedUser = localStorage.getItem('hackingZoneUser');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('hackingZoneToken');
        localStorage.removeItem('hackingZoneUser');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setIsLoading(true);
      setError(null);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        id: Date.now(),
        username,
        email: `${username}@hacking-zone.com`,
        rank: 'Recruit',
        xp: 450,
        level: 1,
        completedLevels: [1, 2],
        badges: ['Web Defender', 'Phish Buster'],
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setUser(mockUser);
      setToken(mockToken);
      
      localStorage.setItem('hackingZoneToken', mockToken);
      localStorage.setItem('hackingZoneUser', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
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
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        id: Date.now(),
        username,
        email,
        rank: 'Recruit',
        xp: 0,
        level: 1,
        completedLevels: [],
        badges: ['Newcomer'],
        joinDate: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      const mockToken = `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setUser(mockUser);
      setToken(mockToken);
      
      localStorage.setItem('hackingZoneToken', mockToken);
      localStorage.setItem('hackingZoneUser', JSON.stringify(mockUser));

      return { success: true, user: mockUser };
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
    const storedUser = localStorage.getItem('hackingZoneUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  const updateUserProgress = async (progressData) => {
    if (!user) return;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUser = {
        ...user,
        ...progressData,
        xp: progressData.xp !== undefined ? progressData.xp : user.xp
      };
      updateUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error updating user progress:', error);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateUser,
    refreshUserData,
    updateUserProgress,
    clearError,
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