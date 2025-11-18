// hacking_zone/src/pages/levels/XSSArena.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Shield, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft,
  Code, Bug, Search, Eye, EyeOff, Filter,
  Terminal, Globe, User, Mail, Lock,
  Copy, Check, AlertCircle, Settings,
  Sparkles, Award, Volume2, VolumeX,
  Menu, X, ExternalLink, FileText
} from "lucide-react";

// XSS Payload Database
const xssPayloads = [
  {
    id: 1,
    name: "Basic Alert",
    payload: "<script>alert('XSS')</script>",
    description: "Basic script tag injection",
    difficulty: "easy",
    category: "reflected"
  },
  {
    id: 2,
    name: "Image XSS",
    payload: "<img src=x onerror=alert('XSS')>",
    description: "Image tag with onerror event",
    difficulty: "easy",
    category: "stored"
  },
  {
    id: 3,
    name: "SVG XSS",
    payload: "<svg onload=alert('XSS')>",
    description: "SVG with onload event",
    difficulty: "medium",
    category: "dom"
  },
  {
    id: 4,
    name: "Input Event",
    payload: "<input onfocus=alert('XSS') autofocus>",
    description: "Input field with autofocus",
    difficulty: "medium",
    category: "reflected"
  },
  {
    id: 5,
    name: "JavaScript URL",
    payload: "javascript:alert('XSS')",
    description: "JavaScript protocol in URL",
    difficulty: "medium",
    category: "dom"
  },
  {
    id: 6,
    name: "Body XSS",
    payload: "<body onload=alert('XSS')>",
    description: "Body tag injection",
    difficulty: "hard",
    category: "stored"
  },
  {
    id: 7,
    name: "Iframe XSS",
    payload: "<iframe src=javascript:alert('XSS')>",
    description: "Iframe with JavaScript source",
    difficulty: "hard",
    category: "dom"
  },
  {
    id: 8,
    name: "Encoded XSS",
    payload: "<script>alert(String.fromCharCode(88,83,83))</script>",
    description: "Character code obfuscation",
    difficulty: "hard",
    category: "reflected"
  }
];

// Security Filters
const securityFilters = [
  {
    id: 1,
    name: "HTML Entity Encoding",
    description: "Convert < > & \" ' to HTML entities",
    enabled: false,
    validator: (input) => {
      return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }
  },
  {
    id: 2,
    name: "Script Tag Removal",
    description: "Remove all <script> tags",
    enabled: false,
    validator: (input) => input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  },
  {
    id: 3,
    name: "Event Handler Removal",
    description: "Remove on* event handlers",
    enabled: false,
    validator: (input) => input.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
  },
  {
    id: 4,
    name: "JavaScript Protocol Block",
    description: "Block javascript: protocol",
    enabled: false,
    validator: (input) => input.replace(/javascript:/gi, 'blocked:')
  },
  {
    id: 5,
    name: "URL Encoding",
    description: "Encode special characters in URLs",
    enabled: false,
    validator: (input) => encodeURI(input)
  },
  {
    id: 6,
    name: "Content Security Policy",
    description: "Simulate CSP header protection",
    enabled: false,
    validator: (input) => input // CSP would be handled differently in real implementation
  }
];

