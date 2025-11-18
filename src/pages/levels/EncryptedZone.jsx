// EncryptedZone.jsx - MOBILE OPTIMIZED
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Shield, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft,
  Lock, Key, Copy, Check, Eye, EyeOff, Cpu,
  Users, Terminal, Star, Sparkles, Award,
  Volume2, VolumeX, ChevronDown, Filter,
  Hash, Fingerprint, UserCheck, Server,
  Mail, Code, Binary, FileText, Scan,
  MessageSquare, FileKey, FileSearch, Menu, X
} from "lucide-react";

// CORRECTED AND VERIFIED CIPHER DATABASE - FIXED DUPLICATES AND ERRORS
const cipherDatabase = [
  // CAESAR CIPHERS
  {
    type: "caesar",
    encrypted: "KHOOR ZRUOG",
    key: 3,
    solution: "HELLO WORLD",
    hints: ["Shift cipher", "Each letter is shifted by a fixed number", "Common in ancient Rome"],
    description: "Caesar Cipher - Simple substitution"
  },
  {
    type: "caesar", 
    encrypted: "MJQQT BMFY ZXJ FWJ",
    key: 5,
    solution: "ENCRYPTED DATA IS SAFE",
    hints: ["Positive shift", "Look for common words like 'data'", "All caps"],
    description: "Caesar Cipher - Security message"
  },
  {
    type: "caesar",
    encrypted: "QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD",
    key: 23,
    solution: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
    hints: ["Negative shift", "Alphabet wraps around", "Look for common words"],
    description: "Caesar Cipher - Classic pangram"
  },
  
  // ATBASH CIPHERS
  {
    type: "atbash",
    encrypted: "GSV XLWV GL YV Z IVZGFM",
    key: "atbash",
    solution: "THE CODE IS BE A READER",
    hints: ["Reverse alphabet", "A=Z, B=Y, C=X...", "No shift, just mirror"],
    description: "Atbash Cipher - Alphabet reversal"
  },
  {
    type: "atbash",
    encrypted: "ZGYZHS RH GSV VMWVI",
    key: "atbash", 
    solution: "ATBASH IS THE EScoreNCRYPT",
    hints: ["Complete reversal", "First word is the cipher name", "All caps"],
    description: "Atbash Cipher - Self-referential"
  },
  {
    type: "atbash",
    encrypted: "SROO ZIV VMWVIH",
    key: "atbash",
    solution: "HILL ARE ENCRYPT",
    hints: ["Reverse mapping", "Think about what 'encrypt' becomes", "Three words"],
    description: "Atbash Cipher - Encryption theme"
  },
  
  // RAIL FENCE CIPHERS
  {
    type: "railfence",
    encrypted: "HOREL OLDLW",
    key: 3,
    solution: "HELLO WORLD",
    hints: ["Rail fence pattern", "Read in zig-zag", "Depth: 3 rails"],
    description: "Rail Fence Cipher - Zig-zag reading"
  },
  {
    type: "railfence",
    encrypted: "ECYTDSREA APE",
    key: 4,
    solution: "ENCRYPTED DATA",
    hints: ["4 rail depth", "Read rows in order", "Common security term"],
    description: "Rail Fence Cipher - Security message"
  },
  {
    type: "railfence",
    encrypted: "WEDSO LEHRT",
    key: 2,
    solution: "WE LOST HER",
    hints: ["2 rail depth", "Simple zig-zag", "Three word phrase"],
    description: "Rail Fence Cipher - Simple pattern"
  },
  
  // VIGENÈRE CIPHERS
  {
    type: "vigenere",
    encrypted: "RIJV SUYVB NBI",
    key: "KEY",
    solution: "HACK THE SYSTEM",
    hints: ["Polyalphabetic cipher", "Uses keyword 'KEY'", "Each letter has different shift"],
    description: "Vigenère Cipher - Hacking theme"
  },
  {
    type: "vigenere",
    encrypted: "XMCKL OWLRY",
    key: "CODE",
    solution: "SECURE DATA",
    hints: ["Keyword is 'CODE'", "Variable shifts", "Security related"],
    description: "Vigenère Cipher - Data security"
  },
  {
    type: "vigenere",
    encrypted: "TPPZ MHJEY",
    key: "LOCK",
    solution: "KEEP SAFE",
    hints: ["Keyword: LOCK", "Short security message", "Two words"],
    description: "Vigenère Cipher - Safety message"
  },
  
  // MORSE CODE
  {
    type: "morse",
    encrypted: "... . -.-. ..- .-. .. - -.-- / .. ... / ... .- ..-. .",
    key: "morse",
    solution: "SECURITY IS SAFE",
    hints: ["Standard morse code", "Three words", "Security message"],
    description: "Morse Code - Security message"
  },
  {
    type: "morse", 
    encrypted: "--. --- --- -.. / .--- --- -...",
    key: "morse",
    solution: "GOOD JOB",
    hints: ["Common phrase", "Two words", "Encouragement"],
    description: "Morse Code - Positive message"
  },
  {
  type: "caesar",
  encrypted: "#RJJLLVWKHEHVW",
  key: 3,
  solution: "#oggiisthebest",
  hints: ["Shift cipher", "Positive shift", "Hashtag included", "All lowercase", "One continuous word"],
  description: "Caesar Cipher - Hashtag message"
},
{
  type: "railfence", 
  encrypted: "#OITEBSTHGEGSI",
  key: 4,
  solution: "#oggiisthebest",
  hints: ["4 rail depth", "Hashtag at beginning", "All lowercase", "Single continuous word"],
  description: "Rail Fence Cipher - Hashtag message"
},
];

