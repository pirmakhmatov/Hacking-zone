// src/context/GameContext.jsx
import { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialGameState = {
  currentLevel: 1,
  completedLevels: [],
  score: 0,
  userProfile: {
    username: 'Hacker',
    rank: 'Beginner',
    xp: 0,
    badges: [],
    loginStreak: 0,
    lastLogin: null
  },
  leaderboard: [],
  isLoading: false,
  error: null
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    
    case 'COMPLETE_LEVEL':
      const newCompletedLevels = [...state.completedLevels, action.payload.level];
      const newScore = state.score + action.payload.points;
      const newLevel = Math.max(state.currentLevel, action.payload.level + 1);
      
      // Update rank based on level
      let newRank = state.userProfile.rank;
      if (newLevel >= 7) newRank = 'Cyber Sentinel';
      else if (newLevel >= 3) newRank = 'Specialist';
      
      return {
        ...state,
        completedLevels: newCompletedLevels,
        score: newScore,
        currentLevel: newLevel,
        userProfile: {
          ...state.userProfile,
          rank: newRank,
          xp: newScore
        }
      };
    
    case 'UPDATE_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload }
      };
    
    case 'ADD_BADGE':
      const newBadges = [...state.userProfile.badges, action.payload];
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          badges: newBadges
        }
      };
    
    case 'UPDATE_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    
    case 'RESET_GAME':
      return {
        ...initialGameState,
        userProfile: {
          ...initialGameState.userProfile,
          username: state.userProfile.username
        }
      };
    
    case 'LOAD_SAVED_DATA':
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Load saved game data from localStorage
  useEffect(() => {
    const savedGameData = localStorage.getItem('hackingZoneGameData');
    if (savedGameData) {
      try {
        const parsedData = JSON.parse(savedGameData);
        dispatch({ type: 'LOAD_SAVED_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved game data:', error);
      }
    }
  }, []);

  // Save game data to localStorage whenever state changes
  useEffect(() => {
    const gameDataToSave = {
      currentLevel: state.currentLevel,
      completedLevels: state.completedLevels,
      score: state.score,
      userProfile: state.userProfile
    };
    localStorage.setItem('hackingZoneGameData', JSON.stringify(gameDataToSave));
  }, [state]);

  const completeLevel = async (levelId, points = 100) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({
        type: 'COMPLETE_LEVEL',
        payload: {
          level: levelId,
          points: points
        }
      });
      
      // Add badge for certain achievements
      if (levelId === 1) {
        dispatch({
          type: 'ADD_BADGE',
          payload: {
            id: 'firewall_master',
            name: 'Firewall Master',
            description: 'Completed the Firewall Gate level',
            earnedAt: new Date().toISOString(),
            icon: '🛡️'
          }
        });
      } else if (levelId === 5) {
        dispatch({
          type: 'ADD_BADGE',
          payload: {
            id: 'network_scout',
            name: 'Network Scout',
            description: 'Completed the Port Scanner level',
            earnedAt: new Date().toISOString(),
            icon: '🌐'
          }
        });
      } else if (levelId === 10) {
        dispatch({
          type: 'ADD_BADGE',
          payload: {
            id: 'cyber_guardian',
            name: 'Cyber Guardian',
            description: 'Completed all levels',
            earnedAt: new Date().toISOString(),
            icon: '🏆'
          }
        });
      }
      
      return { success: true, message: 'Level completed successfully!' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUserProfile = (profileData) => {
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: profileData
    });
  };

  const addXP = (xpAmount) => {
    const newScore = state.score + xpAmount;
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        xp: newScore
      }
    });
    return newScore;
  };

  const unlockNextLevel = () => {
    const nextLevel = state.currentLevel + 1;
    dispatch({
      type: 'UPDATE_PROFILE',
      payload: {
        currentLevel: nextLevel
      }
    });
    return nextLevel;
  };

  const resetGameProgress = () => {
    dispatch({ type: 'RESET_GAME' });
    localStorage.removeItem('hackingZoneGameData');
  };

  const getLevelProgress = (levelId) => {
    return {
      isCompleted: state.completedLevels.includes(levelId),
      isUnlocked: levelId <= state.currentLevel,
      canPlay: levelId <= state.currentLevel
    };
  };

  // FIXED: getGameStats function qo'shildi
  const getGameStats = () => {
    const totalLevels = 10;
    const completedCount = state.completedLevels.length;
    const completionPercentage = Math.round((completedCount / totalLevels) * 100);
    
    return {
      totalLevels,
      completedCount,
      completionPercentage,
      currentRank: state.userProfile.rank,
      totalXP: state.score,
      badgesCount: state.userProfile.badges.length,
      loginStreak: state.userProfile.loginStreak
    };
  };

  const value = {
    state,
    dispatch,
    actions: {
      completeLevel,
      updateUserProfile,
      addXP,
      unlockNextLevel,
      resetGameProgress,
      getLevelProgress,
      getGameStats // FIXED: Bu function qo'shildi
    }
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};