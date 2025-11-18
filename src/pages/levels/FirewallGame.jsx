import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Shield, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft, Settings,
  Network, Lock, Unlock, Filter, Eye, EyeOff, Server,
  Users, Cpu, Wifi, Globe, Terminal, Key, Copy, Check, Menu, X
} from "lucide-react";

export default function FirewallGame() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "idle",
    timeElapsed: 0,
    score: 0,
    attacksBlocked: 0,
    attacksMissed: 0,
    level: 1,
    isPaused: false
  });

  const [firewallRules, setFirewallRules] = useState([
    { id: 1, protocol: "TCP", port: "22", action: "ALLOW", source: "192.168.1.0/24", enabled: true, description: "SSH Access - Internal Network" },
    { id: 2, protocol: "TCP", port: "80", action: "ALLOW", source: "0.0.0.0/0", enabled: true, description: "HTTP Access - Public" },
    { id: 3, protocol: "TCP", port: "443", action: "ALLOW", source: "0.0.0.0/0", enabled: true, description: "HTTPS Access - Public" },
    { id: 4, protocol: "TCP", port: "21", action: "DENY", source: "0.0.0.0/0", enabled: false, description: "FTP - Block All" },
    { id: 5, protocol: "TCP", port: "23", action: "DENY", source: "0.0.0.0/0", enabled: false, description: "Telnet - Block All" },
    { id: 6, protocol: "UDP", port: "53", action: "ALLOW", source: "192.168.1.0/24", enabled: true, description: "DNS - Internal Only" },
    { id: 7, protocol: "TCP", port: "3389", action: "DENY", source: "0.0.0.0/0", enabled: false, description: "RDP - Block All" },
    { id: 8, protocol: "TCP", port: "1433", action: "DENY", source: "0.0.0.0/0", enabled: false, description: "SQL Server - Block All" },
    { id: 9, protocol: "TCP", port: "80", action: "DENY", source: "suspicious", enabled: false, description: "Block HTTP DDoS" },
    { id: 10, protocol: "TCP", port: "443", action: "DENY", source: "suspicious", enabled: false, description: "Block HTTPS DDoS" },
    { id: 11, protocol: "UDP", port: "53", action: "DENY", source: "external", enabled: false, description: "Block DNS Amplification" },
    { id: 12, protocol: "*", port: "*", action: "DENY", source: "unknown", enabled: false, description: "Block All Unknown Traffic" }
  ]);

  const [incomingAttacks, setIncomingAttacks] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user has already completed this level
  useEffect(() => {
    if (gameState.completedLevels.includes(1)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      // Load the existing password
      const existingPassword = gameState.levelPasswords[2] || localStorage.getItem('level2_password');
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
    }
  }, [gameState.completedLevels, gameState.levelPasswords]);

  // Generate a unique password for this level completion
  const generateLevelPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L2-${password}`;
  };

  // Attack patterns for different levels
  const attackPatterns = {
    1: [
      { type: "DDoS", protocol: "TCP", port: "80", source: "random", intensity: "low", description: "HTTP Flood Attack" },
      { type: "PortScan", protocol: "TCP", port: "22", source: "internal", intensity: "low", description: "SSH Port Scanning" },
      { type: "BruteForce", protocol: "TCP", port: "21", source: "external", intensity: "low", description: "FTP Brute Force" }
    ],
    2: [
      { type: "DDoS", protocol: "TCP", port: "443", source: "random", intensity: "medium", description: "HTTPS Flood Attack" },
      { type: "PortScan", protocol: "TCP", port: "3389", source: "external", intensity: "medium", description: "RDP Port Scanning" },
      { type: "Malware", protocol: "TCP", port: "4444", source: "suspicious", intensity: "medium", description: "Backdoor Connection" },
      { type: "Exploit", protocol: "TCP", port: "1433", source: "external", intensity: "medium", description: "SQL Injection Attempt" }
    ],
    3: [
      { type: "DDoS", protocol: "UDP", port: "53", source: "random", intensity: "high", description: "DNS Amplification" },
      { type: "Advanced", protocol: "TCP", port: "8080", source: "suspicious", intensity: "high", description: "Web Shell Upload" },
      { type: "ZeroDay", protocol: "TCP", port: "8443", source: "external", intensity: "high", description: "Unknown Exploit" }
    ]
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

  // Generate incoming attacks
  useEffect(() => {
    let attackInterval;
    if (gameStatus.status === "running" && !gameStatus.isPaused) {
      attackInterval = setInterval(() => {
        const patterns = attackPatterns[gameStatus.level];
        const randomAttack = patterns[Math.floor(Math.random() * patterns.length)];
        
        const newAttack = {
          id: Date.now(),
          ...randomAttack,
          timestamp: new Date().toLocaleTimeString(),
          position: { x: Math.random() * 70 + 15, y: Math.random() * 60 + 20 }
        };

        setIncomingAttacks(prev => [...prev, newAttack]);
        addGameLog(`🚨 Incoming ${newAttack.type} on port ${newAttack.port}`, "warning");
      }, 3000 - (gameStatus.level * 800));
    }
    return () => clearInterval(attackInterval);
  }, [gameStatus.status, gameStatus.isPaused, gameStatus.level]);

  // Check if attacks reach the server
  useEffect(() => {
    const checkAttacks = setInterval(() => {
      if (gameStatus.status === "running" && !gameStatus.isPaused) {
        setIncomingAttacks(prevAttacks => {
          const updatedAttacks = prevAttacks.filter(attack => {
            const isBlocked = checkIfBlocked(attack);
            if (!isBlocked) {
              setGameStatus(prevStatus => {
                const newMissedCount = prevStatus.attacksMissed + 1;
                const newScore = Math.max(0, prevStatus.score - 10);
                
                if (newMissedCount >= 6) {
                  setTimeout(() => handleGameOver(), 0);
                }
                
                return {
                  ...prevStatus,
                  attacksMissed: newMissedCount,
                  score: newScore
                };
              });
              
              addGameLog(`❌ ${attack.type} reached server! Port ${attack.port} compromised`, "error");
              return false;
            }
            return true;
          });
          return updatedAttacks;
        });
      }
    }, 1000);

    return () => clearInterval(checkAttacks);
  }, [gameStatus.status, gameStatus.isPaused]);

  const checkIfBlocked = (attack) => {
    const relevantRules = firewallRules.filter(rule => 
      rule.enabled && 
      rule.protocol === attack.protocol &&
      (rule.port === attack.port || rule.port === "*")
    );

    if (relevantRules.length === 0) return false;

    const isDenied = relevantRules.some(rule => rule.action === "DENY");
    const isAllowed = relevantRules.some(rule => rule.action === "ALLOW");

    return isDenied || !isAllowed;
  };

  const handleAttackClick = (attack) => {
    if (gameStatus.status !== "running" || gameStatus.isPaused) return;

    const isBlocked = checkIfBlocked(attack);
    
    if (isBlocked) {
      setGameStatus(prev => ({
        ...prev,
        attacksBlocked: prev.attacksBlocked + 1,
        score: prev.score + 20
      }));
      addGameLog(`✅ Blocked ${attack.type} on port ${attack.port}`, "success");
    } else {
      setGameStatus(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 5)
      }));
      addGameLog(`⚠️  No rule to block ${attack.type} on port ${attack.port}`, "warning");
    }

    setIncomingAttacks(prev => prev.filter(a => a.id !== attack.id));
  };

  const toggleRule = (ruleId) => {
    setFirewallRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const addGameLog = (message, type = "info") => {
    setGameLog(prev => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
  };

  const startGame = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    setGameStatus({
      status: "running",
      timeElapsed: 0,
      score: 0,
      attacksBlocked: 0,
      attacksMissed: 0,
      level: 1,
      isPaused: false
    });
    setIncomingAttacks([]);
    setGameLog([]);
    setLevelPassword("");
    setShowTutorial(false);
    setMobileMenuOpen(false);
    addGameLog("🚀 Game started! Configure your firewall rules to block incoming attacks", "info");
  };

  const pauseGame = () => {
    setGameStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameStatus({
      status: "idle",
      timeElapsed: 0,
      score: 0,
      attacksBlocked: 0,
      attacksMissed: 0,
      level: 1,
      isPaused: false
    });
    setIncomingAttacks([]);
    setGameLog([]);
    setLevelPassword("");
    setMobileMenuOpen(false);
    setFirewallRules(rules => rules.map(rule => ({ ...rule, enabled: rule.id <= 3 })));
  };

  const handleGameOver = () => {
    setGameStatus(prev => ({ ...prev, status: "failed" }));
    addGameLog("💀 Game Over! Too many attacks reached your server", "error");
    
    try {
      if (gameStatus.score > 0 && gameActions && typeof gameActions.addXP === 'function') {
        gameActions.addXP(50);
        addGameLog("✨ +50 XP for effort!", "success");
      }
    } catch (error) {
      console.error('Error in handleGameOver:', error);
    }
  };

  // Enhanced completeLevel function with persistence
  const completeLevel = () => {
    if (gameStatus.status === "running" && gameStatus.attacksBlocked >= 10) {
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      addGameLog("🎉 Level Completed! All attacks successfully blocked", "success");
      addGameLog(`🔑 Level 2 Password: ${password}`, "success");
      
      // XP calculation
      const xpEarned = 100 + Math.floor(gameStatus.score / 10);
      addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
      
      console.log('💾 Saving Level 1 completion with password...');
      
      // Multiple persistence methods
      try {
        // Method 1: GameContext (primary)
        if (gameActions.completeLevel) {
          gameActions.completeLevel(1, xpEarned);
          console.log('✅ Level 1 completed via GameContext');
        }
        
        if (gameActions.setLevelPassword) {
          gameActions.setLevelPassword(2, password);
          console.log('✅ Level 2 password saved via GameContext');
        }
        
      } catch (error) {
        console.error('❌ GameContext error:', error);
      }
      
      // Method 2: Direct localStorage (fallback)
      try {
        console.log('💾 Direct localStorage save...');
        
        // Completed levels
        const currentCompleted = JSON.parse(localStorage.getItem('hacking_zone_completed_levels') || '[]');
        if (!currentCompleted.includes(1)) {
          currentCompleted.push(1);
          localStorage.setItem('hacking_zone_completed_levels', JSON.stringify(currentCompleted));
        }
        
        // XP
        const currentXP = parseInt(localStorage.getItem('hacking_zone_total_xp') || '0');
        localStorage.setItem('hacking_zone_total_xp', (currentXP + xpEarned).toString());
        
        // Current level
        const currentLevel = parseInt(localStorage.getItem('hacking_zone_current_level') || '1');
        localStorage.setItem('hacking_zone_current_level', Math.max(currentLevel, 2).toString());
        
        // Password - multiple storage methods
        const currentPasswords = JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}');
        currentPasswords[2] = password;
        localStorage.setItem('hacking_zone_level_passwords', JSON.stringify(currentPasswords));
        
        // Additional password storage for redundancy
        localStorage.setItem('level2_password', password);
        sessionStorage.setItem('level2_password', password);
        
        console.log('✅ Direct localStorage save successful');
        
      } catch (fallbackError) {
        console.error('❌ Direct localStorage save failed:', fallbackError);
      }
      
      // Method 3: Force GameContext refresh
      setTimeout(() => {
        if (gameActions.refreshGameData) {
          gameActions.refreshGameData();
        }
      }, 1000);
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  useEffect(() => {
    if (gameStatus.attacksBlocked >= 10 && gameStatus.status === "running") {
      completeLevel();
    }
  }, [gameStatus.attacksBlocked, gameStatus.status]);

  const getAttackColor = (type) => {
    switch (type) {
      case "DDoS": return "from-red-500 to-pink-500";
      case "PortScan": return "from-yellow-500 to-orange-500";
      case "BruteForce": return "from-purple-500 to-indigo-500";
      case "Malware": return "from-green-500 to-emerald-500";
      case "Exploit": return "from-blue-500 to-cyan-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getAttackIcon = (type) => {
    switch (type) {
      case "DDoS": return <Globe className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "PortScan": return <Eye className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "BruteForce": return <Users className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "Malware": return <Cpu className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "Exploit": return <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Wifi className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-4 px-3 sm:py-8 sm:px-4 pt-20 sm:pt-24">
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
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Firewall Gate</h1>
              <p className="text-cyan-400 text-xs">Level 1</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <div className="text-cyan-400 font-bold">{gameStatus.score}</div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">{gameStatus.attacksBlocked}</div>
                <div className="text-gray-400">Blocked</div>
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

      {/* Background Network Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
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
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">The Firewall Gate</h1>
                <p className="text-cyan-400 text-sm">Network Security Basics</p>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{gameStatus.attacksBlocked}</div>
              <div className="text-gray-400 text-sm">Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{gameStatus.attacksMissed}</div>
              <div className="text-gray-400 text-sm">Missed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.floor(gameStatus.timeElapsed / 60)}:{(gameStatus.timeElapsed % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-gray-400 text-sm">Time</div>
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
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Game Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-cyan-400">{gameStatus.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attacks Blocked:</span>
                    <span className="text-green-400">{gameStatus.attacksBlocked}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attacks Missed:</span>
                    <span className="text-red-400">{gameStatus.attacksMissed}/6</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-yellow-400">
                      {Math.floor(gameStatus.timeElapsed / 60)}:{(gameStatus.timeElapsed % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level:</span>
                    <span className="text-purple-400">{gameStatus.level}/3</span>
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
                className="glass card-cyber p-4 sm:p-6 max-w-2xl w-full border border-cyan-500/30 rounded-2xl"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 text-center">Welcome to Firewall Gate</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Configure Firewall Rules</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Enable/disable rules to block different types of attacks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Monitor Incoming Attacks</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Watch for colored attack indicators moving toward your server</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Block 10 Attacks to Win</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Prevent attacks from reaching your server infrastructure</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Key className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Unlock Next Level</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Complete this level to get a password for Level 2</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="flex-1 bg-cyan-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-colors text-sm sm:text-base"
                  >
                    Start Game
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Firewall Rules */}
          <div className="lg:col-span-1">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  Firewall Rules
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    gameStatus.status === "running" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {firewallRules.filter(r => r.enabled).length} Active
                  </span>
                </div>
              </div>

              <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                {firewallRules.map(rule => (
                  <motion.div
                    key={rule.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      rule.enabled
                        ? rule.action === "ALLOW"
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                        : "bg-gray-500/10 border-gray-500/30 opacity-50"
                    }`}
                    onClick={() => toggleRule(rule.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {rule.enabled ? (
                          rule.action === "ALLOW" ? (
                            <Unlock className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                          ) : (
                            <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
                          )
                        ) : (
                          <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        )}
                        <span className={`font-mono text-xs sm:text-sm ${
                          rule.enabled ? "text-white" : "text-gray-400"
                        }`}>
                          {rule.protocol}/{rule.port}
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        rule.action === "ALLOW" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {rule.action}
                      </div>
                    </div>
                    <p className={`text-xs ${
                      rule.enabled ? "text-gray-300" : "text-gray-500"
                    }`}>
                      {rule.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Source: {rule.source}</p>
                  </motion.div>
                ))}
              </div>

              {/* Game Controls */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                <div className="flex gap-2 sm:gap-3">
                  {gameStatus.status === "idle" ? (
                    <button
                      onClick={startGame}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
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

          {/* Middle Column - Game Visualization */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Network className="w-4 h-4 sm:w-5 sm:h-5" />
                  Network Defense
                </h2>
                <div className="text-xs sm:text-sm text-gray-400">
                  Level {gameStatus.level} - Block 10 attacks to win
                </div>
              </div>

              {/* Game Visualization */}
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border-2 border-gray-600 h-64 sm:h-80 md:h-96 overflow-hidden">
                {/* Server */}
                <div className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 text-center">
                  <motion.div
                    animate={gameStatus.status === "running" && !gameStatus.isPaused ? {
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-1 sm:mb-2 mx-auto shadow-lg shadow-cyan-500/20"
                  >
                    <Server className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </motion.div>
                  <span className="text-white font-semibold text-xs sm:text-sm">Your Server</span>
                </div>

                {/* Incoming Attacks */}
                <AnimatePresence>
                  {incomingAttacks.map(attack => (
                    <motion.button
                      key={attack.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        x: `calc(100% - ${attack.position.x}%)`,
                        y: `${attack.position.y}%`
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      className={`absolute w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${getAttackColor(attack.type)} rounded-lg sm:rounded-xl flex flex-col items-center justify-center text-white font-semibold text-xs shadow-lg cursor-pointer z-10`}
                      onClick={() => handleAttackClick(attack)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {getAttackIcon(attack.type)}
                      <span className="mt-0.5 sm:mt-1 text-xs">P{attack.port}</span>
                    </motion.button>
                  ))}
                </AnimatePresence>

                {/* Connection Lines */}
                {incomingAttacks.map(attack => (
                  <motion.div
                    key={attack.id}
                    className="absolute h-0.5 bg-red-400/30 z-0"
                    style={{
                      left: `${attack.position.x}%`,
                      top: `calc(${attack.position.y}% + 1.5rem)`,
                      width: `calc(100% - ${attack.position.x}% - 3rem)`,
                      transformOrigin: 'left center'
                    }}
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}

                {/* Game Status Overlay */}
                <AnimatePresence>
                  {gameStatus.status === "completed" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center z-20 p-4"
                    >
                      <div className="text-center bg-gray-800/95 p-4 sm:p-6 rounded-2xl border border-green-500/30 max-w-md w-full shadow-2xl">
                        <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Level Complete!</h3>
                        <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">You successfully defended your server</p>
                        
                        {/* Level Password Display
                        <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-purple-500/30 mb-3 sm:mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                              <span className="text-white font-semibold text-sm sm:text-base">Level 2 Password:</span>
                            </div>
                            <button
                              onClick={copyPasswordToClipboard}
                              className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              {passwordCopied ? (
                                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                              ) : (
                                <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                              )}
                              <span className="text-xs">{passwordCopied ? "Copied!" : "Copy"}</span>
                            </button>
                          </div>
                          <div className="bg-black/70 p-2 sm:p-3 rounded border border-gray-600">
                            <code className="text-green-400 font-mono text-xs sm:text-sm break-all">
                              {levelPassword}
                            </code>
                          </div>
                          <p className="text-yellow-400 text-xs mt-2 text-center">
                            Save this password for Level 2: Phisher's Trap
                          </p>
                        </div>
                         */}
                        <p className="text-yellow-400 mb-3 sm:mb-4 text-sm sm:text-base">+100 XP Earned!</p>
                        <div className="flex gap-2 sm:gap-3">
                          <button
                            onClick={resetGame}
                            className="flex-1 bg-cyan-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-cyan-600 transition-colors text-sm sm:text-base"
                          >
                            Play Again
                          </button>
                          <button
                            onClick={() => navigate("/levels")}
                            className="flex-1 bg-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
                          >
                            Levels
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {gameStatus.status === "failed" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-20 p-4"
                    >
                      <div className="text-center bg-gray-800/95 p-4 sm:p-6 rounded-2xl border border-red-500/30 max-w-md w-full">
                        <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Server Compromised!</h3>
                        <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Too many attacks reached your server</p>
                        <button
                          onClick={resetGame}
                          className="bg-cyan-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-cyan-600 transition-colors text-sm sm:text-base"
                        >
                          Try Again
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Game Log - Hidden on mobile, shown in sidebar */}
              <div className="hidden lg:block mt-4 sm:mt-6">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Security Log
                </h3>
                <div className="bg-gray-800/50 rounded-xl p-4 max-h-40 overflow-y-auto">
                  {gameLog.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No activity yet. Start the game to see logs.</p>
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
        </div>

        {/* Learning Objectives */}
        <div className="mt-6 sm:mt-8 glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <h4 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">Firewall Rules</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand how firewall rules control network traffic based on protocols and ports</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">Attack Types</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Recognize different cyber attacks like DDoS, port scanning, and brute force</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Port Security</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn which ports are commonly targeted and how to secure them</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-1 sm:mb-2 text-sm sm:text-base">Progression System</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Complete levels to earn passwords and unlock advanced challenges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}