// Vulnerable Web Application Simulation
const VulnerableWebApp = ({ userInput, securityFilters, onXSSDetected }) => {
  const [domContent, setDomContent] = useState("");
  const [urlParams, setUrlParams] = useState("");
  const [storedContent, setStoredContent] = useState("");
  const [isSafe, setIsSafe] = useState(true);

  useEffect(() => {
    // Simulate different XSS contexts
    let processedInput = userInput;
    
    // Apply enabled security filters
    securityFilters.forEach(filter => {
      if (filter.enabled) {
        processedInput = filter.validator(processedInput);
      }
    });

    // Check for XSS in different contexts
    const hasXSS = checkForXSS(processedInput);
    
    if (hasXSS && userInput.trim()) {
      setIsSafe(false);
      onXSSDetected?.(userInput, hasXSS.type);
    } else {
      setIsSafe(true);
    }

    // Update simulated web app state
    setDomContent(processedInput);
    setUrlParams(processedInput);
    setStoredContent(processedInput);
  }, [userInput, securityFilters, onXSSDetected]);

  const checkForXSS = (input) => {
    const xssPatterns = [
      { pattern: /<script\b[^>]*>[\s\S]*?<\/script>/i, type: "script-tag" },
      { pattern: /<img[^>]+onerror\s*=/i, type: "event-handler" },
      { pattern: /<svg[^>]+onload\s*=/i, type: "svg-xss" },
      { pattern: /javascript:/i, type: "js-protocol" },
      { pattern: /<iframe[^>]+src\s*=\s*["']?javascript:/i, type: "iframe-xss" },
      { pattern: /<body[^>]+onload\s*=/i, type: "body-xss" },
      { pattern: /<input[^>]+onfocus\s*=/i, type: "input-xss" }
    ];

    for (let pattern of xssPatterns) {
      if (pattern.pattern.test(input)) {
        return pattern;
      }
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* URL Bar Simulation */}
      <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Globe className="w-4 h-4" />
          <span>https://vulnerable-app.com/search?q=</span>
          <span className={`font-mono ${isSafe ? 'text-green-400' : 'text-red-400'}`}>
            {urlParams || "safe-search"}
          </span>
        </div>
      </div>

      {/* Web Page Content */}
      <div className="bg-white rounded-lg border-2 border-gray-300 min-h-48 p-4">
        <div className="text-gray-800 space-y-3">
          <h3 className="text-lg font-bold text-blue-600">Welcome to Vulnerable Web App</h3>
          
          {/* Search Results */}
          <div className="border-t pt-3">
            <h4 className="font-semibold mb-2">Search Results for: "{domContent || "safe content"}"</h4>
            <div 
              className="text-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: storedContent || "No results found" }}
            />
          </div>

          {/* User Comment Section */}
          <div className="border-t pt-3">
            <h4 className="font-semibold mb-2">User Comments</h4>
            <div className="text-sm text-gray-600">
              <div 
                dangerouslySetInnerHTML={{ __html: storedContent ? `User: ${storedContent}` : "No comments yet" }}
              />
            </div>
          </div>
        </div>

        {/* XSS Warning */}
        {!isSafe && userInput.trim() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs"
          >
            ⚠️ XSS Payload Detected! The application is vulnerable.
          </motion.div>
        )}
      </div>

      {/* Security Status */}
      <div className={`p-3 rounded-lg border ${
        isSafe ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
      }`}>
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${isSafe ? 'text-green-400' : 'text-red-400'}`} />
          <span className={`font-semibold ${isSafe ? 'text-green-400' : 'text-red-400'}`}>
            {isSafe ? "Application Secure" : "XSS Vulnerability Detected!"}
          </span>
        </div>
        <p className={`text-xs mt-1 ${isSafe ? 'text-green-300' : 'text-red-300'}`}>
          {isSafe 
            ? "No malicious scripts detected in the current input."
            : "The application executed malicious JavaScript from user input."
          }
        </p>
      </div>
    </div>
  );
};

export default function XSSArena() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    vulnerabilitiesFound: 0,
    securityRulesEnabled: 0,
    level: 7,
    isPaused: false,
    phase: "learning" // learning, testing, defense
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // XSS Testing
  const [userInput, setUserInput] = useState("");
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [detectedXSS, setDetectedXSS] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  // Security Configuration
  const [filters, setFilters] = useState(securityFilters);
  const [webAppSafe, setWebAppSafe] = useState(true);

  const audioContextRef = useRef(null);

  // Check level status
  useEffect(() => {
    if (gameState.isLoading) return;

    if (gameState.completedLevels.includes(7)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      const existingPassword = gameState.levelPasswords[8];
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
      return;
    }

    if (gameState.levelUnlocks[7] || gameState.completedLevels.includes(6)) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      if (!gameState.levelUnlocks[7]) {
        gameActions.unlockLevel(7);
      }
    }
  }, [gameState.completedLevels, gameState.levelUnlocks, gameState.isLoading]);

  // Sound system
  const playSound = (frequency, duration, type = 'sine') => {
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
  };

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Password management
  const getStoredLevelPassword = () => {
    const sources = [
      gameState.levelPasswords[7],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[7],
      localStorage.getItem('level7_password')
    ];

    return sources.find(p => p && p.startsWith('HZ-L7-'));
  };

  const normalizePassword = (password) => {
    return password.trim().toUpperCase();
  };

  const checkLevelPassword = () => {
    initAudio();
    
    const inputPassword = normalizePassword(passwordInput);
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      setPasswordError("Please enter the Level 7 password");
      return;
    }
    
    if (!savedPassword) {
      setPasswordError("No Level 7 password found. Please complete SQL Vault Breach level first.");
      return;
    }
    
    const normalizedSavedPassword = normalizePassword(savedPassword);
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setPasswordError("");
      setShowTutorial(true);
      gameActions.unlockLevel(7);
      playSound(800, 0.2);
    } else {
      setPasswordError(`Invalid Level 7 password. The password should start with "HZ-L7-".`);
      playSound(300, 0.3, 'square');
    }
  };

  const generateLevelPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L8-${password}`;
  };

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

  // XSS Detection Handler
  const handleXSSDetected = (payload, type) => {
    if (!detectedXSS.find(xss => xss.payload === payload)) {
      const newDetection = {
        id: Date.now(),
        payload,
        type,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setDetectedXSS(prev => [...prev, newDetection]);
      
      setGameStatus(prev => ({
        ...prev,
        vulnerabilitiesFound: prev.vulnerabilitiesFound + 1,
        score: prev.score + 25
      }));
      
      addGameLog(`🎯 XSS Vulnerability Found: ${type}`, "success");
      playSound(600, 0.2);
      
      // Check win condition
      if (gameStatus.vulnerabilitiesFound + 1 >= 5) {
        setTimeout(() => {
          setGameStatus(prev => ({ ...prev, phase: "defense" }));
          addGameLog("🛡️ Phase 2: Enable security filters to protect the application", "info");
        }, 1500);
      }
    }
  };

  // Security Filter Toggle
  const toggleFilter = (filterId) => {
    setFilters(prev =>
      prev.map(filter =>
        filter.id === filterId ? { ...filter, enabled: !filter.enabled } : filter
      )
    );
  };

  // Update security status
  useEffect(() => {
    if (gameStatus.phase === "defense") {
      const enabledCount = filters.filter(f => f.enabled).length;
      setGameStatus(prev => ({ 
        ...prev, 
        securityRulesEnabled: enabledCount 
      }));
      
      // Check if all filters are enabled
      if (enabledCount === filters.length && gameStatus.status === "running") {
        completeLevel();
      }
    }
  }, [filters, gameStatus.phase, gameStatus.status]);

  const addGameLog = (message, type = "info") => {
    setGameLog(prev => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 8)]);
  };

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
      vulnerabilitiesFound: 0,
      securityRulesEnabled: 0,
      level: 7,
      isPaused: false,
      phase: "testing"
    });
    
    setDetectedXSS([]);
    setGameLog([]);
    setLevelPassword("");
    setUserInput("");
    setSelectedPayload(null);
    setFilters(securityFilters.map(f => ({ ...f, enabled: false })));
    setShowTutorial(false);
    setMobileMenuOpen(false);
    
    addGameLog("🔓 Game started! Find XSS vulnerabilities in the web application", "info");
    addGameLog("💡 Try different XSS payloads from the library", "warning");
    playSound(523, 0.2);
  };

  const pauseGame = () => {
    setGameStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameStatus({
      status: "idle",
      timeElapsed: 0,
      score: 0,
      vulnerabilitiesFound: 0,
      securityRulesEnabled: 0,
      level: 7,
      isPaused: false,
      phase: "testing"
    });
    setDetectedXSS([]);
    setGameLog([]);
    setLevelPassword("");
    setUserInput("");
    setSelectedPayload(null);
    setFilters(securityFilters.map(f => ({ ...f, enabled: false })));
    setMobileMenuOpen(false);
  };

  const handleGameOver = (reason = "Security compromised") => {
    setGameStatus(prev => ({ ...prev, status: "failed" }));
    addGameLog(`💀 Game Over! ${reason}`, "error");
    playSound(200, 0.5, 'sawtooth');
  };

  const completeLevel = () => {
    if (gameStatus.status === "running") {
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      addGameLog("🎉 Level Completed! XSS vulnerabilities secured", "success");
      addGameLog(`🔑 Level 8 Password: ${password}`, "success");
      
      const xpEarned = 350 + Math.floor(gameStatus.score / 10);
      addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
      
      try {
        gameActions.completeLevel(7, xpEarned, password);
      } catch (error) {
        console.error('GameContext error:', error);
      }
      
      playSound(1000, 0.5);
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  const usePayload = (payload) => {
    setUserInput(payload.payload);
    setSelectedPayload(payload);
    addGameLog(`💉 Testing payload: ${payload.name}`, "info");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass card-cyber p-4 sm:p-8 rounded-2xl border border-orange-500/30">
            <Code className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">XSS Arena</h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-lg">Level 7: Cross-Site Scripting Defense</p>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Level 7 Password Required</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Enter the password from SQL Vault Breach level
              </p>
              
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter Level 7 Password (HZ-L7-...)"
                  className="w-full bg-black/50 border border-orange-500/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 text-center font-mono text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2">{passwordError}</p>
                )}
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold mt-3 sm:mt-4 hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm sm:text-base"
                >
                  Unlock Level 7
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                What to Expect:
              </h4>
              <ul className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-2">
                <li>• Phase 1: Discover XSS vulnerabilities using payload library</li>
                <li>• Phase 2: Enable security filters to protect the application</li>
                <li>• Learn about different types of XSS attacks</li>
                <li>• Understand web application security principles</li>
                <li>• Practice defensive coding techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
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
            <Code className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">XSS Arena</h1>
              <p className="text-orange-400 text-xs">Level 7</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <div className="text-orange-400 font-bold">{gameStatus.score}</div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">
                  {gameStatus.phase === "testing" 
                    ? `${gameStatus.vulnerabilitiesFound}/5` 
                    : `${gameStatus.securityRulesEnabled}/${filters.length}`
                  }
                </div>
                <div className="text-gray-400">
                  {gameStatus.phase === "testing" ? "Found" : "Filters"}
                </div>
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

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
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
              <Code className="w-8 h-8 text-orange-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">XSS Arena</h1>
                <p className="text-orange-400 text-sm">Cross-Site Scripting Defense</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {gameStatus.phase === "testing" 
                  ? `${gameStatus.vulnerabilitiesFound}/5` 
                  : `${gameStatus.securityRulesEnabled}/${filters.length}`
                }
              </div>
              <div className="text-gray-400 text-sm">
                {gameStatus.phase === "testing" ? "Vulnerabilities" : "Filters"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 capitalize">
                {gameStatus.phase}
              </div>
              <div className="text-gray-400 text-sm">Phase</div>
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
              {/* Game Stats */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Game Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-orange-400">{gameStatus.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vulnerabilities Found:</span>
                    <span className="text-green-400">{gameStatus.vulnerabilitiesFound}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Filters:</span>
                    <span className="text-blue-400">{gameStatus.securityRulesEnabled}/{filters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phase:</span>
                    <span className="text-cyan-400 capitalize">{gameStatus.phase}</span>
                  </div>
                </div>
              </div>

              {/* Game Log */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Security Log
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutorial Overlay */}
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
                className="glass card-cyber p-4 sm:p-6 max-w-2xl w-full border border-orange-500/30 rounded-2xl"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 text-center">Welcome to XSS Arena</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Phase 1: Discover Vulnerabilities</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Test XSS payloads to find 5 different vulnerabilities</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Phase 2: Enable Security</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Activate all security filters to protect the application</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Code className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Learn XSS Types</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Understand reflected, stored, and DOM-based XSS attacks</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-orange-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors text-sm sm:text-base"
                >
                  Start Game
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  {gameStatus.phase === "testing" ? <Bug className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                   <Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {gameStatus.phase === "testing" ? "XSS Testing" : "Security Configuration"}
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

              {/* Game Content */}
              {gameStatus.phase === "testing" ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Vulnerable Web Application */}
                  <VulnerableWebApp 
                    userInput={userInput}
                    securityFilters={filters}
                    onXSSDetected={handleXSSDetected}
                  />

                  {/* XSS Payload Input */}
                  <div className="space-y-3">
                    <h3 className="text-white font-semibold text-sm sm:text-base">Test XSS Payload</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Enter XSS payload or select from library..."
                        className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 text-sm"
                      />
                      <button
                        onClick={() => setUserInput("")}
                        className="bg-gray-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Detected Vulnerabilities */}
                  {detectedXSS.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 sm:p-4">
                      <h4 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                        <AlertTriangle className="w-4 h-4" />
                        Detected Vulnerabilities ({detectedXSS.length}/5)
                      </h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {detectedXSS.map(xss => (
                          <div key={xss.id} className="flex items-center justify-between text-xs">
                            <code className="text-yellow-300 font-mono">{xss.payload.substring(0, 30)}...</code>
                            <span className="text-yellow-400 capitalize">{xss.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {/* Security Filters */}
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-green-500/30">
                    <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      Security Filters
                      <span className="text-xs sm:text-sm text-gray-400">
                        ({filters.filter(f => f.enabled).length}/{filters.length} enabled)
                      </span>
                    </h3>

                    {/* Success Message when ALL filters are enabled */}
                    {filters.every(filter => filter.enabled) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
                      >
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-semibold text-sm sm:text-base">All Security Filters Enabled!</span>
                        </div>
                        <p className="text-green-300 text-xs sm:text-sm mt-1">
                          The web application is now protected against XSS attacks.
                        </p>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {filters.map(filter => (
                        <motion.div
                          key={filter.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all ${
                            filter.enabled
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-gray-700/50 border-gray-600/50"
                          }`}
                          onClick={() => toggleFilter(filter.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full border ${
                              filter.enabled 
                                ? "bg-green-400 border-green-500" 
                                : "bg-gray-600 border-gray-500"
                            }`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`font-semibold ${filter.enabled ? "text-white" : "text-gray-400"} text-sm sm:text-base`}>
                                  {filter.name}
                                </span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  filter.enabled 
                                    ? "bg-green-500/20 text-green-400" 
                                    : "bg-gray-500/20 text-gray-400"
                                }`}>
                                  {filter.enabled ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <p className={`text-xs mt-1 ${filter.enabled ? "text-gray-300" : "text-gray-500"}`}>
                                {filter.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Protected Web Application */}
                  <VulnerableWebApp 
                    userInput={userInput}
                    securityFilters={filters}
                    onXSSDetected={handleXSSDetected}
                  />
                </div>
              )}

              {/* Game Controls */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                <div className="flex gap-2 sm:gap-3">
                  {gameStatus.status === "idle" ? (
                    <button
                      onClick={startGame}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
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

          {/* Side Panel - Hidden on mobile, shown in sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* XSS Payload Library */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-400" />
                XSS Payload Library
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {xssPayloads.map(payload => (
                  <motion.div
                    key={payload.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedPayload?.id === payload.id
                        ? "bg-orange-500/10 border-orange-500/30"
                        : "bg-gray-700/50 border-gray-600/50"
                    }`}
                    onClick={() => usePayload(payload)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-semibold text-sm">{payload.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        payload.difficulty === "easy" ? "bg-green-500/20 text-green-400" :
                        payload.difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      }`}>
                        {payload.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-2">{payload.description}</p>
                    <code className="text-orange-300 font-mono text-xs break-all">
                      {payload.payload}
                    </code>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Game Stats */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
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
                  <span className="text-gray-400">Vulnerabilities Found:</span>
                  <span className="text-green-400">{gameStatus.vulnerabilitiesFound}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Security Filters:</span>
                  <span className="text-blue-400">{gameStatus.securityRulesEnabled}/{filters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Phase:</span>
                  <span className="text-purple-400 capitalize">{gameStatus.phase}</span>
                </div>
              </div>
            </div>

            {/* Game Log */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Security Log
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
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mt-6 sm:mt-8 glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
              <h4 className="font-semibold text-orange-400 mb-1 sm:mb-2 text-sm sm:text-base">XSS Types</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand reflected, stored, and DOM-based XSS attacks</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">Payload Recognition</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Identify common XSS payload patterns and techniques</p>
            </div>
            <div className="p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-1 sm:mb-2 text-sm sm:text-base">Security Filters</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn input validation and output encoding techniques</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-1 sm:mb-2 text-sm sm:text-base">Web Security</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Apply Content Security Policy and other web defenses</p>
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
              <div className="text-center bg-gray-800/95 p-4 sm:p-8 rounded-2xl border border-green-500/30 max-w-md w-full shadow-2xl">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Level Complete!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">XSS vulnerabilities secured successfully</p>
                
                <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-orange-500/30 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Level 8 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
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
                    className="flex-1 bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm sm:text-base"
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
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Security Breach!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">XSS attacks compromised the application</p>
                <button
                  onClick={resetGame}
                  className="bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors text-sm sm:text-base"
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