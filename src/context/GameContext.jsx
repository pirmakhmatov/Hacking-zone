import { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

// Local storage keys
const STORAGE_KEYS = {
  COMPLETED_LEVELS: 'hacking_zone_completed_levels',
  TOTAL_XP: 'hacking_zone_total_xp', 
  LEVEL_PASSWORDS: 'hacking_zone_level_passwords',
  CURRENT_LEVEL: 'hacking_zone_current_level',
  USER_PROFILE: 'hacking_zone_user_profile',
  LEVEL_UNLOCKS: 'hacking_zone_level_unlocks'
};

const initialGameState = {
  currentLevel: 1,
  completedLevels: [],
  totalXP: 0,
  levelPasswords: {},
  levelUnlocks: {},
  userProfile: {
    username: 'Hacker',
    rank: 'Beginner',
    xp: 0,
    badges: [],
    loginStreak: 0,
    lastLogin: null
  },
  isLoading: true,
  error: null
};

function gameReducer(state, action) {
  console.log('🔄 GameReducer action:', action.type, action.payload);
  
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'COMPLETE_LEVEL':
      const levelId = action.payload.level;
      const xpEarned = action.payload.xp;
      const password = action.payload.password;
      
      // Avoid duplicate level completion
      const newCompletedLevels = state.completedLevels.includes(levelId) 
        ? state.completedLevels 
        : [...state.completedLevels, levelId];
      
      // New XP
      const newTotalXP = state.totalXP + xpEarned;
      
      // New rank calculation
      let newRank = 'Beginner';
      if (newTotalXP >= 1000) newRank = 'Cyber Guardian';
      else if (newTotalXP >= 500) newRank = 'Security Expert'; 
      else if (newTotalXP >= 200) newRank = 'Security Specialist';
      else if (newTotalXP >= 100) newRank = 'Security Trainee';
      
      // New current level (unlock next level)
      const newCurrentLevel = Math.max(state.currentLevel, levelId + 1);
      
      // Update level passwords
      const newLevelPasswords = password ? {
        ...state.levelPasswords,
        [levelId + 1]: password
      } : state.levelPasswords;

      // Update level unlocks
      const newLevelUnlocks = {
        ...state.levelUnlocks,
        [levelId]: true,
        [levelId + 1]: true
      };

      const newState = {
        ...state,
        completedLevels: newCompletedLevels,
        totalXP: newTotalXP,
        currentLevel: newCurrentLevel,
        levelPasswords: newLevelPasswords,
        levelUnlocks: newLevelUnlocks,
        userProfile: {
          ...state.userProfile,
          rank: newRank,
          xp: newTotalXP
        }
      };
      
      console.log('✅ New state after COMPLETE_LEVEL:', newState);
      return newState;

    case 'ADD_XP':
      const addedXP = state.totalXP + action.payload;
      
      let updatedRank = 'Beginner';
      if (addedXP >= 1000) updatedRank = 'Cyber Guardian';
      else if (addedXP >= 500) updatedRank = 'Security Expert'; 
      else if (addedXP >= 200) updatedRank = 'Security Specialist';
      else if (addedXP >= 100) updatedRank = 'Security Trainee';
      
      return {
        ...state,
        totalXP: addedXP,
        userProfile: {
          ...state.userProfile,
          xp: addedXP,
          rank: updatedRank
        }
      };

    case 'SET_LEVEL_PASSWORD':
      return {
        ...state,
        levelPasswords: {
          ...state.levelPasswords,
          [action.payload.level]: action.payload.password
        }
      };

    case 'UNLOCK_LEVEL':
      return {
        ...state,
        levelUnlocks: {
          ...state.levelUnlocks,
          [action.payload.level]: true
        }
      };

    case 'LOAD_SAVED_DATA':
      console.log('📥 Loading saved data into state:', action.payload);
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };

    case 'RESET_GAME':
      return {
        ...initialGameState,
        isLoading: false
      };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('🎮 GameProvider mounted - Loading from localStorage...');
    
    const loadFromLocalStorage = () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const completedLevels = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS) || '[]');
        const totalXP = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_XP) || '0');
        const levelPasswords = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_PASSWORDS) || '{}');
        const currentLevel = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL) || '1');
        const userProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || '{}');
        const levelUnlocks = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_UNLOCKS) || '{}');

        console.log('📥 Loaded from localStorage:', {
          completedLevels,
          totalXP, 
          levelPasswords,
          currentLevel,
          levelUnlocks,
          userProfile
        });

        // Ensure level 1 is always unlocked
        const defaultLevelUnlocks = {
          1: true,
          ...levelUnlocks
        };

        const savedData = {
          completedLevels,
          totalXP,
          levelPasswords, 
          currentLevel,
          levelUnlocks: defaultLevelUnlocks,
          userProfile: {
            ...initialGameState.userProfile,
            ...userProfile,
            xp: totalXP,
            rank: userProfile.rank || initialGameState.userProfile.rank
          }
        };

        dispatch({
          type: 'LOAD_SAVED_DATA',
          payload: savedData
        });

      } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadFromLocalStorage();
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (state.isLoading) return;

    console.log('💾 Saving to localStorage:', {
      completedLevels: state.completedLevels,
      totalXP: state.totalXP,
      currentLevel: state.currentLevel,
      levelPasswords: state.levelPasswords,
      levelUnlocks: state.levelUnlocks
    });

    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_LEVELS, JSON.stringify(state.completedLevels));
      localStorage.setItem(STORAGE_KEYS.TOTAL_XP, state.totalXP.toString());
      localStorage.setItem(STORAGE_KEYS.CURRENT_LEVEL, state.currentLevel.toString());
      localStorage.setItem(STORAGE_KEYS.LEVEL_PASSWORDS, JSON.stringify(state.levelPasswords));
      localStorage.setItem(STORAGE_KEYS.LEVEL_UNLOCKS, JSON.stringify(state.levelUnlocks));
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(state.userProfile));
    } catch (error) {
      console.error('❌ Error saving to localStorage:', error);
    }
  }, [state.completedLevels, state.totalXP, state.currentLevel, state.levelPasswords, state.levelUnlocks, state.userProfile, state.isLoading]);

  const actions = {
    completeLevel: (levelId, xp = 100, password = null) => {
      console.log(`🎯 Completing level ${levelId} with ${xp} XP and password:`, password);
      dispatch({
        type: 'COMPLETE_LEVEL', 
        payload: { level: levelId, xp, password }
      });
    },

    addXP: (xp) => {
      console.log(`➕ Adding ${xp} XP`);
      dispatch({ type: 'ADD_XP', payload: xp });
    },

    setLevelPassword: (levelId, password) => {
      console.log(`🔑 Setting password for level ${levelId}: ${password}`);
      dispatch({
        type: 'SET_LEVEL_PASSWORD',
        payload: { level: levelId, password }
      });
    },

    unlockLevel: (levelId) => {
      console.log(`🔓 Unlocking level ${levelId}`);
      dispatch({
        type: 'UNLOCK_LEVEL',
        payload: { level: levelId }
      });
    },

    resetGame: () => {
      console.log('🔄 Resetting game');
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      dispatch({ type: 'RESET_GAME' });
    },

    refreshGameData: () => {
      console.log('🔄 Manually refreshing game data');
      const completedLevels = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS) || '[]');
      const totalXP = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_XP) || '0');
      const levelPasswords = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_PASSWORDS) || '{}');
      const currentLevel = parseInt(localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL) || '1');
      const userProfile = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE) || '{}');
      const levelUnlocks = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_UNLOCKS) || '{}');

      dispatch({
        type: 'LOAD_SAVED_DATA',
        payload: {
          completedLevels,
          totalXP,
          levelPasswords,
          currentLevel,
          levelUnlocks,
          userProfile: {
            ...initialGameState.userProfile,
            ...userProfile,
            xp: totalXP
          }
        }
      });
    },

    debugState: () => {
      console.log('🐛 Current Game State:', state);
      console.log('🐛 LocalStorage State:', {
        completedLevels: JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLETED_LEVELS) || '[]'),
        totalXP: localStorage.getItem(STORAGE_KEYS.TOTAL_XP),
        currentLevel: localStorage.getItem(STORAGE_KEYS.CURRENT_LEVEL),
        levelPasswords: JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_PASSWORDS) || '{}'),
        levelUnlocks: JSON.parse(localStorage.getItem(STORAGE_KEYS.LEVEL_UNLOCKS) || '{}')
      });
    }
  };

  const value = {
    state,
    actions
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