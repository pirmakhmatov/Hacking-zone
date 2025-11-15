// PortScanner.jsx - COMPLETE FIXED VERSION
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
  MessageSquare, FileKey, FileSearch,
  Network, Globe, Wifi, Radar, Search,
  Folder, File, Trash2, Home, Settings,
  Command, MousePointer, Keyboard, Monitor
} from "lucide-react";

export default function PortScanner() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    targetsScanned: 0,
    vulnerabilitiesFound: 0,
    level: 5,
    isPaused: false,
    lives: 3
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Port scanning game state
  const [currentTarget, setCurrentTarget] = useState("");
  const [openPorts, setOpenPorts] = useState([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [userPortInput, setUserPortInput] = useState("");
  const [gameLog, setGameLog] = useState([]);
  const [firewallDetected, setFirewallDetected] = useState(false);
  const [activeDefenses, setActiveDefenses] = useState([]);

  // Terminal simulator state
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    { id: 1, type: "output", content: "Welcome to HackingZone Terminal v2.1" },
    { id: 2, type: "output", content: "Type 'help' for available commands" },
    { id: 3, type: "output", content: "" }
  ]);
  const [currentDir, setCurrentDir] = useState("/home/hacker");
  
  const terminalHistoryRef = useRef(terminalHistory);
  const audioContextRef = useRef(null);
  const terminalEndRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const defenseIntervalRef = useRef(null);

  // Common ports and their services
  const commonPorts = {
    20: "FTP Data", 21: "FTP Control", 22: "SSH", 23: "Telnet",
    25: "SMTP", 53: "DNS", 80: "HTTP", 110: "POP3",
    143: "IMAP", 443: "HTTPS", 993: "IMAPS", 995: "POP3S",
    1433: "MSSQL", 3306: "MySQL", 3389: "RDP", 5432: "PostgreSQL",
    5900: "VNC", 27017: "MongoDB"
  };

  // Target systems with vulnerabilities
  const targetSystems = [
    {
      ip: "192.168.1.45",
      hostname: "web-server-01",
      openPorts: [22, 80, 443, 3389],
      vulnerabilities: [80, 3389],
      description: "Web Server - RDP exposed to public",
      difficulty: "easy",
      os: "Windows Server 2019"
    },
    {
      ip: "10.0.2.67", 
      hostname: "db-primary",
      openPorts: [21, 23, 53, 110, 1433],
      vulnerabilities: [21, 23, 1433],
      description: "Database Server - Clear text services active",
      difficulty: "medium",
      os: "Linux Ubuntu 20.04"
    },
    {
      ip: "172.16.8.123",
      hostname: "dev-server",
      openPorts: [22, 80, 443, 5900, 27017],
      vulnerabilities: [5900, 27017],
      description: "Development Server - Exposed database and VNC",
      difficulty: "hard",
      os: "Linux CentOS 8"
    }
  ];

  // Command reference data
  const commandCategories = [
    {
      title: "📁 File System",
      icon: <Folder className="w-4 h-4" />,
      commands: [
        { command: "ls", description: "List directory contents" },
        { command: "cd /home/hacker", description: "Change to home directory" },
        { command: "cat notes.md", description: "Display file contents" },
        { command: "pwd", description: "Show current directory" },
        { command: "clear", description: "Clear terminal screen" }
      ],
      color: "blue"
    },
    {
      title: "🔍 Scanning",
      icon: <Radar className="w-4 h-4" />,
      commands: [
        { command: "scan 192.168.1.45", description: "Start port scan on target" },
        { command: "scan 10.0.2.67", description: "Scan second target" },
        { command: "scan 172.16.8.123", description: "Scan third target" },
        { command: "vuln 80", description: "Check port vulnerability" }
      ],
      color: "green"
    },
    {
      title: "🎯 Quick Win",
      icon: <Zap className="w-4 h-4" />,
      commands: [
        { command: "scan 192.168.1.45", description: "Scan first target" },
        { command: "vuln 80", description: "Identify HTTP vulnerability" },
        { command: "vuln 3389", description: "Identify RDP vulnerability" },
        { command: "scan 10.0.2.67", description: "Scan second target" },
        { command: "vuln 21", description: "Win the game! 🏆" }
      ],
      color: "purple"
    }
  ];

  // ========== UTILITY FUNCTIONS ==========

  // FIXED: Enhanced game log with unique keys
  const addGameLog = useCallback((message, type = "info") => {
    const newLog = {
      id: Date.now() + Math.random(),
      message, 
      type, 
      timestamp: new Date().toLocaleTimeString()
    };
    
    setGameLog(prev => [newLog, ...prev.slice(0, 14)]);
  }, []);

  // Sound system
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Audio not supported');
        audioContextRef.current = null;
      }
    }
  }, []);

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

  const generateLevelPassword = useCallback(() => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L6-${password}`;
  }, []);

  // ========== GAME COMPLETION FUNCTIONS ==========

  const completeLevel = useCallback(() => {
    if (gameStatus.status === "running" && gameStatus.vulnerabilitiesFound >= 3) {
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      addGameLog("🎉 Level Completed! All vulnerabilities identified", "success");
      addGameLog(`🔑 Level 6 Password: ${password}`, "success");
      
      const xpEarned = 300 + Math.floor(gameStatus.score / 10);
      addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
      
      try {
        gameActions.completeLevel(5, xpEarned, password);
      } catch (error) {
        console.error('GameContext error:', error);
      }
      
      playSound(1000, 0.5);
    }
  }, [gameStatus.status, gameStatus.vulnerabilitiesFound, gameStatus.score, generateLevelPassword, addGameLog, gameActions, playSound]);

  const handleGameOver = useCallback((reason = "Too many incorrect identifications") => {
    setGameStatus(prev => ({ ...prev, status: "failed" }));
    addGameLog(`💀 Game Over! ${reason}`, "error");
    playSound(200, 0.5, 'sawtooth');
  }, [addGameLog, playSound]);

  // ========== SCANNING FUNCTIONS ==========

  // FIXED: Simulate port scanning progress with proper cleanup
  const simulatePortScan = useCallback((target) => {
    let progress = 0;
    
    scanIntervalRef.current = setInterval(() => {
      if (!scanning || gameStatus.isPaused) {
        clearInterval(scanIntervalRef.current);
        return;
      }

      progress += 2;
      setScanProgress(progress);

      // Randomly discover ports during scan
      if (progress % 15 === 0 && openPorts.length < target.openPorts.length) {
        const remainingPorts = target.openPorts.filter(port => !openPorts.includes(port));
        if (remainingPorts.length > 0) {
          const discoveredPort = remainingPorts[0];
          setOpenPorts(prev => [...prev, discoveredPort]);
          addGameLog(`🔍 Port ${discoveredPort} (${commonPorts[discoveredPort]}) - OPEN`, "success");
          playSound(600 + (discoveredPort * 2), 0.1);
        }
      }

      if (progress >= 100) {
        clearInterval(scanIntervalRef.current);
        setScanning(false);
        addGameLog(`✅ Scan complete! Found ${openPorts.length} open ports`, "success");
        
        // Add to terminal
        const newHistory = [...terminalHistoryRef.current];
        newHistory.push(
          { id: Date.now(), type: "output", content: `Scan completed on ${target.ip}` },
          { id: Date.now() + 1, type: "output", content: `Open ports: ${openPorts.join(', ')}` }
        );
        terminalHistoryRef.current = newHistory;
        setTerminalHistory(newHistory);
      }
    }, 100);
  }, [scanning, gameStatus.isPaused, openPorts, addGameLog, playSound, commonPorts]);

  // Defense systems (firewalls, IDS)
  const startDefenseSystems = useCallback(() => {
    if (firewallDetected) {
      addGameLog(`🛡️ Firewall detected! Some ports may be filtered`, "warning");
    }

    // Clear any existing defense interval
    if (defenseIntervalRef.current) {
      clearInterval(defenseIntervalRef.current);
    }

    defenseIntervalRef.current = setInterval(() => {
      if (gameStatus.status !== "running" || gameStatus.isPaused || !scanning) {
        clearInterval(defenseIntervalRef.current);
        return;
      }

      // Random defense events
      if (Math.random() > 0.8) {
        const defenses = ["IDS Alert", "Rate Limiting", "Connection Reset", "Stealth Mode"];
        const randomDefense = defenses[Math.floor(Math.random() * defenses.length)];
        setActiveDefenses(prev => [...prev.slice(-2), { id: Date.now(), type: randomDefense }]);
        addGameLog(`⚠️ ${randomDefense} activated`, "warning");
        playSound(400, 0.2, 'square');
      }
    }, 5000);
  }, [firewallDetected, gameStatus.status, gameStatus.isPaused, scanning, addGameLog, playSound]);

  // FIXED: Start new scanning target with proper cleanup
  const startNewScan = useCallback((target) => {
    // Clear any existing scan
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    setOpenPorts([]);
    setScanProgress(0);
    setScanning(true);
    setFirewallDetected(Math.random() > 0.7);
    setUserPortInput("");

    addGameLog(`🎯 Scanning: ${target.ip} (${target.hostname})`, "info");
    addGameLog(`📝 ${target.description}`, "warning");
    addGameLog(`💻 OS: ${target.os}`, "info");
    
    // Start defense systems
    startDefenseSystems();
    
    // Simulate port scanning
    simulatePortScan(target);
  }, [startDefenseSystems, simulatePortScan, addGameLog]);

  // FIXED: Enhanced vulnerability check
  const checkVulnerability = useCallback((portNum) => {
    if (gameStatus.status !== "running" || gameStatus.isPaused) return "invalid";

    const currentTargetData = targetSystems.find(t => t.ip === currentTarget);
    if (!currentTargetData) return "invalid";

    if (currentTargetData.vulnerabilities.includes(portNum)) {
      // Correct vulnerability identified
      setGameStatus(prev => ({
        ...prev,
        vulnerabilitiesFound: prev.vulnerabilitiesFound + 1,
        score: prev.score + 50
      }));
      addGameLog(`🎯 VULNERABILITY FOUND! Port ${portNum} (${commonPorts[portNum]}) is insecure`, "success");
      playSound(800, 0.3);

      if (gameStatus.vulnerabilitiesFound + 1 >= 3) {
        setTimeout(completeLevel, 1000);
      } else {
        setTimeout(() => {
          const nextTarget = targetSystems.find(t => t.ip !== currentTarget);
          if (nextTarget) {
            setCurrentTarget(nextTarget.ip);
            startNewScan(nextTarget);
          }
        }, 2000);
      }
      return "vulnerable";
    } else if (currentTargetData.openPorts.includes(portNum)) {
      // Port is open but not vulnerable
      setGameStatus(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 10)
      }));
      addGameLog(`❌ Port ${portNum} is open but not vulnerable`, "error");
      playSound(300, 0.2, 'square');
      return "open";
    } else {
      // Port not even open
      setGameStatus(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 20)
      }));
      addGameLog(`❌ Port ${portNum} is not open`, "error");
      playSound(200, 0.3, 'sawtooth');
      return "closed";
    }
  }, [gameStatus, currentTarget, addGameLog, playSound, completeLevel, startNewScan, commonPorts]);

  // ========== TERMINAL FUNCTIONS ==========

  // FIXED: Better vulnerability identification
  const identifyVulnerabilityInTerminal = useCallback((port) => {
    if (!port) {
      return ["Usage: vuln <port_number>", "Example: vuln 3389"];
    }
    
    if (gameStatus.status !== "running") {
      return ["Game not running"];
    }
    
    if (!currentTarget) {
      return ["No target selected. Use 'scan <ip>' first."];
    }
    
    const portNum = parseInt(port);
    if (isNaN(portNum)) {
      return [`Invalid port number: ${port}`];
    }
    
    const result = checkVulnerability(portNum);
    
    if (result === "vulnerable") {
      return [
        `✓ Vulnerability confirmed on port ${port}`,
        `Vulnerabilities found: ${gameStatus.vulnerabilitiesFound + 1}/3`
      ];
    } else if (result === "open") {
      return [`Port ${port} is open but not vulnerable`];
    } else {
      return [`Port ${port} is not open or doesn't exist`];
    }
  }, [gameStatus.status, gameStatus.vulnerabilitiesFound, currentTarget, checkVulnerability]);

  // FIXED: Better terminal scan function
  const startTerminalScan = useCallback((ip) => {
    if (!ip) {
      return ["Usage: scan <ip_address>", "Example: scan 192.168.1.45"];
    }
    
    const target = targetSystems.find(t => t.ip === ip);
    if (!target) {
      return [
        `Target not found: ${ip}`, 
        "Available targets:", 
        ...targetSystems.map(t => `  ${t.ip} (${t.hostname})`)
      ];
    }
    
    if (gameStatus.status !== "running") {
      return ["Game not running. Start the game first."];
    }
    
    setCurrentTarget(ip);
    startNewScan(target);
    
    return [
      `Starting scan on ${ip} (${target.hostname})...`,
      `Target: ${target.description}`,
      "Scanning ports..."
    ];
  }, [gameStatus.status, startNewScan]);

  // FIXED: Enhanced terminal command processor
  const processCommand = useCallback((command) => {
    const args = command.trim().split(' ');
    const cmd = args[0].toLowerCase();
    
    switch(cmd) {
      case 'help':
        return [
          "Available commands:",
          "  ls, dir         - List directory contents",
          "  cd <dir>        - Change directory",
          "  cat <file>      - Display file contents",
          "  pwd             - Show current directory",
          "  scan <ip>       - Start port scan on target",
          "  nmap <options>  - Advanced port scanning",
          "  vuln <port>     - Identify vulnerable port",
          "  clear           - Clear terminal",
          "  help            - Show this help"
        ];
      
      case 'ls':
      case 'dir':
        return ["notes.md", "scan_results.txt", "tools/"];
      
      case 'cd':
        if (!args[1] || args[1] === '~' || args[1] === '/home/hacker') {
          setCurrentDir("/home/hacker");
          return ["Changed to home directory"];
        }
        if (args[1] === '..') {
          setCurrentDir("/home/hacker");
          return ["Changed to home directory"];
        }
        if (args[1] === 'tools') {
          setCurrentDir("/home/hacker/tools");
          return ["Changed to tools directory"];
        }
        return [`Directory not found: ${args[1]}`];
      
      case 'cat':
        if (args[1] === 'notes.md') {
          return [
            "# Target List",
            "- 192.168.1.45 (Web Server)",
            "- 10.0.2.67 (Database Server)", 
            "- 172.16.8.123 (Dev Server)",
            "",
            "Common vulnerable ports:",
            "• 21, 23 - Clear text protocols",
            "• 80, 443 - Web services",
            "• 3389, 5900 - Remote access",
            "• 1433, 27017 - Databases"
          ];
        }
        if (args[1] === 'scan_results.txt') {
          return ["Previous scan: 192.168.1.1 - Ports: 22,80,443"];
        }
        if (args[1] === 'nmap_guide.txt') {
          return [
            "Common nmap commands:",
            "nmap -sS target_ip    - Stealth SYN scan",
            "nmap -p 1-1000 target_ip - Scan first 1000 ports",
            "nmap -A target_ip     - Aggressive scan"
          ];
        }
        return [`File not found: ${args[1]}`];
      
      case 'pwd':
        return [currentDir];
      
      case 'scan':
        return startTerminalScan(args[1]);
      
      case 'nmap':
        if (!currentTarget) {
          return ["No target selected. Use: scan <ip> first"];
        }
        return [`nmap ${args.slice(1).join(' ')} ${currentTarget}`, "Scanning..."];
      
      case 'vuln':
        return identifyVulnerabilityInTerminal(args[1]);
      
      case 'clear':
        setTerminalHistory([{ id: Date.now(), type: "output", content: "Terminal cleared" }]);
        return [];
      
      case '':
        return [];
      
      default:
        return [`Command not found: ${cmd}. Type 'help' for available commands.`];
    }
  }, [currentTarget, currentDir, startTerminalScan, identifyVulnerabilityInTerminal]);

  // FIXED: Enhanced terminal submit handler
  const handleTerminalSubmit = useCallback((e) => {
    e.preventDefault();
    const input = terminalInput.trim();
    if (!input) return;
    
    const newHistory = [...terminalHistoryRef.current];
    const timestamp = Date.now();
    
    // Add user input to history
    newHistory.push({ 
      id: timestamp, 
      type: "input", 
      content: `hacker@hackingzone:~${currentDir}$ ${input}` 
    });
    
    // Process command and add output
    const output = processCommand(input);
    output.forEach((line, index) => {
      newHistory.push({ 
        id: timestamp + index + 1, 
        type: "output", 
        content: line 
      });
    });
    
    // Update both ref and state
    terminalHistoryRef.current = newHistory;
    setTerminalHistory(newHistory);
    setTerminalInput("");
  }, [terminalInput, currentDir, processCommand]);

  // ========== GAME CONTROL FUNCTIONS ==========

  // FIXED: Enhanced start game with proper initialization
  const startGame = useCallback(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    initAudio();
    
    setGameStatus({
      status: "running",
      timeElapsed: 0,
      score: 0,
      targetsScanned: 0,
      vulnerabilitiesFound: 0,
      level: 5,
      isPaused: false,
      lives: 3
    });
    
    setActiveDefenses([]);
    setGameLog([]);
    setLevelPassword("");
    setShowTutorial(false);
    setCurrentTarget("");
    setOpenPorts([]);
    setScanProgress(0);
    setScanning(false);
    
    // Initialize terminal with unique IDs
    const initialHistory = [
      { id: 1, type: "output", content: "Welcome to HackingZone Terminal v2.1" },
      { id: 2, type: "output", content: "Game started! Type 'help' for commands" },
      { id: 3, type: "output", content: "Use: scan 192.168.1.45 to begin" },
      { id: 4, type: "output", content: "" }
    ];
    
    terminalHistoryRef.current = initialHistory;
    setTerminalHistory(initialHistory);
    
    addGameLog("🚀 Game started! Use terminal commands to scan targets", "info");
    playSound(523, 0.2);
  }, [isAuthenticated, navigate, initAudio, addGameLog, playSound]);

  const pauseGame = useCallback(() => {
    setGameStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
    setScanning(prev => !prev);
  }, []);

  // FIXED: Enhanced reset with proper cleanup
  const resetGame = useCallback(() => {
    // Clear intervals
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    if (defenseIntervalRef.current) {
      clearInterval(defenseIntervalRef.current);
    }
    
    setGameStatus({
      status: "idle",
      timeElapsed: 0,
      score: 0,
      targetsScanned: 0,
      vulnerabilitiesFound: 0,
      level: 5,
      isPaused: false,
      lives: 3
    });
    setActiveDefenses([]);
    setGameLog([]);
    setLevelPassword("");
    setCurrentTarget("");
    setOpenPorts([]);
    setScanProgress(0);
    setScanning(false);
    
    // Reset terminal
    const resetHistory = [
      { id: 1, type: "output", content: "Welcome to HackingZone Terminal v2.1" },
      { id: 2, type: "output", content: "Type 'help' for available commands" },
      { id: 3, type: "output", content: "" }
    ];
    
    terminalHistoryRef.current = resetHistory;
    setTerminalHistory(resetHistory);
  }, []);

  // ========== PASSWORD FUNCTIONS ==========

  const getStoredLevelPassword = useCallback(() => {
    const sources = [
      gameState.levelPasswords[5],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[5],
      localStorage.getItem('level5_password')
    ];

    return sources.find(p => p && p.startsWith('HZ-L5-'));
  }, [gameState.levelPasswords]);

  const normalizePassword = useCallback((password) => {
    return password.trim().toUpperCase();
  }, []);

  const checkLevelPassword = useCallback(() => {
    initAudio();
    
    const inputPassword = normalizePassword(passwordInput);
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      setPasswordError("Please enter the Level 5 password");
      return;
    }
    
    if (!savedPassword) {
      setPasswordError("No Level 5 password found. Please complete Encrypted Zone level first.");
      return;
    }
    
    const normalizedSavedPassword = normalizePassword(savedPassword);
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setPasswordError("");
      setShowTutorial(true);
      gameActions.unlockLevel(5);
      playSound(800, 0.2);
    } else {
      setPasswordError(`Invalid Level 5 password. The password should start with "HZ-L5-".`);
      playSound(300, 0.3, 'square');
    }
  }, [passwordInput, getStoredLevelPassword, normalizePassword, initAudio, playSound, gameActions]);

  const skipPassword = useCallback(() => {
    initAudio();
    setGameStatus(prev => ({ ...prev, status: "idle" }));
    setShowTutorial(true);
    gameActions.unlockLevel(5);
  }, [initAudio, gameActions]);

  const copyPasswordToClipboard = useCallback(() => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  }, [levelPassword]);

  // ========== EFFECTS ==========

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
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStatus.status, gameStatus.isPaused]);

  // FIXED: Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // FIXED: Update ref when terminalHistory changes
  useEffect(() => {
    terminalHistoryRef.current = terminalHistory;
  }, [terminalHistory]);

  // Check level status
  useEffect(() => {
    if (gameState.isLoading) return;

    if (gameState.completedLevels.includes(5)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      const existingPassword = gameState.levelPasswords[6];
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
      return;
    }

    if (gameState.levelUnlocks[5] || gameState.completedLevels.includes(4)) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      if (!gameState.levelUnlocks[5]) {
        gameActions.unlockLevel(5);
      }
    }
  }, [gameState.completedLevels, gameState.levelUnlocks, gameState.isLoading, gameActions]);

  // ========== UI COMPONENTS ==========

  const getPortColor = (port) => {
    const currentTargetData = targetSystems.find(t => t.ip === currentTarget);
    if (currentTargetData?.vulnerabilities.includes(port)) {
      return "bg-red-500/20 border-red-500/40 shadow-lg shadow-red-500/20";
    }
    return "bg-green-500/10 border-green-500/30";
  };

  // FIXED: Enhanced terminal design component with proper keys
  const TerminalWithDesign = () => (
    <div className="glass card-cyber rounded-2xl border border-green-500/30 h-96 overflow-hidden bg-gray-900/80 backdrop-blur-sm relative">
      {/* Animated Border */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-purple-500/20 rounded-2xl animate-pulse" />
      
      {/* Terminal Header */}
      <div className="bg-gradient-to-r from-green-900/40 to-green-800/20 border-b border-green-500/30 p-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer"></div>
            </div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              HackingZone Terminal
              <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full">v2.1</span>
            </h3>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs">
            <Monitor className="w-3 h-3" />
            <span>hacker@root</span>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-4 h-80 overflow-y-auto bg-black/70 font-mono text-sm terminal-scrollbar relative z-10">
        <div className="space-y-1">
          {terminalHistory.map((item) => (
            <div
              key={`terminal-${item.id}`}
              className={`${
                item.type === "input" 
                  ? "text-cyan-300 bg-cyan-500/10 border-l-2 border-cyan-500 pl-2 py-1" 
                  : "text-green-300"
              } whitespace-pre-wrap leading-relaxed`}
            >
              {item.type === "input" ? (
                <>
                  <span className="text-green-400">hacker@hackingzone</span>
                  <span className="text-purple-400">:~{currentDir}$</span>
                  <span className="text-cyan-300 ml-1">{item.content.replace(`hacker@hackingzone:~${currentDir}$ `, '')}</span>
                </>
              ) : (
                item.content
              )}
            </div>
          ))}
        </div>
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input */}
      <form onSubmit={handleTerminalSubmit} className="border-t border-gray-700 bg-black/50 relative z-10">
        <div className="flex items-center p-3">
          <span className="text-green-400 font-mono text-sm">
            <span className="text-green-300">hacker@hackingzone</span>
            <span className="text-purple-400">:~{currentDir}$</span>
          </span>
          <input
            type="text"
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-cyan-300 font-mono ml-2 placeholder-cyan-300/50"
            placeholder="Type command and press Enter..."
            autoFocus
          />
          <Keyboard className="w-4 h-4 text-gray-500 mr-2" />
        </div>
      </form>
    </div>
  );

  // FIXED: Command Reference Component with proper keys
  const CommandReference = () => (
    <div className="glass card-cyber p-6 rounded-2xl border border-blue-500/30 bg-gray-900/60 backdrop-blur-sm relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5 rounded-2xl" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Command className="w-5 h-5 text-blue-400" />
          Command Reference
          <span className="text-blue-400 text-sm bg-blue-500/20 px-2 py-1 rounded-full ml-2">Click to Use</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commandCategories.map((category, categoryIndex) => (
            <motion.div
              key={`category-${categoryIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className={`bg-gradient-to-br from-${category.color}-500/10 to-${category.color}-600/5 rounded-xl border border-${category.color}-500/20 p-4 hover:border-${category.color}-400/40 transition-all duration-300 hover:scale-105 cursor-pointer group backdrop-blur-sm`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`text-${category.color}-400`}>
                  {category.icon}
                </div>
                <h4 className="text-white font-semibold text-sm">{category.title}</h4>
              </div>
              
              <div className="space-y-2">
                {category.commands.map((cmd, cmdIndex) => (
                  <motion.div
                    key={`cmd-${categoryIndex}-${cmdIndex}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTerminalInput(cmd.command);
                      // Auto-submit for quick win commands
                      if (category.title === "🎯 Quick Win") {
                        setTimeout(() => {
                          const event = new Event('submit', { bubbles: true });
                          document.querySelector('form')?.dispatchEvent(event);
                        }, 100);
                      }
                    }}
                    className={`p-2 rounded-lg bg-${category.color}-500/5 border border-${category.color}-500/10 hover:bg-${category.color}-500/10 hover:border-${category.color}-400/30 transition-all duration-200 group cursor-pointer`}
                  >
                    <div className="flex items-start gap-2">
                      <MousePointer className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0 group-hover:text-white transition-colors" />
                      <div className="flex-1">
                        <code className={`text-${category.color}-300 font-mono text-xs block group-hover:text-${category.color}-200 transition-colors`}>
                          {cmd.command}
                        </code>
                        <p className="text-gray-400 text-xs mt-1 group-hover:text-gray-300 transition-colors">
                          {cmd.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <Zap className="w-4 h-4" />
            <span className="font-semibold">Pro Tip:</span>
            <span>Click any command to auto-fill the terminal!</span>
          </div>
        </div>
      </div>
    </div>
  );

  // FIXED: Enhanced visual scan results with proper keys
  const VisualScanResults = () => (
    <div className="glass card-cyber p-6 rounded-2xl border border-orange-500/30 bg-gray-900/60 backdrop-blur-sm relative">
      {/* Animated Border */}
      <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-red-500/10 rounded-2xl animate-pulse" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Radar className="w-5 h-5 text-orange-400" />
          Network Scanner
          <span className="text-orange-400 text-sm bg-orange-500/20 px-2 py-1 rounded-full ml-2">Live</span>
        </h3>
        
        {/* Target Info */}
        {currentTarget && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-4 mb-4 border border-blue-500/20"
          >
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              Active Target
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">IP Address:</span>
                <span className="text-green-400 ml-2 font-mono">{currentTarget}</span>
              </div>
              <div>
                <span className="text-gray-400">Hostname:</span>
                <span className="text-cyan-400 ml-2 font-mono">
                  {targetSystems.find(t => t.ip === currentTarget)?.hostname}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Operating System:</span>
                <span className="text-yellow-400 ml-2">
                  {targetSystems.find(t => t.ip === currentTarget)?.os}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Scan Status:</span>
                <span className={`ml-2 ${scanning ? 'text-yellow-400' : 'text-green-400'} font-semibold`}>
                  {scanning ? '🟡 SCANNING...' : '🟢 READY'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scan Progress */}
        {scanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 mb-4 border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold flex items-center gap-2">
                <Scan className="w-4 h-4 text-blue-400" />
                Port Discovery in Progress
              </span>
              <span className="text-blue-400 font-mono bg-blue-500/20 px-2 py-1 rounded">{scanProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/20"
              />
            </div>
            <div className="text-gray-400 text-xs flex justify-between">
              <span>Initializing...</span>
              <span>Port Discovery</span>
              <span>Analysis</span>
              <span>Complete</span>
            </div>
          </motion.div>
        )}

        {/* Open Ports Display */}
        {openPorts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Network className="w-4 h-4 text-green-400" />
              Discovered Ports
              <span className="text-green-400 text-sm bg-green-500/20 px-2 py-1 rounded-full">
                {openPorts.length} Found
              </span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {openPorts.map(port => {
                const isVulnerable = targetSystems.find(t => t.ip === currentTarget)?.vulnerabilities.includes(port);
                return (
                  <motion.div
                    key={`port-${port}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                      isVulnerable 
                        ? 'bg-red-500/20 border-red-500/40 shadow-lg shadow-red-500/20 hover:border-red-400' 
                        : 'bg-green-500/10 border-green-500/30 hover:border-green-400'
                    }`}
                  >
                    <div className="text-white font-bold text-lg font-mono">{port}</div>
                    <div className="text-gray-300 text-xs mt-1">{commonPorts[port]}</div>
                    {isVulnerable && (
                      <div className="text-red-400 text-xs mt-1 font-semibold">⚠️ VULNERABLE</div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        {!currentTarget && (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No target selected</p>
            <p className="text-gray-500 text-sm mt-1">Use the terminal or command reference to start scanning</p>
          </div>
        )}
      </div>
    </div>
  );

  // CSS for custom scrollbar
  const TerminalStyles = () => (
    <style jsx>{`
      .terminal-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .terminal-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      .terminal-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(34, 197, 94, 0.5);
        border-radius: 3px;
      }
      .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(34, 197, 94, 0.7);
      }
    `}</style>
  );

  // ========== RENDER LOGIC ==========

  // Locked level screen
  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8 px-4 pt-24 relative overflow-hidden">
        {/* Futuristic Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full blur-sm"
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="glass card-cyber p-8 rounded-2xl border border-orange-500/30 bg-gray-900/60 backdrop-blur-sm">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Radar className="w-16 h-16 text-orange-400 mx-auto mb-6" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white mb-4">The Port Scanner</h1>
            <p className="text-gray-300 mb-6 text-lg">Level 5: Network Scanning & Vulnerability Assessment</p>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-6">
              <Key className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Level 5 Password Required</h3>
              <p className="text-gray-300 text-sm mb-4">
                Enter the password from Encrypted Zone level
              </p>
              
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter Level 5 Password (HZ-L5-...)"
                  className="w-full bg-black/50 border border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 text-center font-mono"
                  onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                />
                {passwordError && (
                  <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                )}
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold mt-4 hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Unlock Level 5
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                What to Expect:
              </h4>
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• Scan network targets for open ports</li>
                <li>• Identify vulnerable services and misconfigurations</li>
                <li>• Evade firewall and intrusion detection systems</li>
                <li>• Learn common port numbers and their services</li>
                <li>• Understand network reconnaissance techniques</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-8 px-4 pt-24 relative overflow-hidden">
      <TerminalStyles />
      
      {/* Futuristic Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-20 grid-rows-20 h-full w-full">
            {[...Array(400)].map((_, i) => (
              <div
                key={`grid-${i}`}
                className="border border-cyan-500/10 animate-pulse"
                style={{
                  animationDelay: `${(i % 10) * 0.1}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`float-${i}`}
              className="absolute"
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full blur-sm" />
            </motion.div>
          ))}
        </div>

        {/* Scanning Lines */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-cyan-500/5"
          animate={{
            y: ['-100%', '200%'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/levels")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50 hover:border-gray-600/50"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Levels
            </button>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Radar className="w-8 h-8 text-orange-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-white">The Port Scanner</h1>
                <p className="text-orange-400 text-sm">Network Scanning & Vulnerability Assessment</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center bg-orange-500/10 px-4 py-2 rounded-xl border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center bg-green-500/10 px-4 py-2 rounded-xl border border-green-500/20">
              <div className="text-2xl font-bold text-green-400">
                {gameStatus.vulnerabilitiesFound}/3
              </div>
              <div className="text-gray-400 text-sm">Vulnerabilities</div>
            </div>
            <div className="text-center bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
              <div className="flex items-center gap-1">
                <div className="text-2xl font-bold text-red-400">{gameStatus.lives}</div>
                <Shield className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-gray-400 text-sm">Lives</div>
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
                className="glass card-cyber p-8 max-w-4xl mx-4 border border-orange-500/30 rounded-2xl bg-gray-900/80 backdrop-blur-sm"
              >
                <h2 className="text-3xl font-bold text-white mb-4 text-center">Welcome to The Port Scanner</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-orange-400">🎯 Game Objective</h3>
                    <p className="text-gray-300">Find 3 vulnerable ports across different target systems using both terminal commands and visual interface.</p>
                    
                    <h3 className="text-xl font-semibold text-green-400">💻 Terminal Commands</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li><code className="bg-gray-800 px-2 py-1 rounded">scan 192.168.1.45</code> - Start port scan</li>
                      <li><code className="bg-gray-800 px-2 py-1 rounded">vuln 3389</code> - Identify vulnerable port</li>
                      <li><code className="bg-gray-800 px-2 py-1 rounded">ls</code> - List files</li>
                      <li><code className="bg-gray-800 px-2 py-1 rounded">cat notes.md</code> - Read files</li>
                      <li><code className="bg-gray-800 px-2 py-1 rounded">help</code> - Show all commands</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-red-400">⚠️ High-Risk Ports</h3>
                    <ul className="text-gray-300 space-y-1 text-sm">
                      <li>• 21, 23 - Clear text protocols</li>
                      <li>• 25 - Mail server risks</li>
                      <li>• 1433, 27017 - Database exposure</li>
                      <li>• 3389, 5900 - Remote access</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold text-yellow-400">🛡️ Defenses</h3>
                    <p className="text-gray-300 text-sm">Watch for firewalls, IDS alerts, and other security measures that may slow your scanning.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors"
                >
                  Start Hacking!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Terminal & Scanner */}
          <div className="space-y-6">
            <TerminalWithDesign />
            <VisualScanResults />
          </div>

          {/* Right Column - Command Reference & Controls */}
          <div className="space-y-6">
            <CommandReference />
            
            {/* Game Controls */}
            <div className="glass card-cyber p-6 rounded-2xl border border-purple-500/30 bg-gray-900/60 backdrop-blur-sm relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-2xl" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  Game Controls
                </h3>
                
                <div className="flex gap-3 mb-4">
                  {gameStatus.status === "idle" ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startGame}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Start Game
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={pauseGame}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        {gameStatus.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                        {gameStatus.isPaused ? "Resume" : "Pause"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={resetGame}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Reset Game
                      </motion.button>
                    </>
                  )}
                </div>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <span className="text-gray-300 text-sm">Sound Effects</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg transition-all ${
                      soundEnabled 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Active Defenses */}
            {activeDefenses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass card-cyber p-6 rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-sm"
              >
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-400" />
                  Active Defense Systems
                  <span className="text-red-400 text-sm bg-red-500/20 px-2 py-1 rounded-full ml-2">
                    {activeDefenses.length} Active
                  </span>
                </h3>
                <div className="space-y-2">
                  {activeDefenses.map(defense => (
                    <motion.div
                      key={`defense-${defense.id}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      {defense.type}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Game Log */}
            <div className="glass card-cyber p-6 rounded-2xl border border-cyan-500/30 bg-gray-900/60 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Activity Log
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-4 max-h-60 overflow-y-auto">
                {gameLog.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {gameLog.map(log => (
                      <div key={`gamelog-${log.id}`} className="flex items-start gap-3 text-sm">
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass card-cyber p-6 rounded-2xl border border-cyan-500/30 bg-gray-900/60 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Port Scanning",
                description: "Learn network reconnaissance and port discovery techniques",
                color: "orange",
                icon: <Radar className="w-5 h-5" />
              },
              {
                title: "Service Identification", 
                description: "Understand common port numbers and their associated services",
                color: "green",
                icon: <Network className="w-5 h-5" />
              },
              {
                title: "Vulnerability Assessment",
                description: "Identify insecure services and misconfigurations",
                color: "red", 
                icon: <AlertTriangle className="w-5 h-5" />
              },
              {
                title: "Terminal Proficiency",
                description: "Master Linux commands and network tools",
                color: "blue",
                icon: <Terminal className="w-5 h-5" />
              }
            ].map((obj, index) => (
              <motion.div
                key={`objective-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 bg-${obj.color}-500/10 rounded-xl border border-${obj.color}-500/20 hover:border-${obj.color}-400/40 transition-all duration-300`}
              >
                <div className={`text-${obj.color}-400 mb-2`}>
                  {obj.icon}
                </div>
                <h4 className={`font-semibold text-${obj.color}-400 mb-2`}>{obj.title}</h4>
                <p className="text-gray-300 text-sm">{obj.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Overlays */}
        <AnimatePresence>
          {gameStatus.status === "completed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="text-center bg-gray-800/95 p-8 rounded-2xl border border-green-500/30 max-w-md mx-4 shadow-2xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Level Complete!</h3>
                <p className="text-gray-300 mb-4">All vulnerabilities successfully identified</p>
                
                <div className="bg-gray-700/80 p-4 rounded-xl border border-orange-500/30 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-orange-400" />
                      <span className="text-white font-semibold">Level 6 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
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
                    className="flex-1 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
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

          {gameStatus.status === "failed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="text-center bg-gray-800/95 p-8 rounded-2xl border border-red-500/30 max-w-md mx-4">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Scan Detected!</h3>
                <p className="text-gray-300 mb-4">Target systems detected your activities</p>
                <button
                  onClick={resetGame}
                  className="bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition-colors"
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