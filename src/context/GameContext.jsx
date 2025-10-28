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
      return { ...state, isLoading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'COMPLETE_LEVEL':
      const newCompletedLevels = [...state.completedLevels, action.payload.level];
      const newScore = state.score + action.payload.points;
      const newLevel = Math.max(state.currentLevel, action.payload.level + 1);
      let newRank = state.userProfile.rank;
      if (newLevel >= 7) newRank = 'Cyber Sentinel';
      else if (newLevel >= 3) newRank = 'Specialist';
      
      return {
        ...state,
        completedLevels: newCompletedLevels,
        score: newScore,
        currentLevel: newLevel,
        userProfile: { ...state.userProfile, rank: newRank, xp: newScore }
      };
    case 'UPDATE_PROFILE':
      return { ...state, userProfile: { ...state.userProfile, ...action.payload } };
    case 'ADD_BADGE':
      const newBadges = [...state.userProfile.badges, action.payload];
      return { ...state, userProfile: { ...state.userProfile, badges: newBadges } };
    case 'RESET_GAME':
      return {
        ...initialGameState,
        userProfile: { ...initialGameState.userProfile, username: state.userProfile.username }
      };
    case 'LOAD_SAVED_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      dispatch({
        type: 'COMPLETE_LEVEL',
        payload: { level: levelId, points: points }
      });
      
      return { success: true, message: 'Level completed successfully!' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

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
    actions: {
      completeLevel,
      getGameStats
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