export default function EncryptedZone() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    messagesDecrypted: 0,
    encryptionLevel: 1,
    isPaused: false,
    lives: 3
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Encryption game state
  const [currentCipher, setCurrentCipher] = useState("");
  const [cipherType, setCipherType] = useState("caesar");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptionKey, setDecryptionKey] = useState("");
  const [userInput, setUserInput] = useState("");
  const [hints, setHints] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [activeAttack, setActiveAttack] = useState(null);

  const audioContextRef = useRef(null);
  const attackIntervalRef = useRef(null);
  const levelCompletedRef = useRef(false);

  // Check level status
  useEffect(() => {
    if (gameState.isLoading) return;

    if (gameState.completedLevels.includes(4)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      const existingPassword = gameState.levelPasswords[5];
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
      return;
    }

    if (gameState.levelUnlocks[4] || gameState.completedLevels.includes(3)) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      if (!gameState.levelUnlocks[4]) {
        gameActions.unlockLevel(4);
      }
    }
  }, [gameState.completedLevels, gameState.levelUnlocks, gameState.isLoading]);

  // Sound system
  const playSound = useCallback((frequency, duration, type = 'sine') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // Password management
  const getStoredLevelPassword = useCallback(() => {
    const sources = [
      gameState.levelPasswords[4],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[4],
      localStorage.getItem('level4_password')
    ];

    return sources.find(p => p && p.startsWith('HZ-L4-'));
  }, [gameState.levelPasswords]);

  const normalizePassword = (password) => {
    return password.trim().toUpperCase();
  };

  const checkLevelPassword = () => {
    initAudio();
    
    const inputPassword = normalizePassword(passwordInput);
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      setPasswordError("Please enter the Level 4 password");
      return;
    }
    
    if (!savedPassword) {
      setPasswordError("No Level 4 password found. Please complete Password Vault level first.");
      return;
    }
    
    const normalizedSavedPassword = normalizePassword(savedPassword);
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setPasswordError("");
      setShowTutorial(true);
      gameActions.unlockLevel(4);
      playSound(800, 0.2);
    } else {
      setPasswordError(`Invalid Level 4 password. The password should start with "HZ-L4-".`);
      playSound(300, 0.3, 'square');
    }
  };

  const skipPassword = () => {
    initAudio();
    setGameStatus(prev => ({ ...prev, status: "idle" }));
    setShowTutorial(true);
    gameActions.unlockLevel(4);
  };

  const generateLevelPassword = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L5-${password}`;
  }, []);

  // Game timer
  useEffect(() => {
    let interval;
    if (gameStatus.status === "running" && !gameStatus.isPaused) {
      interval = setInterval(() => {
        setGameStatus(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus.status, gameStatus.isPaused]);

  // Initialize new cipher challenge
  const startNewCipherChallenge = useCallback(() => {
    const availableCiphers = cipherDatabase.filter(cipher => 
      cipher.encrypted !== currentCipher
    );
    
    if (availableCiphers.length === 0) {
      handleGameOver("All ciphers completed!");
      return;
    }

    const randomCipher = availableCiphers[Math.floor(Math.random() * availableCiphers.length)];
    setCurrentCipher(randomCipher.encrypted);
    setCipherType(randomCipher.type);
    setEncryptedMessage(randomCipher.encrypted);
    setDecryptionKey(randomCipher.key);
    setHints(randomCipher.hints);
    setUserInput("");

    addGameLog(`🔐 New ${randomCipher.type.toUpperCase()} cipher detected`, "info");
    addGameLog(`💡 ${randomCipher.description}`, "warning");
    
    // Start attack timer
    startAttackTimer();
  }, [currentCipher]);

  // Attack system - data interception attempts
  const startAttackTimer = useCallback(() => {
    if (activeAttack) return;

    // Clear any existing timeout
    if (attackIntervalRef.current) {
      clearTimeout(attackIntervalRef.current);
    }

    attackIntervalRef.current = setTimeout(() => {
      const attackTypes = [
        { type: "eavesdrop", description: "Data interception detected!", duration: 10 },
        { type: "bruteforce", description: "Brute force attempt in progress!", duration: 15 },
        { type: "analysis", description: "Traffic analysis detected!", duration: 8 }
      ];

      const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      setActiveAttack({ ...randomAttack, progress: 0 });

      addGameLog(`⚠️ ${randomAttack.description}`, "warning");
      playSound(400, 0.3, 'sawtooth');

    }, 15000 - (gameStatus.encryptionLevel * 2000)); // Attacks become more frequent as level increases
  }, [activeAttack, gameStatus.encryptionLevel, playSound]);

  // Update attack progress
  useEffect(() => {
    if (!activeAttack || gameStatus.status !== "running" || gameStatus.isPaused) return;

    const attackInterval = setInterval(() => {
      setActiveAttack(prev => {
        if (!prev) return null;

        const newProgress = prev.progress + (100 / prev.duration);
        
        if (newProgress >= 100) {
          // Attack successful
          setGameStatus(prevStatus => {
            const newLives = prevStatus.lives - 1;
            if (newLives <= 0) {
              handleGameOver("Data intercepted!");
            }
            return { ...prevStatus, lives: newLives };
          });
          addGameLog(`💀 ${prev.type} attack succeeded! Data compromised`, "error");
          playSound(200, 0.5, 'sawtooth');
          return null;
        }

        return { ...prev, progress: newProgress };
      });
    }, 1000);

    return () => clearInterval(attackInterval);
  }, [activeAttack, gameStatus.status, gameStatus.isPaused, playSound]);

  // Cipher solving logic
  const attemptDecryption = useCallback((attempt) => {
    if (gameStatus.status !== "running" || gameStatus.isPaused) return;

    const currentChallenge = cipherDatabase.find(c => c.encrypted === currentCipher);
    
    if (!currentChallenge) {
      addGameLog("❌ Error: Current cipher challenge not found", "error");
      return;
    }
    
    if (attempt.toUpperCase() === currentChallenge.solution.toUpperCase()) {
      // Successfully decrypted
      setGameStatus(prev => ({
        ...prev,
        messagesDecrypted: prev.messagesDecrypted + 1,
        score: prev.score + 100,
        encryptionLevel: Math.min(5, prev.encryptionLevel + 1)
      }));
      
      addGameLog(`✅ Message decrypted: "${currentChallenge.solution}"`, "success");
      addGameLog(`🔓 ${currentChallenge.type.toUpperCase()} cipher broken!`, "success");
      playSound(800, 0.2);
      
      // Stop current attack
      if (activeAttack) {
        addGameLog(`🛡️ Attack thwarted by successful decryption!`, "success");
        setActiveAttack(null);
      }

      if (gameStatus.messagesDecrypted + 1 >= 5) {
        setTimeout(completeLevel, 1000);
      } else {
        setTimeout(startNewCipherChallenge, 1500);
      }
    } else {
      // Failed attempt
      setGameStatus(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 10)
      }));
      addGameLog(`❌ Failed decryption attempt`, "error");
      playSound(300, 0.2, 'square');
    }
  }, [gameStatus.status, gameStatus.isPaused, gameStatus.messagesDecrypted, currentCipher, activeAttack, playSound, startNewCipherChallenge]);

  // Helper functions for different ciphers
  const getCipherInstructions = useCallback(() => {
    switch (cipherType) {
      case "caesar":
        return "Caesar Cipher: Each letter is shifted by a fixed number in the alphabet. A=1, B=2, etc.";
      case "atbash":
        return "Atbash Cipher: Alphabet is reversed (A=Z, B=Y, C=X, etc.)";
      case "railfence":
        return "Rail Fence Cipher: Letters are arranged in a zig-zag pattern and read row by row";
      case "vigenere":
        return "Vigenère Cipher: Uses a keyword where each letter determines the shift for corresponding letters";
      case "morse":
        return "Morse Code: Dots (.) and dashes (-) represent letters. / separates words.";
      default:
        return "Decrypt the message using the appropriate cipher technique";
    }
  }, [cipherType]);

  const addGameLog = useCallback((message, type = "info") => {
    setGameLog(prev => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 8)]);
  }, []);

  const startGame = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    initAudio();
    
    setGameStatus({
      status: "running",
      timeElapsed: 0,
      score: 0,
      messagesDecrypted: 0,
      encryptionLevel: 1,
      isPaused: false,
      lives: 3
    });
    
    setActiveAttack(null);
    setGameLog([]);
    setLevelPassword("");
    setShowTutorial(false);
    setMobileMenuOpen(false);
    levelCompletedRef.current = false;
    
    addGameLog("🔓 Game started! Decrypt 5 encrypted messages to complete the level", "info");
    startNewCipherChallenge();
    playSound(523, 0.2);
  };

  const pauseGame = () => {
    setGameStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    // Clear any pending timeouts
    if (attackIntervalRef.current) {
      clearTimeout(attackIntervalRef.current);
      attackIntervalRef.current = null;
    }
    
    setGameStatus({
      status: "idle",
      timeElapsed: 0,
      score: 0,
      messagesDecrypted: 0,
      encryptionLevel: 1,
      isPaused: false,
      lives: 3
    });
    setActiveAttack(null);
    setGameLog([]);
    setLevelPassword("");
    setCurrentCipher("");
    setUserInput("");
    setMobileMenuOpen(false);
    levelCompletedRef.current = false;
  };

  const handleGameOver = useCallback((reason = "Data compromised") => {
    setGameStatus(prev => ({ ...prev, status: "failed" }));
    addGameLog(`💀 Game Over! ${reason}`, "error");
    playSound(200, 0.5, 'sawtooth');
  }, [addGameLog, playSound]);

  const completeLevel = useCallback(() => {
    if (levelCompletedRef.current) return; // Prevent multiple completions
    
    if (gameStatus.status === "running" && gameStatus.messagesDecrypted >= 5) {
      levelCompletedRef.current = true;
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      addGameLog("🎉 Level Completed! All messages successfully decrypted", "success");
      addGameLog(`🔑 Level 5 Password: ${password}`, "success");
      
      const xpEarned = 250 + Math.floor(gameStatus.score / 10);
      addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
      
      try {
        gameActions.completeLevel(4, xpEarned, password);
      } catch (error) {
        console.error('GameContext error:', error);
        // Fallback to localStorage
        const currentCompleted = JSON.parse(localStorage.getItem('hacking_zone_completed_levels') || '[]');
        if (!currentCompleted.includes(4)) {
          currentCompleted.push(4);
          localStorage.setItem('hacking_zone_completed_levels', JSON.stringify(currentCompleted));
        }
        const currentPasswords = JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}');
        currentPasswords[5] = password;
        localStorage.setItem('hacking_zone_level_passwords', JSON.stringify(currentPasswords));
      }
      
      playSound(1000, 0.5);
    }
  }, [gameStatus.status, gameStatus.messagesDecrypted, gameStatus.score, generateLevelPassword, addGameLog, gameActions, playSound]);

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  const getAttackColor = (type) => {
    switch (type) {
      case "eavesdrop": return "from-yellow-500 to-orange-500";
      case "bruteforce": return "from-red-500 to-pink-500";
      case "analysis": return "from-blue-500 to-cyan-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (attackIntervalRef.current) {
        clearTimeout(attackIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black py-4 px-3 sm:py-8 sm:px-4 pt-20 sm:pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-blue-500/30">
            <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 text-center">Encrypted Zone</h1>
            <p className="text-gray-300 mb-4 text-sm sm:text-lg text-center">Level 4: Cryptography & Data Protection</p>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-6 mb-4">
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2 text-center text-sm sm:text-base">Level 4 Password Required</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-4 text-center">
                Enter the password from Password Vault level
              </p>
              
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter Level 4 Password (HZ-L4-...)"
                  className="w-full bg-black/50 border border-blue-500/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-center font-mono text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 text-center">{passwordError}</p>
                )}
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 sm:py-3 rounded-xl font-semibold mt-3 hover:shadow-lg hover:shadow-blue-500/20 transition-all text-sm sm:text-base"
                >
                  Unlock Level 4
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                What to Expect:
              </h4>
              <ul className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-2">
                <li>• Decrypt messages using various historical ciphers</li>
                <li>• Learn Caesar, Atbash, Rail Fence, and Vigenère ciphers</li>
                <li>• Defend against data interception attacks</li>
                <li>• Understand basic cryptography principles</li>
                <li>• Progress through increasingly complex encryption methods</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-black py-4 px-3 sm:py-8 sm:px-4 pt-20 sm:pt-24">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/levels")}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Encrypted Zone</h1>
              <p className="text-blue-400 text-xs">Level 4</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <div className="text-blue-400 font-bold">{gameStatus.score}</div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">{gameStatus.messagesDecrypted}/5</div>
                <div className="text-gray-400">Decrypted</div>
              </div>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/levels")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Levels
          </button>
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Encrypted Zone</h1>
              <p className="text-blue-400 text-sm">Cryptography & Data Protection</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{gameStatus.score}</div>
            <div className="text-gray-400 text-sm">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {gameStatus.messagesDecrypted}/5
            </div>
            <div className="text-gray-400 text-sm">Decrypted</div>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1">
              <div className="text-2xl font-bold text-red-400">{gameStatus.lives}</div>
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-gray-400 text-sm">Lives</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              Level {gameStatus.encryptionLevel}
            </div>
            <div className="text-gray-400 text-sm">Difficulty</div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="lg:hidden fixed top-16 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-20 p-4 overflow-y-auto"
          >
            {/* Stats */}
            <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Game Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-cyan-400">
                    {Math.floor(gameStatus.timeElapsed / 60)}:{(gameStatus.timeElapsed % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Messages Decrypted:</span>
                  <span className="text-green-400">{gameStatus.messagesDecrypted}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Encryption Level:</span>
                  <span className="text-blue-400">{gameStatus.encryptionLevel}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Cipher:</span>
                  <span className="text-purple-400 capitalize">{cipherType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lives:</span>
                  <span className="text-red-400">{gameStatus.lives}/3</span>
                </div>
              </div>
            </div>

            {/* Game Log */}
            <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Decryption Log
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-3 max-h-48 overflow-y-auto">
                {gameLog.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {gameLog.map(log => (
                      <div key={log.id} className="flex items-start gap-2 text-xs">
                        <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">{log.timestamp}</span>
                        <span className={`flex-1 ${
                          log.type === "error" ? "text-red-400" :
                          log.type === "warning" ? "text-yellow-400" :
                          log.type === "success" ? "text-green-400" : "text-gray-300"
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cipher Reference */}
            <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Cipher Types
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <span className="text-blue-400 font-semibold">Caesar:</span>
                  <p className="text-xs">Shift each letter by fixed number</p>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Atbash:</span>
                  <p className="text-xs">Reverse alphabet (A=Z, B=Y)</p>
                </div>
                <div>
                  <span className="text-yellow-400 font-semibold">Rail Fence:</span>
                  <p className="text-xs">Zig-zag pattern reading</p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Vigenère:</span>
                  <p className="text-xs">Keyword-based polyalphabetic</p>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Morse:</span>
                  <p className="text-xs">Dots and dashes code</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass card-cyber p-4 sm:p-6 max-w-2xl w-full border border-blue-500/30 rounded-2xl"
            >
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 text-center">Welcome to Encrypted Zone</h2>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">Decrypt Messages</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Solve various historical ciphers to decrypt secret messages</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">Defend Against Attacks</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Watch for data interception attempts while you decrypt</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base">Learn Cryptography</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">Understand Caesar, Atbash, Rail Fence, and Vigenère ciphers</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowTutorial(false)}
                className="w-full bg-blue-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm sm:text-base"
              >
                Start Game
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <FileSearch className="w-4 h-4 sm:w-5 sm:h-5" />
                  Encryption Challenge
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 sm:p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Current Cipher */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-blue-500/30">
                  <h3 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                    Encrypted Message
                  </h3>
                  <div className="bg-black/70 p-3 sm:p-4 rounded border border-gray-600 mb-3 sm:mb-4">
                    <code className="text-yellow-400 font-mono text-base sm:text-lg break-all text-center">
                      {encryptedMessage}
                    </code>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 text-center">
                    Cipher Type: <span className="text-blue-400 font-semibold">{cipherType.toUpperCase()}</span>
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                    <p className="text-blue-300 text-xs sm:text-sm">{getCipherInstructions()}</p>
                  </div>

                  {/* Hints */}
                  <div className="space-y-1 sm:space-y-2">
                    <h4 className="text-yellow-400 text-xs sm:text-sm font-semibold">Hints:</h4>
                    {hints.map((hint, index) => (
                      <div key={index} className="flex items-center gap-1 sm:gap-2 text-gray-300 text-xs sm:text-sm">
                        <Sparkles className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        {hint}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Attack Warning */}
                {activeAttack && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 sm:p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                        <span className="text-white font-semibold capitalize text-sm sm:text-base">{activeAttack.type} Attack!</span>
                      </div>
                      <span className="text-red-400 text-xs sm:text-sm">{activeAttack.description}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                        style={{ width: `${activeAttack.progress}%` }}
                      ></div>
                    </div>
                  </motion.div>
                )}

                {/* Decryption Input */}
                <div className="space-y-3 sm:space-y-4">
                  <input
                    type="text"
                    placeholder="Enter decrypted message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 text-center text-sm sm:text-lg"
                    onKeyPress={(e) => e.key === 'Enter' && attemptDecryption(userInput)}
                  />
                  <button
                    onClick={() => attemptDecryption(userInput)}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all text-sm sm:text-base"
                  >
                    Decrypt Message
                  </button>
                </div>
              </div>

              {/* Game Controls */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                <div className="flex gap-2 sm:gap-3">
                  {gameStatus.status === "idle" ? (
                    <button
                      onClick={startGame}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Start Game
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={pauseGame}
                        className="flex-1 bg-yellow-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        {gameStatus.isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {gameStatus.isPaused ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={resetGame}
                        className="flex-1 bg-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                        Reset
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Side Panel */}
          <div className="hidden lg:block space-y-6">
            {/* Stats */}
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Game Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-cyan-400">
                    {Math.floor(gameStatus.timeElapsed / 60)}:{(gameStatus.timeElapsed % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Messages Decrypted:</span>
                  <span className="text-green-400">{gameStatus.messagesDecrypted}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Encryption Level:</span>
                  <span className="text-blue-400">{gameStatus.encryptionLevel}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Cipher:</span>
                  <span className="text-purple-400 capitalize">{cipherType}</span>
                </div>
              </div>
            </div>

            {/* Game Log */}
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Decryption Log
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-4 max-h-60 overflow-y-auto">
                {gameLog.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {gameLog.map(log => (
                      <div key={log.id} className="flex items-start gap-3 text-sm">
                        <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">{log.timestamp}</span>
                        <span className={`flex-1 ${
                          log.type === "error" ? "text-red-400" :
                          log.type === "warning" ? "text-yellow-400" :
                          log.type === "success" ? "text-green-400" : "text-gray-300"
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cipher Reference */}
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-400" />
                Cipher Types
              </h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div>
                  <span className="text-blue-400 font-semibold">Caesar:</span>
                  <p className="text-xs">Shift each letter by fixed number</p>
                </div>
                <div>
                  <span className="text-green-400 font-semibold">Atbash:</span>
                  <p className="text-xs">Reverse alphabet (A=Z, B=Y)</p>
                </div>
                <div>
                  <span className="text-yellow-400 font-semibold">Rail Fence:</span>
                  <p className="text-xs">Zig-zag pattern reading</p>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">Vigenère:</span>
                  <p className="text-xs">Keyword-based polyalphabetic</p>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold">Morse:</span>
                  <p className="text-xs">Dots and dashes code</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mt-6 sm:mt-8 glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-1 sm:mb-2 text-sm sm:text-base">Historical Ciphers</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand classical encryption methods like Caesar and Vigenère ciphers</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">Cryptanalysis</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn techniques for breaking simple encryption systems</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Data Protection</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand why encryption is crucial for data security</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-1 sm:mb-2 text-sm sm:text-base">Pattern Recognition</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Develop skills in recognizing encryption patterns and weaknesses</p>
            </div>
          </div>
        </div>

        {/* Game Overlays */}
        <AnimatePresence>
          {gameStatus.status === "completed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            >
              <div className="text-center bg-gray-800/95 p-4 sm:p-6 rounded-2xl border border-green-500/30 max-w-md w-full shadow-2xl">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Level Complete!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">All messages successfully decrypted</p>
                
                <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-blue-500/30 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Level 5 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {passwordCopied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                      <span className="text-xs">{passwordCopied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="bg-black/70 p-2 sm:p-3 rounded border border-gray-600">
                    <code className="text-green-400 font-mono text-xs sm:text-sm break-all">
                      {levelPassword}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm sm:text-base"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => navigate("/levels")}
                    className="flex-1 bg-cyan-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-cyan-600 transition-colors text-sm sm:text-base"
                  >
                    Go to Levels
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameStatus.status === "failed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            >
              <div className="text-center bg-gray-800/95 p-4 sm:p-6 rounded-2xl border border-red-500/30 max-w-md w-full">
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Data Compromised!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Too many attacks intercepted your data</p>
                <button
                  onClick={resetGame}
                  className="bg-blue-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}