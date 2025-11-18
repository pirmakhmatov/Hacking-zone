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
  Volume2, VolumeX, ChevronDown, Sparkles, Award,
  FileText, Table, User, ShoppingCart, Settings,
  Scan, Crosshair, Fingerprint, Binary, Cctv,
  Menu, X, ChevronRight, Command
} from "lucide-react";

export default function SQLVaultBreach() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  // Refs - DEFINED AT THE TOP
  const audioContextRef = useRef(null);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const terminalContainerRef = useRef(null);

  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    vulnerabilitiesFound: 0,
    attacksBlocked: 0,
    level: 6,
    isPaused: false,
    phase: "reconnaissance"
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("terminal");

  // Enhanced Game State
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState("");
  const [gameLog, setGameLog] = useState([]);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [terminalInput, setTerminalInput] = useState("");
  const [vulnerableInputs, setVulnerableInputs] = useState([]);
  
  // Mobile-optimized state
  const [quickCommands] = useState([
    { command: "sqlmap --url", description: "Auto SQL injection scan" },
    { command: "show tables", description: "Show database tables" },
    { command: "scan --vulnerabilities", description: "Find vulnerabilities" },
    { command: "admin' --", description: "Login bypass payload" },
    { command: "1 UNION SELECT table_name, column_name FROM information_schema.columns", description: "Data extraction" },
    { command: "help", description: "Show all commands" }
  ]);

  const [webAppInterface, setWebAppInterface] = useState({
    currentPage: "login",
    forms: {
      login: { 
        username: "", 
        password: "", 
        action: "/login.php",
        submitted: false
      },
      search: { 
        product_id: "", 
        action: "/search.php",
        submitted: false
      },
      userProfile: { 
        user_id: "", 
        action: "/profile.php",
        submitted: false
      }
    },
    response: ""
  });

  const [databaseSchema, setDatabaseSchema] = useState({
    tables: {
      users: ["id", "username", "password", "email", "role"],
      products: ["id", "name", "price", "description"],
      sessions: ["session_id", "user_id", "expires_at"],
      orders: ["id", "user_id", "product_id", "quantity"],
      admin_logs: ["id", "action", "user_id", "timestamp"]
    },
    currentTable: "users",
    visibleColumns: false
  });

  const [securitySystems, setSecuritySystems] = useState([
    {
      id: 1,
      name: "Basic WAF",
      level: 1,
      blockedPatterns: ["or 1=1", "union select", "--", ";", "/*"],
      bypassed: false,
      active: true
    },
    {
      id: 2,
      name: "Advanced Input Filter", 
      level: 2,
      blockedPatterns: ["select", "from", "where", "insert", "update"],
      bypassed: false,
      active: false
    },
    {
      id: 3,
      name: "Behavioral Analysis",
      level: 3,
      blockedPatterns: ["sleep(", "benchmark(", "waitfor delay"],
      bypassed: false,
      active: false
    }
  ]);

  const [attackProgress, setAttackProgress] = useState({
    phase: "reconnaissance",
    steps: [
      { id: "find_vulnerability", completed: false, description: "Find injectable parameter" },
      { id: "discover_schema", completed: false, description: "Discover database structure" },
      { id: "extract_data", completed: false, description: "Extract sensitive information" },
      { id: "privilege_escalation", completed: false, description: "Gain admin access" }
    ],
    extractedData: []
  });

  const [defenseSystem, setDefenseSystem] = useState({
    alerts: [],
    blockedAttempts: 0,
    adminNotified: false,
    countermeasures: {
      ipBlock: false,
      rateLimit: false,
      captcha: false
    }
  });

  const [defenseRules, setDefenseRules] = useState([
    { id: 1, type: "input_validation", enabled: false, description: "Input validation" },
    { id: 2, type: "prepared_statements", enabled: false, description: "Prepared statements" },
    { id: 3, type: "parameterized_queries", enabled: false, description: "Parameterized queries" },
    { id: 4, type: "orm", enabled: false, description: "ORM frameworks" },
    { id: 5, type: "waf", enabled: false, description: "Web Application Firewall" },
    { id: 6, type: "least_privilege", enabled: false, description: "Least privilege access" }
  ]);

  // SQL challenges array
  const sqlChallenges = [
    {
      id: 1,
      title: "Login Bypass",
      description: "Bypass authentication using SQL injection",
      vulnerableField: "username",
      originalQuery: "SELECT * FROM users WHERE username = '[input]' AND password = 'hashed_password'",
      database: [
        { id: 1, username: "admin", password: "hashed_pass", role: "administrator", email: "admin@company.com" },
        { id: 2, username: "user1", password: "hashed_pass", role: "user", email: "user1@company.com" },
        { id: 3, username: "test", password: "hashed_pass", role: "tester", email: "test@company.com" }
      ],
      hints: [
        "Try using comments to bypass password check",
        "OR operators can help bypass conditions",
        "Think about what would make the WHERE clause always true"
      ],
      solution: ["admin' --", "admin' OR '1'='1", "' OR 1=1 --"],
      scenario: "Admin Panel Access",
      technique: "authentication_bypass"
    },
    {
      id: 2,
      title: "Data Extraction",
      description: "Extract database information using UNION attacks",
      vulnerableField: "product_id",
      originalQuery: "SELECT name, price FROM products WHERE id = [input]",
      database: [
        { id: 1, name: "Laptop", price: 999, description: "Gaming laptop" },
        { id: 2, name: "Phone", price: 699, description: "Smartphone" },
        { id: 3, name: "Tablet", price: 399, description: "Tablet device" }
      ],
      hints: [
        "UNION requires same number of columns",
        "You might need to find table names first",
        "Use information_schema to explore database structure"
      ],
      solution: ["1 UNION SELECT table_name, column_name FROM information_schema.columns", "1 UNION SELECT version(), database()"],
      scenario: "User Data Extraction", 
      technique: "union_attack"
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
      solution: ["abc123' AND SUBSTRING((SELECT password FROM users WHERE id=1),1,1)='a", "abc123' AND LENGTH(database())=10"],
      scenario: "E-Commerce Checkout Bypass",
      technique: "blind_injection"
    }
  ];

  // Enhanced Terminal Commands
  const advancedSQLCommands = {
    "sqlmap --url": "Automated SQL injection tool simulation",
    "nmap --script sql-injection": "Scan for SQL injection vulnerabilities", 
    "burp intruder": "Pattern-based attack simulation",
    "exploit --type union": "Specific exploit type selection",
    "bypass waf": "Try WAF bypass techniques", 
    "dump --table users": "Extract specific table data",
    "show tables": "Display database tables",
    "describe users": "Show table structure",
    "scan --vulnerabilities": "Scan for SQL injection points",
    "tools --list": "Show available hacking tools"
  };

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

  // Auto-scroll terminal on mobile
  useEffect(() => {
    if (terminalHistory.length > 0) {
      setTimeout(() => {
        terminalEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "nearest"
        });
      }, 100);
    }
  }, [terminalHistory]);

  // Sound functions
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
      addToTerminal("Access granted! Level 6 unlocked.", "success");
      addToTerminal("Tap 'Start Game' to begin SQL Vault Breach", "info");
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

  // Terminal Functions - optimized for mobile
  const addToTerminal = (message, type = "output") => {
    setTerminalHistory(prev => [...prev, { 
      id: Date.now() + Math.random(), 
      message, 
      type,
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const processTerminalCommand = (command) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    addToTerminal(`sql-hacker@vault:~$ ${trimmedCommand}`, "command");

    const args = trimmedCommand.split(' ').filter(arg => arg);
    const cmd = args[0].toLowerCase();

    switch(cmd) {
      case 'help':
        addToTerminal("Available commands:", "info");
        Object.entries(advancedSQLCommands).forEach(([cmd, desc]) => {
          addToTerminal(`  ${cmd.padEnd(25)} - ${desc}`, "info");
        });
        break;

      case 'sqlmap':
        if (args[1] === '--url') {
          addToTerminal("Starting sqlmap 1.6.9 automatic scan...", "info");
          addToTerminal("Testing connection to target... OK", "success");
          addToTerminal("Testing for SQL injection...", "info");
          setTimeout(() => {
            addToTerminal("Parameter 'username' appears to be injectable", "success");
            addToTerminal("Type: boolean-based blind", "info");
            addToTerminal("Payload: username=' AND 1=1 --", "output");
          }, 1000);
        }
        break;

      case 'show':
        if (args[1] === 'tables') {
          addToTerminal("Database: target_db", "info");
          addToTerminal("Available tables:", "info");
          Object.keys(databaseSchema.tables).forEach(table => {
            addToTerminal(`- ${table}`, "output");
          });
        }
        break;

      case 'describe':
        if (args[1] && databaseSchema.tables[args[1]]) {
          addToTerminal(`Table structure: ${args[1]}`, "info");
          databaseSchema.tables[args[1]].forEach(column => {
            addToTerminal(`- ${column}`, "output");
          });
        }
        break;

      case 'scan':
        if (args[1] === '--vulnerabilities') {
          addToTerminal("Scanning for SQL injection vulnerabilities...", "info");
          setTimeout(() => {
            addToTerminal("Found potential injection points:", "success");
            addToTerminal("- /login.php (POST) parameter: username", "output");
            addToTerminal("- /search.php (GET) parameter: product_id", "output");
            addToTerminal("- /profile.php (GET) parameter: user_id", "output");
          }, 1500);
        }
        break;

      case 'tools':
        if (args[1] === '--list') {
          addToTerminal("Available penetration testing tools:", "info");
          addToTerminal("- sqlmap: Automated SQL injection tool", "output");
          addToTerminal("- nmap: Network scanning with NSE scripts", "output");
          addToTerminal("- burp: Web application proxy and intruder", "output");
        }
        break;

      case 'start':
        if (gameStatus.status === "idle") {
          startGame();
        }
        break;

      default:
        // Check if it's a payload command
        if (trimmedCommand.includes("'") || trimmedCommand.includes("UNION") || trimmedCommand.includes("--")) {
          setUserInput(trimmedCommand);
          setTimeout(() => attemptInjection(), 100);
        } else {
          addToTerminal(`Command not found: ${cmd}`, "error");
        }
    }

    addToTerminal("sql-hacker@vault:~$ ", "prompt");
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = terminalInput.trim();
    if (!trimmedInput) return;

    if (gameStatus.status === "locked") {
      checkLevelPassword();
    } else {
      processTerminalCommand(trimmedInput);
    }
    
    setTerminalInput("");
  };

  // Enhanced Web Application Simulator - FIXED
  const submitWebForm = (formType, fieldValue) => {
    if (!currentChallenge) return;
    
    setUserInput(fieldValue);
    
    // Update web interface state
    setWebAppInterface(prev => ({
      ...prev,
      forms: {
        ...prev.forms,
        [formType]: {
          ...prev.forms[formType],
          submitted: true
        }
      },
      response: "Processing request..."
    }));

    // Simulate server processing
    setTimeout(() => {
      attemptInjection();
      setWebAppInterface(prev => ({
        ...prev,
        response: fieldValue.includes("'") ? 
          "Login successful! Welcome admin." : 
          "Invalid credentials. Please try again."
      }));
    }, 1000);
  };

  // Security System Functions
  const checkSecurityBypass = (payload) => {
    const currentSecurity = securitySystems.find(s => s.active && !s.bypassed);
    if (currentSecurity) {
      const isBlocked = currentSecurity.blockedPatterns.some(pattern => 
        payload.toLowerCase().includes(pattern.toLowerCase())
      );
      
      if (isBlocked) {
        addToTerminal(`🚨 ${currentSecurity.name} blocked your request!`, "error");
        setDefenseSystem(prev => ({
          ...prev,
          blockedAttempts: prev.blockedAttempts + 1,
          alerts: [...prev.alerts, {
            id: Date.now(),
            message: `Blocked SQL injection attempt: ${payload.substring(0, 50)}...`,
            severity: "high"
          }]
        }));
        playSound(300, 0.3, 'square');
        return false;
      }
    }
    return true;
  };

  // Enhanced challenge system
  const startNewChallenge = () => {
    const availableChallenges = sqlChallenges.filter(challenge => 
      !vulnerableInputs.includes(challenge.id)
    );
    
    if (availableChallenges.length === 0) {
      setGameStatus(prev => ({ ...prev, phase: "defense" }));
      addToTerminal("🎯 Phase 3: Implement SQL injection defenses", "info");
      addToTerminal("Enable all defense rules to secure the database", "info");
      return;
    }

    const randomChallenge = availableChallenges[Math.floor(Math.random() * availableChallenges.length)];
    setCurrentChallenge(randomChallenge);
    setUserInput("");
    setSqlQuery("");
    setQueryResult("");
    
    // Update web interface based on challenge
    setWebAppInterface(prev => ({
      ...prev,
      currentPage: randomChallenge.vulnerableField === 'username' ? 'login' : 
                   randomChallenge.vulnerableField === 'product_id' ? 'search' : 'userProfile',
      response: ""
    }));

    addToTerminal(`🔍 New challenge: ${randomChallenge.title}`, "info");
    addToTerminal(`📝 ${randomChallenge.description}`, "info");
    addToTerminal(`💡 Vulnerable field: ${randomChallenge.vulnerableField}`, "warning");
  };

  // Enhanced injection attempt with security checks
  const attemptInjection = () => {
    if (!currentChallenge || !userInput) return;

    // Check security systems
    if (!checkSecurityBypass(userInput)) {
      setQueryResult("❌ Injection blocked by security system");
      return;
    }

    const generatedQuery = currentChallenge.originalQuery.replace(
      /\[input\]|'\[input\]'/g, 
      `'${userInput}'`
    );
    
    setSqlQuery(generatedQuery);
    addToTerminal(`⚡ Executing: ${generatedQuery}`, "info");

    // Check if injection is successful
    const isSuccessful = currentChallenge.solution.some(solution => 
      userInput.toLowerCase().includes(solution.toLowerCase())
    );

    if (isSuccessful) {
      setQueryResult("✅ SQL Injection Successful! Data accessed.");
      setGameStatus(prev => ({
        ...prev,
        vulnerabilitiesFound: prev.vulnerabilitiesFound + 1,
        score: prev.score + calculateSQLScore(currentChallenge.technique)
      }));
      setVulnerableInputs(prev => [...prev, currentChallenge.id]);
      addToTerminal(`🎉 Vulnerability found! ${currentChallenge.title} exploited`, "success");
      playSound(800, 0.2);

      // Update attack progress
      updateAttackProgress();

      // Move to next challenge after delay
      setTimeout(() => {
        if (gameStatus.vulnerabilitiesFound + 1 >= sqlChallenges.length) {
          setGameStatus(prev => ({ ...prev, phase: "defense" }));
          addToTerminal("🎯 Phase 3: Implement SQL injection defenses", "info");
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
      addToTerminal(`❌ Injection attempt failed for: ${currentChallenge.title}`, "error");
      playSound(300, 0.2, 'square');
    }
  };

  const calculateSQLScore = (technique) => {
    const techniqueBonus = {
      authentication_bypass: 100,
      union_attack: 150,
      blind_injection: 200
    };
    return techniqueBonus[technique] || 100;
  };

  const updateAttackProgress = () => {
    setAttackProgress(prev => {
      const newSteps = [...prev.steps];
      if (prev.vulnerabilitiesFound === 0) {
        newSteps[0].completed = true; // Find vulnerability
      } else if (prev.vulnerabilitiesFound === 1) {
        newSteps[1].completed = true; // Discover schema
        setDatabaseSchema(prevSchema => ({ ...prevSchema, visibleColumns: true }));
      } else if (prev.vulnerabilitiesFound === 2) {
        newSteps[2].completed = true; // Extract data
      }
      
      return {
        ...prev,
        steps: newSteps,
        extractedData: [...prev.extractedData, {
          id: Date.now(),
          type: "credentials",
          data: "Admin access obtained"
        }]
      };
    });
  };

  // Defense system
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
      score: 100,
      vulnerabilitiesFound: 0,
      attacksBlocked: 0,
      level: 6,
      isPaused: false,
      phase: "reconnaissance"
    });
    
    setVulnerableInputs([]);
    setGameLog([]);
    setTerminalHistory([]);
    setLevelPassword("");
    setShowTutorial(false);
    setMobileMenuOpen(false);
    
    addToTerminal("🔓 SQL Vault Breach Challenge Started!", "success");
    addToTerminal("MISSION OBJECTIVES:", "info");
    addToTerminal("• Find and exploit 3 SQL injection vulnerabilities", "info");
    addToTerminal("• Bypass security systems and WAF protection", "info");
    addToTerminal("• Implement proper defense mechanisms", "info");
    addToTerminal("", "info");
    addToTerminal("Use 'help' for available commands", "info");
    addToTerminal("sql-hacker@vault:~$ ", "prompt");
    
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
    setTerminalHistory([]);
    setLevelPassword("");
    setCurrentChallenge(null);
    setUserInput("");
    setSqlQuery("");
    setQueryResult("");
    setSecuritySystems(prev => prev.map(sys => ({ ...sys, bypassed: false })));
    setAttackProgress({
      phase: "reconnaissance",
      steps: [
        { id: "find_vulnerability", completed: false, description: "Find injectable parameter" },
        { id: "discover_schema", completed: false, description: "Discover database structure" },
        { id: "extract_data", completed: false, description: "Extract sensitive information" },
        { id: "privilege_escalation", completed: false, description: "Gain admin access" }
      ],
      extractedData: []
    });
    setWebAppInterface({
      currentPage: "login",
      forms: {
        login: { username: "", password: "", action: "/login.php", submitted: false },
        search: { product_id: "", action: "/search.php", submitted: false },
        userProfile: { user_id: "", action: "/profile.php", submitted: false }
      },
      response: ""
    });
  };

  const completeLevel = () => {
    const password = generateLevelPassword();
    setLevelPassword(password);
    
    addToTerminal("🎉 Level Completed! SQL vulnerabilities patched", "success");
    addToTerminal(`🔑 Level 7 Password: ${password}`, "success");
    
    const xpEarned = 350 + Math.floor(gameStatus.score / 10);
    addToTerminal(`✨ +${xpEarned} XP Earned!`, "success");
    
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

  // Query Visualizer Component
  const QueryVisualizer = ({ query, userInput }) => {
    if (!query) return null;

    return (
      <div className="query-visualizer bg-gray-800/50 rounded-lg p-3 border border-blue-500/30">
        <h4 className="text-blue-400 font-semibold mb-2 text-sm">Query Breakdown:</h4>
        <div className="query-breakdown font-mono text-xs space-y-1">
          <div className="flex flex-wrap items-center">
            <span className="text-gray-400">SELECT * FROM users WHERE username = '</span>
            <span className="text-yellow-400 bg-yellow-400/20 px-1 rounded mx-1">{userInput}</span>
            <span className="text-gray-400">' AND password = 'hashed_password'</span>
          </div>
        </div>
        <div className="query-explanation mt-2 space-y-1">
          {userInput.includes("--") && (
            <div className="text-green-400 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Comment operator (--) removes password check
            </div>
          )}
          {userInput.toLowerCase().includes("or 1=1") && (
            <div className="text-green-400 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              OR condition makes WHERE clause always true
            </div>
          )}
          {userInput.toLowerCase().includes("union") && (
            <div className="text-green-400 text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              UNION combines results from multiple tables
            </div>
          )}
        </div>
      </div>
    );
  };

    // Web Interface Simulator Component - FIXED AND WORKING
// Web Interface Simulator Component - FIXED MOBILE INPUT ISSUE
const WebInterfaceSimulator = () => {
  const currentForm = webAppInterface.forms[webAppInterface.currentPage];
  
  // State to track mobile input focus
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [currentInput, setCurrentInput] = useState(null);

  // Mobile input handling
  const handleInputFocus = (inputName) => {
    setIsInputFocused(true);
    setCurrentInput(inputName);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
      setCurrentInput(null);
    }, 200);
  };

  const handleInputChange = (e, field) => {
    e.preventDefault();
    const value = e.target.value;
    
    setWebAppInterface(prev => ({
      ...prev,
      forms: {
        ...prev.forms,
        [webAppInterface.currentPage]: {
          ...prev.forms[webAppInterface.currentPage],
          [field]: value
        }
      }
    }));
  };

  // Mobile keyboard handling
  const handleInputTouchStart = (e) => {
    // Prevent any default touch behaviors
    e.preventDefault();
    e.stopPropagation();
  };

  const handleInputTouchEnd = (e, inputName) => {
    e.preventDefault();
    e.stopPropagation();
    handleInputFocus(inputName);
    
    // Force focus on the input
    setTimeout(() => {
      e.target.focus();
    }, 100);
  };

  return (
    <div className="web-interface-simulator bg-white rounded-lg p-4 shadow-lg border-2 border-red-300">
      <div className="flex items-center gap-2 mb-3">
        <Globe className="w-4 h-4 text-blue-500" />
        <h3 className="text-base font-semibold text-gray-800">Web Application</h3>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        </div>
      </div>
      
      {/* Page Navigation */}
      <div className="flex gap-1 mb-3 p-1 bg-gray-100 rounded">
        <button
          type="button"
          onClick={() => setWebAppInterface(prev => ({ ...prev, currentPage: "login", response: "" }))}
          className={`flex-1 py-2 px-2 text-xs rounded-lg font-medium transition-all ${
            webAppInterface.currentPage === "login" 
              ? "bg-blue-500 text-white shadow-md" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setWebAppInterface(prev => ({ ...prev, currentPage: "search", response: "" }))}
          className={`flex-1 py-2 px-2 text-xs rounded-lg font-medium transition-all ${
            webAppInterface.currentPage === "search" 
              ? "bg-blue-500 text-white shadow-md" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Search
        </button>
      </div>
      
      <div className="space-y-3">
        {webAppInterface.currentPage === "login" && (
          <>
            <h4 className="text-lg font-bold text-gray-800 text-center">Admin Login</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <div 
                  className={`w-full border-2 rounded-lg px-3 py-3 text-base transition-all ${
                    isInputFocused && currentInput === 'username'
                      ? "border-blue-500 bg-blue-50 shadow-inner"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleInputFocus('username');
                    document.getElementById('username-input')?.focus();
                  }}
                >
                  <input
                    id="username-input"
                    type="text"
                    value={currentForm.username}
                    onChange={(e) => handleInputChange(e, 'username')}
                    onFocus={() => handleInputFocus('username')}
                    onBlur={handleInputBlur}
                    onTouchStart={handleInputTouchStart}
                    onTouchEnd={(e) => handleInputTouchEnd(e, 'username')}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                    placeholder="Tap here to enter username"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    inputMode="text"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div 
                  className={`w-full border-2 rounded-lg px-3 py-3 text-base transition-all ${
                    isInputFocused && currentInput === 'password'
                      ? "border-blue-500 bg-blue-50 shadow-inner"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleInputFocus('password');
                    document.getElementById('password-input')?.focus();
                  }}
                >
                  <input
                    id="password-input"
                    type="password"
                    value={currentForm.password}
                    onChange={(e) => handleInputChange(e, 'password')}
                    onFocus={() => handleInputFocus('password')}
                    onBlur={handleInputBlur}
                    onTouchStart={handleInputTouchStart}
                    onTouchEnd={(e) => handleInputTouchEnd(e, 'password')}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                    placeholder="Tap here to enter password"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => submitWebForm("login", currentForm.username)}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors text-sm font-medium shadow-md"
              >
                Login
              </button>
            </div>
          </>
        )}
        
        {webAppInterface.currentPage === "search" && (
          <>
            <h4 className="text-lg font-bold text-gray-800 text-center">Product Search</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
                <div 
                  className={`w-full border-2 rounded-lg px-3 py-3 text-base transition-all ${
                    isInputFocused && currentInput === 'product_id'
                      ? "border-blue-500 bg-blue-50 shadow-inner"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleInputFocus('product_id');
                    document.getElementById('product-id-input')?.focus();
                  }}
                >
                  <input
                    id="product-id-input"
                    type="text"
                    value={currentForm.product_id}
                    onChange={(e) => handleInputChange(e, 'product_id')}
                    onFocus={() => handleInputFocus('product_id')}
                    onBlur={handleInputBlur}
                    onTouchStart={handleInputTouchStart}
                    onTouchEnd={(e) => handleInputTouchEnd(e, 'product_id')}
                    className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                    placeholder="Tap here to enter product ID"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    inputMode="text"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => submitWebForm("search", currentForm.product_id)}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 active:bg-green-700 transition-colors text-sm font-medium shadow-md"
              >
                Search Product
              </button>
            </div>
          </>
        )}
      </div>
      
      {webAppInterface.response && (
        <div className="mt-3 p-3 bg-gray-100 rounded-lg border">
          <p className="text-sm text-gray-700">{webAppInterface.response}</p>
        </div>
      )}

      {/* Quick Payload Buttons */}
      <div className="mt-4 space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Quick Payloads:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              const payload = "admin' --";
              setWebAppInterface(prev => ({
                ...prev,
                forms: { 
                  ...prev.forms, 
                  login: { 
                    ...prev.forms.login, 
                    username: payload,
                    password: "" 
                  } 
                },
                response: ""
              }));
              handleInputFocus('username');
            }}
            className="text-sm bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 active:bg-yellow-700 transition-colors font-medium shadow-md"
          >
            admin' --
          </button>
          <button
            type="button"
            onClick={() => {
              const payload = "1 UNION SELECT table_name, column_name FROM information_schema.columns";
              setWebAppInterface(prev => ({
                ...prev,
                forms: { 
                  ...prev.forms, 
                  search: { 
                    ...prev.forms.search, 
                    product_id: payload 
                  } 
                },
                response: ""
              }));
              handleInputFocus('product_id');
            }}
            className="text-sm bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 active:bg-purple-700 transition-colors font-medium shadow-md"
          >
            1 UNION SELECT
          </button>
        </div>
        
        {/* Clear Form Button */}
        <button
          type="button"
          onClick={() => {
            setWebAppInterface(prev => ({
              ...prev,
              forms: {
                login: { username: "", password: "", action: "/login.php", submitted: false },
                search: { product_id: "", action: "/search.php", submitted: false },
                userProfile: { user_id: "", action: "/profile.php", submitted: false }
              },
              response: ""
            }));
            setIsInputFocused(false);
            setCurrentInput(null);
          }}
          className="w-full text-sm bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-colors font-medium shadow-md"
        >
          Clear Form
        </button>
      </div>

      {/* Mobile Instructions */}
      {isInputFocused && (
        <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-700 font-medium">
            ✅ Input ready! You can now type normally without tapping again.
          </p>
        </div>
      )}
    </div>
  );
};
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="glass card-cyber p-4 sm:p-8 rounded-2xl border border-red-500/30">
            <Database className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 text-center">SQL Vault Breach</h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-lg text-center">Level 6: Advanced SQL Injection & Database Security</p>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base text-center">Level 6 Password Required</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 text-center">
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
                  placeholder="HZ-L6-..."
                  className="w-full bg-black/50 border border-red-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 text-center font-mono text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 text-center">{passwordError}</p>
                )}
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold mt-3 hover:shadow-lg hover:shadow-red-500/20 transition-all text-sm sm:text-base"
                >
                  Unlock Level 6
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Mobile-Optimized Features:
              </h4>
              <ul className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-2">
                <li>• Touch-friendly interface with large buttons</li>
                <li>• Working web application simulator with real forms</li>
                <li>• Quick payload buttons for instant testing</li>
                <li>• Mobile-optimized terminal with auto-scroll</li>
                <li>• Tab-based navigation for easy switching</li>
                <li>• Responsive design for all screen sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
      {/* Mobile Header - LIKE PORT SCANNER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/levels")}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Database className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">SQL Vault Breach</h1>
              <p className="text-red-400 text-xs">Level 6 - ADVANCED</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <div className="text-red-400 font-bold">{gameStatus.score}</div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">{gameStatus.vulnerabilitiesFound}/3</div>
                <div className="text-gray-400">Exploited</div>
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

        {/* Mobile Start Button - AT THE TOP LIKE PORT SCANNER */}
        {gameStatus.status === "idle" && (
          <div className="mt-3">
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              Start Advanced Challenge
            </button>
          </div>
        )}
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(15)].map((_, i) => (
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
              <Database className="w-8 h-8 text-red-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">SQL Vault Breach</h1>
                <p className="text-red-400 text-sm">Advanced SQL Injection & Database Security</p>
              </div>
            </div>
          </div>

          {gameStatus.status === "idle" && (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Advanced Challenge
            </button>
          )}

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {gameStatus.vulnerabilitiesFound}/3
              </div>
              <div className="text-gray-400 text-sm">Exploited</div>
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
              {/* Quick Commands */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Command className="w-5 h-5 text-red-400" />
                  Quick Commands
                </h3>
                <div className="space-y-2">
                  {quickCommands.map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTerminalInput(cmd.command);
                        setMobileMenuOpen(false);
                        setTimeout(() => {
                          handleTerminalSubmit(new Event('submit'));
                        }, 100);
                      }}
                      className="w-full text-left p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-sm"
                    >
                      <div className="text-green-400 font-mono">{cmd.command}</div>
                      <div className="text-gray-400 text-xs">{cmd.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Stats */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Game Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-red-400">{gameStatus.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vulnerabilities:</span>
                    <span className="text-green-400">{gameStatus.vulnerabilitiesFound}/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phase:</span>
                    <span className="text-cyan-400 capitalize">{gameStatus.phase}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Blocked:</span>
                    <span className="text-yellow-400">{defenseSystem.blockedAttempts}</span>
                  </div>
                </div>
              </div>

              {/* Attack Progress */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-purple-400" />
                  Attack Progress
                </h3>
                <div className="space-y-2">
                  {attackProgress.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        step.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-600 text-gray-400'
                      }`}>
                        {step.completed ? '✓' : index + 1}
                      </div>
                      <span className={`text-sm ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                        {step.description}
                      </span>
                    </div>
                  ))}
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
                className="glass card-cyber p-4 sm:p-8 max-w-2xl w-full border border-red-500/30 rounded-2xl"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 text-center">Welcome to SQL Vault Breach</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Mobile-Optimized Interface</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Touch-friendly buttons, working web forms, and easy navigation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Three Ways to Play</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Use Terminal commands, Web forms, or Manual input - all work on mobile!</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Quick Win Strategy</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Use the Web Simulator with quick payload buttons for fastest completion</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors text-sm sm:text-base"
                >
                  Start Mobile-Optimized Challenge
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Tabs Navigation */}
        <div className="lg:hidden mb-4">
          <div className="flex bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
            <button
              onClick={() => setActiveTab("terminal")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "terminal" 
                  ? "bg-red-500 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Terminal className="w-4 h-4 inline mr-1" />
              Terminal
            </button>
            <button
              onClick={() => setActiveTab("web")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "web" 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Globe className="w-4 h-4 inline mr-1" />
              Web App
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "manual" 
                  ? "bg-green-500 text-white" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4 inline mr-1" />
              Manual
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content Area - Mobile optimized */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Terminal - Show based on active tab */}
            {(activeTab === "terminal" || window.innerWidth >= 1024) && (
              <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  SQL Injection Terminal
                  {securitySystems.find(s => s.active && !s.bypassed) && (
                    <span className="text-yellow-400 text-xs sm:text-sm font-normal ml-2">
                      WAF: {securitySystems.find(s => s.active && !s.bypassed)?.name}
                    </span>
                  )}
                </h2>

                {/* Terminal Output - NOW USING terminalContainerRef */}
                <div 
                  ref={terminalContainerRef}
                  className="terminal bg-black border border-green-500/30 rounded-xl p-3 sm:p-4 h-48 sm:h-64 overflow-y-auto font-mono text-xs sm:text-sm mb-3 sm:mb-4"
                >
                  <div className="space-y-1">
                    {terminalHistory.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-2">
                        <span className="text-gray-500 text-xs flex-shrink-0">{entry.timestamp}</span>
                        <pre className={`flex-1 whitespace-pre-wrap break-words ${
                          entry.type === "error" ? "text-red-400" :
                          entry.type === "success" ? "text-green-400" :
                          entry.type === "info" ? "text-cyan-400" :
                          entry.type === "command" ? "text-yellow-400" :
                          entry.type === "prompt" ? "text-green-400 font-semibold" : "text-gray-300"
                        }`}>
                          {entry.message}
                        </pre>
                      </div>
                    ))}
                  </div>
                  <div ref={terminalEndRef} />
                </div>

                {/* Terminal Input */}
                <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 bg-gray-800 border border-green-500/30 rounded-lg p-2 sm:p-3">
                  <span className="text-green-400 font-mono text-sm">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type command... (help for list)"
                    className="flex-1 bg-transparent text-white outline-none font-mono placeholder-gray-400 text-sm sm:text-base"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-1 sm:p-2 rounded hover:bg-green-600 transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </form>

                {/* Quick Commands - Mobile Optimized */}
                <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {quickCommands.map((cmd, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTerminalInput(cmd.command);
                        setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                      }}
                      className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-left border border-gray-600/50"
                    >
                      <div className="text-green-400 font-mono text-xs break-words">{cmd.command}</div>
                      <div className="text-gray-400 text-xs mt-1">{cmd.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Web Interface Simulator - ALWAYS VISIBLE ON DESKTOP, TAB-BASED ON MOBILE */}
            {(activeTab === "web" || window.innerWidth >= 1024) && (
              <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Web Application Simulator
                  {currentChallenge && (
                    <span className="text-yellow-400 text-xs sm:text-sm font-normal ml-2">
                      {currentChallenge.title}
                    </span>
                  )}
                </h3>
                <WebInterfaceSimulator />
              </div>
            )}

            {/* Manual Input - ALWAYS VISIBLE ON DESKTOP, TAB-BASED ON MOBILE */}
            {(activeTab === "manual" || window.innerWidth >= 1024) && (
              <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  Manual Injection
                  {currentChallenge && (
                    <span className="text-green-400 text-xs sm:text-sm font-normal ml-2">
                      {currentChallenge.title}
                    </span>
                  )}
                </h3>
                
                {currentChallenge ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-red-500/30">
                      <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">{currentChallenge.title}</h4>
                      <p className="text-gray-300 text-xs sm:text-sm mb-3">{currentChallenge.description}</p>
                      
                      <div className="bg-black/70 p-2 sm:p-3 rounded border border-gray-600 mb-3">
                        <code className="text-green-400 font-mono text-xs sm:text-sm break-all">
                          {currentChallenge.originalQuery}
                        </code>
                      </div>

                      {/* Manual Input */}
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                            Enter SQL injection payload:
                          </label>
                          <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={`Try: ${currentChallenge.solution[0]}`}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 text-sm sm:text-base"
                            onKeyPress={(e) => e.key === 'Enter' && attemptInjection()}
                          />
                        </div>
                        
                        <button
                          onClick={attemptInjection}
                          className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 sm:py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all text-sm sm:text-base"
                        >
                          Execute Injection
                        </button>
                      </div>
                    </div>

                    {/* Query Visualizer */}
                    <QueryVisualizer query={sqlQuery} userInput={userInput} />

                    {/* Results */}
                    {queryResult && (
                      <div className={`border rounded-xl p-3 sm:p-4 ${
                        queryResult.includes('✅') 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <h4 className={`font-semibold mb-2 text-sm sm:text-base ${
                          queryResult.includes('✅') ? 'text-green-400' : 'text-red-400'
                        }`}>
                          Result:
                        </h4>
                        <p className={queryResult.includes('✅') ? 'text-green-300' : 'text-red-300'}>
                          {queryResult}
                        </p>
                      </div>
                    )}
                  </div>
                ) : gameStatus.phase === "defense" ? (
                  <div className="text-center py-6 sm:py-8">
                    <Shield className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4" />
                    <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Defense Phase Active</h4>
                    <p className="text-gray-400 text-xs sm:text-sm">Enable all defense rules to secure the database</p>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8">
                    <p className="text-gray-400 text-sm sm:text-base">No active challenge. Start the game to begin.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Side Panel (Hidden on mobile, accessible via menu) */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Attack Progress */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-purple-400" />
                Attack Progress
              </h3>
              <div className="space-y-3">
                {attackProgress.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-600 text-gray-400'
                    }`}>
                      {step.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm ${step.completed ? 'text-white' : 'text-gray-400'}`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Systems */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Cctv className="w-5 h-5 text-yellow-400" />
                Security Systems
              </h3>
              <div className="space-y-2">
                {securitySystems.map(system => (
                  <div key={system.id} className={`p-2 rounded border text-sm ${
                    system.active && !system.bypassed
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      : system.bypassed
                      ? 'bg-green-500/10 border-green-500/30 text-green-400'
                      : 'bg-gray-700/50 border-gray-600/50 text-gray-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span>{system.name}</span>
                      <span className="text-xs">
                        {system.active && !system.bypassed ? 'ACTIVE' : 
                         system.bypassed ? 'BYPASSED' : 'INACTIVE'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Defense Rules */}
            {gameStatus.phase === "defense" && (
              <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Defense Rules
                </h3>
                <div className="space-y-2">
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
            )}

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
                  <span className="text-gray-400">Vulnerabilities:</span>
                  <span className="text-green-400">{gameStatus.vulnerabilitiesFound}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Blocked Attempts:</span>
                  <span className="text-red-400">{defenseSystem.blockedAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Defenses:</span>
                  <span className="text-purple-400">
                    {defenseRules.filter(r => r.enabled).length}/{defenseRules.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mt-6 sm:mt-8 glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-1 sm:mb-2 text-sm sm:text-base">SQL Injection Types</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Master UNION attacks, blind SQLi, and authentication bypass</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">WAF Bypass</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn to bypass Web Application Firewalls and security filters</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Mobile Testing</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Practice SQL injection testing on mobile-friendly interfaces</p>
            </div>
            <div className="p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-1 sm:mb-2 text-sm sm:text-base">Defense Strategies</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Implement comprehensive SQL injection prevention mechanisms</p>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        {gameStatus.status === "running" && (
          <div className="mt-4 sm:mt-6 glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
            <div className="flex gap-2 sm:gap-3">
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
            </div>
          </div>
        )}

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
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">SQL vulnerabilities successfully patched</p>
                
                <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-red-500/30 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Level 7 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
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
                    className="flex-1 bg-red-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-red-600 transition-colors text-sm sm:text-base"
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
        </AnimatePresence>
      </div>
    </div>
  );
}