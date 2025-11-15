// hacking_zone/src/pages/levels/SQLVaultBreach.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Shield, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft,
  Database, Key, Copy, Check, Eye, EyeOff, Terminal,
  Users, Server, Search, Filter, Lock, Unlock,
  Code2, Bug, TestTube, Cpu, Network, Globe,
  Volume2, VolumeX, ChevronDown, Sparkles, Award
} from "lucide-react";

export default function SQLVaultBreach() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    vulnerabilitiesFound: 0,
    attacksBlocked: 0,
    level: 6,
    isPaused: false,
    phase: "reconnaissance" // reconnaissance, exploitation, defense
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game state
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [gameLog, setGameLog] = useState([]);
  const [vulnerableInputs, setVulnerableInputs] = useState([]);
  const [defenseRules, setDefenseRules] = useState([
    { id: 1, type: "input_validation", enabled: false, description: "Input validation and sanitization" },
    { id: 2, type: "prepared_statements", enabled: false, description: "Use prepared statements" },
    { id: 3, type: "parameterized_queries", enabled: false, description: "Parameterized queries" },
    { id: 4, type: "orm", enabled: false, description: "Use ORM frameworks" },
    { id: 5, type: "waf", enabled: false, description: "Web Application Firewall" },
    { id: 6, type: "least_privilege", enabled: false, description: "Least privilege database access" }
  ]);

  const audioContextRef = useRef(null);

  // SQL Injection challenges
  const sqlChallenges = [
    {
      id: 1,
      title: "Login Bypass",
      description: "Bypass authentication using SQL injection",
      vulnerableField: "username",
      originalQuery: "SELECT * FROM users WHERE username = '[input]' AND password = 'hashed_password'",
      database: [
        { id: 1, username: "admin", password: "hashed_pass", role: "administrator" },
        { id: 2, username: "user1", password: "hashed_pass", role: "user" },
        { id: 3, username: "test", password: "hashed_pass", role: "tester" }
      ],
      hints: [
        "Try using comments to bypass password check",
        "OR operators can help bypass conditions",
        "Think about what would make the WHERE clause always true"
      ],
      solution: ["admin' --", "admin' OR '1'='1", "' OR 1=1 --"]
    },
    {
      id: 2,
      title: "Data Extraction",
      description: "Extract database information using UNION attacks",
      vulnerableField: "product_id",
      originalQuery: "SELECT name, price FROM products WHERE id = [input]",
      database: [
        { id: 1, name: "Laptop", price: 999 },
        { id: 2, name: "Phone", price: 699 },
        { id: 3, name: "Tablet", price: 399 }
      ],
      hints: [
        "UNION requires same number of columns",
        "You might need to find table names first",
        "Use information_schema to explore database structure"
      ],
      solution: ["1 UNION SELECT table_name, column_name FROM information_schema.columns", "1 UNION SELECT version(), database()"]
    },
    {
      id: 3,
      title: "Blind SQL Injection",
      description: "Extract data without visible output using boolean-based attacks",
      vulnerableField: "session_id",
      originalQuery: "SELECT user_id FROM sessions WHERE session_id = '[input]'",
      database: [
        { session_id: "abc123", user_id: 1 },
        { session_id: "def456", user_id: 2 }
      ],
      hints: [
        "Use conditional statements with AND/OR",
        "Look for differences in application behavior",
        "You can extract data character by character"
      ],
      solution: ["abc123' AND SUBSTRING((SELECT password FROM users WHERE id=1),1,1)='a", "abc123' AND LENGTH(database())=10"]
    }
  ];

  // Check level status
  useEffect(() => {
    if (gameState.isLoading) return;

    if (gameState.completedLevels.includes(6)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      const existingPassword = gameState.levelPasswords[7];
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
      return;
    }

    if (gameState.levelUnlocks[6] || gameState.completedLevels.includes(5)) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      if (!gameState.levelUnlocks[6]) {
        gameActions.unlockLevel(6);
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
      gameState.levelPasswords[6],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[6],
      localStorage.getItem('level6_password')
    ];

    return sources.find(p => p && p.startsWith('HZ-L6-'));
  };

  const checkLevelPassword = () => {
    initAudio();
    
    const inputPassword = passwordInput.trim().toUpperCase();
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      setPasswordError("Please enter the Level 6 password");
      return;
    }
    
    if (!savedPassword) {
      setPasswordError("No Level 6 password found. Please complete The Port Scanner level first.");
      return;
    }
    
    const normalizedSavedPassword = savedPassword.trim().toUpperCase();
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setPasswordError("");
      setShowTutorial(true);
      gameActions.unlockLevel(6);
      playSound(800, 0.2);
    } else {
      setPasswordError(`Invalid Level 6 password. The password should start with "HZ-L6-".`);
      playSound(300, 0.3, 'square');
    }
  };

  const generateLevelPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L7-${password}`;
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

  // Start new challenge
  const startNewChallenge = () => {
    const availableChallenges = sqlChallenges.filter(challenge => 
      !vulnerableInputs.includes(challenge.id)
    );
    
    if (availableChallenges.length === 0) {
      // All challenges completed, switch to defense phase
      setGameStatus(prev => ({ ...prev, phase: "defense" }));
      addGameLog("🎯 Phase 3: Implement SQL injection defenses", "info");
      return;
    }

    const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    setCurrentChallenge(randomChallenge);
    setUserInput("");
    setSqlQuery("");
    setQueryResult("");
    
    addGameLog(`🔍 New challenge: ${randomChallenge.title}`, "info");
    addGameLog(`📝 ${randomChallenge.description}`, "info");
    addGameLog(`💡 Vulnerable field: ${randomChallenge.vulnerableField}`, "warning");
  };

  // Execute SQL injection attempt
  const attemptInjection = () => {
    if (!currentChallenge || !userInput) return;

    const generatedQuery = currentChallenge.originalQuery.replace(
      /\[input\]|'\[input\]'/g, 
      `'${userInput}'`
    );
    
    setSqlQuery(generatedQuery);
    addGameLog(`⚡ Executing: ${generatedQuery}`, "info");

    // Check if injection is successful
    const isSuccessful = currentChallenge.solution.some(solution => 
      userInput.toLowerCase().includes(solution.toLowerCase())
    );

    if (isSuccessful) {
      setQueryResult("✅ SQL Injection Successful! Data accessed.");
      setGameStatus(prev => ({
        ...prev,
        vulnerabilitiesFound: prev.vulnerabilitiesFound + 1,
        score: prev.score + 100
      }));
      setVulnerableInputs(prev => [...prev, currentChallenge.id]);
      addGameLog(`🎉 Vulnerability found! ${currentChallenge.title} exploited`, "success");
      playSound(800, 0.2);

      // Move to next challenge after delay
      setTimeout(() => {
        if (gameStatus.vulnerabilitiesFound + 1 >= 2) {
          setGameStatus(prev => ({ ...prev, phase: "defense" }));
          addGameLog("🎯 Phase 3: Implement SQL injection defenses", "info");
        } else {
          startNewChallenge();
        }
      }, 2000);
    } else {
      setQueryResult("❌ Injection failed. No vulnerability exploited.");
      setGameStatus(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 10)
      }));
      addGameLog(`❌ Injection attempt failed for: ${currentChallenge.title}`, "error");
      playSound(300, 0.2, 'square');
    }
  };

  // Toggle defense rules
  const toggleDefenseRule = (ruleId) => {
    setDefenseRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  // Check defense completion
  useEffect(() => {
    if (gameStatus.phase === "defense" && gameStatus.status === "running") {
      const allRulesEnabled = defenseRules.every(rule => rule.enabled);
      
      if (allRulesEnabled) {
        setGameStatus(prev => ({ ...prev, status: "completed" }));
        completeLevel();
      }
    }
  }, [defenseRules, gameStatus.phase, gameStatus.status]);

  const addGameLog = (message, type = "info") => {
    setGameLog(prev => [{ 
      id: Date.now(), 
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString() 
    }, ...prev.slice(0, 8)]);
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
      attacksBlocked: 0,
      level: 6,
      isPaused: false,
      phase: "reconnaissance"
    });
    
    setVulnerableInputs([]);
    setGameLog([]);
    setLevelPassword("");
    setShowTutorial(false);
    
    addGameLog("🔓 Game started! Find SQL injection vulnerabilities", "info");
    startNewChallenge();
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
      attacksBlocked: 0,
      level: 6,
      isPaused: false,
      phase: "reconnaissance"
    });
    setVulnerableInputs([]);
    setGameLog([]);
    setLevelPassword("");
    setCurrentChallenge(null);
    setUserInput("");
    setSqlQuery("");
    setQueryResult("");
  };

  const completeLevel = () => {
    const password = generateLevelPassword();
    setLevelPassword(password);
    
    addGameLog("🎉 Level Completed! SQL vulnerabilities patched", "success");
    addGameLog(`🔑 Level 7 Password: ${password}`, "success");
    
    const xpEarned = 350 + Math.floor(gameStatus.score / 10);
    addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
    
    try {
      gameActions.completeLevel(6, xpEarned, password);
    } catch (error) {
      console.error('GameContext error:', error);
    }
    
    playSound(1000, 0.5);
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-4">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-black py-8 px-4 pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass card-cyber p-8 rounded-2xl border border-red-500/30">
            <Database className="w-16 h-16 text-red-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">SQL Vault Breach</h1>
            <p className="text-gray-300 mb-6 text-lg">Level 6: SQL Injection & Database Security</p>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6">
              <Key className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Level 6 Password Required</h3>
              <p className="text-gray-300 text-sm mb-4">
                Enter the password from The Port Scanner level
              </p>
              
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter Level 6 Password (HZ-L6-...)"
                  className="w-full bg-black/50 border border-red-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 text-center font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                )}
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold mt-4 hover:shadow-lg hover:shadow-red-500/20 transition-all"
                >
                  Unlock Level 6
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                What to Expect:
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Phase 1: Find SQL injection vulnerabilities in web applications</li>
                <li>• Phase 2: Exploit vulnerabilities to access sensitive data</li>
                <li>• Phase 3: Implement proper SQL injection defenses</li>
                <li>• Learn about UNION attacks, blind SQLi, and authentication bypass</li>
                <li>• Understand parameterized queries and input validation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black py-8 px-4 pt-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/levels")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Levels
            </button>
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-red-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">SQL Vault Breach</h1>
                <p className="text-red-400 text-sm">SQL Injection & Database Security</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {gameStatus.vulnerabilitiesFound}/2
              </div>
              <div className="text-gray-400 text-sm">Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 capitalize">
                {gameStatus.phase}
              </div>
              <div className="text-gray-400 text-sm">Phase</div>
            </div>
          </div>
        </div>

        {/* Tutorial */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass card-cyber p-8 max-w-2xl mx-4 border border-red-500/30 rounded-2xl"
              >
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Welcome to SQL Vault Breach</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Search className="w-6 h-6 text-red-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Phase 1: Vulnerability Discovery</h3>
                      <p className="text-gray-400">Find SQL injection vulnerabilities in web applications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Bug className="w-6 h-6 text-yellow-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Phase 2: Exploitation</h3>
                      <p className="text-gray-400">Exploit vulnerabilities to access sensitive data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Phase 3: Defense Implementation</h3>
                      <p className="text-gray-400">Implement proper SQL injection defenses</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Start Game
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  {gameStatus.phase === "reconnaissance" ? <Search className="w-5 h-5" /> : 
                   gameStatus.phase === "defense" ? <Shield className="w-5 h-5" /> :
                   <Bug className="w-5 h-5" />}
                  {gameStatus.phase === "reconnaissance" ? "Vulnerability Discovery" : 
                   gameStatus.phase === "defense" ? "Defense Implementation" : "Exploitation"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Game Content */}
              {gameStatus.phase !== "defense" ? (
                <div className="space-y-6">
                  {currentChallenge && (
                    <>
                      {/* Current Challenge */}
                      <div className="bg-gray-800/50 rounded-xl p-6 border border-red-500/30">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <TestTube className="w-5 h-5" />
                          {currentChallenge.title}
                        </h3>
                        <p className="text-gray-300 mb-4">{currentChallenge.description}</p>
                        
                        <div className="bg-black/70 p-4 rounded border border-gray-600 mb-4">
                          <code className="text-green-400 font-mono text-sm">
                            Original Query: {currentChallenge.originalQuery}
                          </code>
                        </div>

                        {/* Hints */}
                        <div className="space-y-2">
                          <h4 className="text-yellow-400 text-sm font-semibold">Hints:</h4>
                          {currentChallenge.hints.map((hint, index) => (
                            <div key={index} className="flex items-center gap-2 text-gray-300 text-sm">
                              <Sparkles className="w-3 h-3 text-yellow-400" />
                              {hint}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Enter SQL Injection Payload for {currentChallenge.vulnerableField}:
                          </label>
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={`Enter payload for ${currentChallenge.vulnerableField} field`}
                            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-400"
                            onKeyPress={(e) => e.key === 'Enter' && attemptInjection()}
                          />
                        </div>
                        
                        <button
                          onClick={attemptInjection}
                          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all"
                        >
                          Execute Injection
                        </button>
                      </div>

                      {/* Query & Result Display */}
                      {(sqlQuery || queryResult) && (
                        <div className="space-y-4">
                          {sqlQuery && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                              <h4 className="text-blue-400 font-semibold mb-2">Generated SQL Query:</h4>
                              <code className="text-blue-300 font-mono text-sm break-all">
                                {sqlQuery}
                              </code>
                            </div>
                          )}
                          
                          {queryResult && (
                            <div className={`border rounded-xl p-4 ${
                              queryResult.includes('✅') 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-red-500/10 border-red-500/30'
                            }`}>
                              <h4 className={`font-semibold mb-2 ${
                                queryResult.includes('✅') ? 'text-green-400' : 'text-red-400'
                              }`}>
                                Query Result:
                              </h4>
                              <p className={queryResult.includes('✅') ? 'text-green-300' : 'text-red-300'}>
                                {queryResult}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                /* Defense Phase */
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      SQL Injection Defense Rules
                    </h3>
                    
                    {defenseRules.every(rule => rule.enabled) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4"
                      >
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">All defenses enabled! Database secured!</span>
                        </div>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {defenseRules.map(rule => (
                        <motion.div
                          key={rule.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            rule.enabled
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-gray-700/50 border-gray-600/50"
                          }`}
                          onClick={() => toggleDefenseRule(rule.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full border ${
                              rule.enabled 
                                ? "bg-green-400 border-green-500" 
                                : "bg-gray-600 border-gray-500"
                            }`} />
                            <span className={`text-sm ${rule.enabled ? "text-white" : "text-gray-400"}`}>
                              {rule.description}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Defense Tips */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-blue-400 font-semibold mb-2">Defense Best Practices:</h4>
                    <ul className="text-blue-300 text-sm space-y-1">
                      <li>• Use parameterized queries instead of string concatenation</li>
                      <li>• Implement proper input validation and sanitization</li>
                      <li>• Apply the principle of least privilege to database accounts</li>
                      <li>• Use stored procedures and ORM frameworks</li>
                      <li>• Implement Web Application Firewalls (WAF)</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Game Controls */}
              <div className="mt-6 pt-4 border-t border-gray-700/50">
                <div className="flex gap-3">
                  {gameStatus.status === "idle" ? (
                    <button
                      onClick={startGame}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Game
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={pauseGame}
                        className="flex-1 bg-yellow-500 text-white py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                      >
                        {gameStatus.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        {gameStatus.isPaused ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={resetGame}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-6">
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
                  <span className="text-gray-400">Vulnerabilities Found:</span>
                  <span className="text-green-400">{gameStatus.vulnerabilitiesFound}/2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Defenses:</span>
                  <span className="text-purple-400">
                    {defenseRules.filter(r => r.enabled).length}/{defenseRules.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Game Log */}
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50">
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

            {/* Learning Tips */}
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                SQL Injection Tips
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Use single quotes to break out of SQL strings</p>
                <p>• Comments (--, #, /* */) can bypass remaining query parts</p>
                <p>• UNION requires matching number of columns</p>
                <p>• Test with boolean conditions for blind SQLi</p>
                <p>• Always use parameterized queries in real applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mt-8 glass card-cyber p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-2">SQL Injection Types</h4>
              <p className="text-gray-300 text-sm">Understand different SQL injection techniques and attack vectors</p>
            </div>
            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-2">Vulnerability Detection</h4>
              <p className="text-gray-300 text-sm">Learn to identify SQL injection vulnerabilities in web applications</p>
            </div>
            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-2">Exploitation Techniques</h4>
              <p className="text-gray-300 text-sm">Master UNION attacks, blind SQLi, and authentication bypass</p>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-2">Defense Strategies</h4>
              <p className="text-gray-300 text-sm">Implement proper input validation and parameterized queries</p>
            </div>
          </div>
        </div>

        {/* Game Overlays */}
        <AnimatePresence>
          {gameStatus.status === "completed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <div className="text-center bg-gray-800/95 p-8 rounded-2xl border border-green-500/30 max-w-md mx-4 shadow-2xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Level Complete!</h3>
                <p className="text-gray-300 mb-4">SQL vulnerabilities successfully patched</p>
                
                <div className="bg-gray-700/80 p-4 rounded-xl border border-red-500/30 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-red-400" />
                      <span className="text-white font-semibold">Level 7 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      {passwordCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      <span className="text-xs">{passwordCopied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="bg-black/70 p-3 rounded border border-gray-600">
                    <code className="text-green-400 font-mono text-sm break-all">
                      {levelPassword}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => navigate("/levels")}
                    className="flex-1 bg-cyan-500 text-white px-6 py-2 rounded-xl hover:bg-cyan-600 transition-colors"
                  >
                    Go to Levels
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}