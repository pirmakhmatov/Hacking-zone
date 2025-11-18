// hacking_zone/src/pages/levels/PortScanner.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Terminal, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft,
  Server, Network, Wifi, Eye, EyeOff, Copy, Check,
  Search, Filter, Map, Lock, Unlock, Cpu, Users,
  Shield, Key, HelpCircle, Command, Menu, X,
  ChevronRight, Folder, File, HardDrive, Download, Upload,
  Scan, Globe, Database, Mail, MessageSquare, Brain
} from "lucide-react";

export default function PortScanner() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    targetsFound: 0,
    vulnerabilitiesFound: 0,
    level: 5,
    isPaused: false,
    phase: "exploration"
  });

  const [terminalInput, setTerminalInput] = useState("");
  const [terminalHistory, setTerminalHistory] = useState([
    { 
      id: 1, 
      message: "Kali Linux 2024.1 \\n \\l", 
      type: "system",
      timestamp: "00:00:01"
    },
    { 
      id: 2, 
      message: "scanner@hacking-zone:~$ login: scanner", 
      type: "system",
      timestamp: "00:00:02"
    },
    { 
      id: 3, 
      message: "password: ********", 
      type: "system",
      timestamp: "00:00:03"
    },
    { 
      id: 4, 
      message: "Welcome to Hacking Zone Port Scanner", 
      type: "system",
      timestamp: "00:00:04"
    },
    { 
      id: 5, 
      message: "Type 'help' for available commands", 
      type: "info",
      timestamp: "00:00:05"
    }
  ]);
  const [currentDirectory, setCurrentDirectory] = useState("/home/scanner");
  const [fileSystem, setFileSystem] = useState({});
  const [scanResults, setScanResults] = useState([]);
  const [activeScan, setActiveScan] = useState(null);
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [userScrolled, setUserScrolled] = useState(false);
  const [scanAttempts, setScanAttempts] = useState(0);
  const [failedScans, setFailedScans] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);
  const terminalContainerRef = useRef(null);

  // Enhanced network targets with more complexity
  const networkTargets = [
    {
      ip: "192.168.1.1",
      hostname: "gateway.local",
      os: "Linux 4.14.81",
      security: "medium",
      stealth: false,
      ports: [
        { port: 22, service: "ssh", status: "open", version: "OpenSSH 7.9p1", security: "medium", stealth: false },
        { port: 53, service: "domain", status: "open", version: "dnsmasq 2.80", security: "high", stealth: false },
        { port: 80, service: "http", status: "open", version: "lighttpd 1.4.53", security: "low", stealth: false },
        { port: 443, service: "https", status: "open", version: "lighttpd 1.4.53", security: "medium", stealth: false },
        { port: 8080, service: "http-proxy", status: "filtered", version: "unknown", security: "low", stealth: true }
      ],
      description: "Network Gateway Router",
      vulnerabilities: ["Weak SSH configuration", "Web interface default credentials"],
      required: true,
      difficulty: "easy"
    },
    {
      ip: "192.168.1.50",
      hostname: "fs-corp.local",
      os: "Windows Server 2019",
      security: "high",
      stealth: true,
      ports: [
        { port: 21, service: "ftp", status: "open", version: "FileZilla 0.9.60", security: "low", stealth: false },
        { port: 22, service: "ssh", status: "closed", version: "OpenSSH for Windows 8.1", security: "medium", stealth: false },
        { port: 80, service: "http", status: "open", version: "Microsoft-IIS/10.0", security: "low", stealth: false },
        { port: 135, service: "msrpc", status: "open", version: "Microsoft Windows RPC", security: "high", stealth: true },
        { port: 139, service: "netbios-ssn", status: "open", version: "Microsoft Windows netbios-ssn", security: "high", stealth: true },
        { port: 443, service: "https", status: "open", version: "Microsoft-IIS/10.0", security: "medium", stealth: false },
        { port: 445, service: "microsoft-ds", status: "open", version: "Microsoft Windows SMB", security: "critical", stealth: true },
        { port: 3389, service: "rdp", status: "filtered", version: "Microsoft Terminal Services", security: "critical", stealth: true },
        { port: 5985, service: "wsman", status: "open", version: "Microsoft HTTPAPI", security: "medium", stealth: false }
      ],
      description: "Corporate File Server - Protected",
      vulnerabilities: ["SMB signing not required", "RDP exposed to network", "WinRM accessible"],
      required: true,
      difficulty: "hard"
    },
    {
      ip: "192.168.1.100",
      hostname: "web-app.local",
      os: "Ubuntu 20.04.3 LTS",
      security: "medium",
      stealth: false,
      ports: [
        { port: 22, service: "ssh", status: "open", version: "OpenSSH 8.2p1", security: "medium", stealth: false },
        { port: 80, service: "http", status: "open", version: "Apache/2.4.41", security: "low", stealth: false },
        { port: 443, service: "https", status: "open", version: "Apache/2.4.41", security: "medium", stealth: false },
        { port: 3306, service: "mysql", status: "filtered", version: "MySQL 8.0.27", security: "critical", stealth: true },
        { port: 5432, service: "postgresql", status: "open", version: "PostgreSQL 13.4", security: "high", stealth: false },
        { port: 8080, service: "http-proxy", status: "open", version: "Apache Tomcat/9.0.56", security: "medium", stealth: false },
        { port: 9000, service: "cslistener", status: "open", version: "Portainer 2.11.1", security: "high", stealth: false }
      ],
      description: "Web Application Server",
      vulnerabilities: ["MySQL root access from network", "Tomcat default credentials", "PostgreSQL weak auth"],
      required: true,
      difficulty: "medium"
    },
    {
      ip: "192.168.1.150",
      hostname: "print-srv.local",
      os: "Embedded Linux 2.6.31",
      security: "low",
      stealth: false,
      ports: [
        { port: 80, service: "http", status: "open", version: "HP JetDirect", security: "low", stealth: false },
        { port: 443, service: "https", status: "open", version: "HP JetDirect", security: "low", stealth: false },
        { port: 515, service: "printer", status: "open", version: "LPD", security: "medium", stealth: false },
        { port: 631, service: "ipp", status: "open", version: "CUPS 1.4", security: "medium", stealth: false },
        { port: 9100, service: "jetdirect", status: "open", version: "HP JetDirect", security: "high", stealth: false }
      ],
      description: "Network Print Server - HP LaserJet",
      vulnerabilities: ["Default admin credentials", "JetDirect protocol exposed"],
      required: false,
      difficulty: "easy"
    },
    {
      ip: "192.168.1.200",
      hostname: "backup-srv.local",
      os: "FreeBSD 12.2-RELEASE",
      security: "high",
      stealth: true,
      ports: [
        { port: 22, service: "ssh", status: "filtered", version: "OpenSSH 8.4", security: "medium", stealth: true },
        { port: 80, service: "http", status: "closed", version: "nginx/1.18.0", security: "low", stealth: false },
        { port: 443, service: "https", status: "open", version: "nginx/1.18.0", security: "medium", stealth: false },
        { port: 873, service: "rsync", status: "open", version: "rsyncd 3.2.3", security: "critical", stealth: true },
        { port: 2049, service: "nfs", status: "open", version: "NFS 4.1", security: "high", stealth: true }
      ],
      description: "Backup Server - Critical Infrastructure",
      vulnerabilities: ["Rsync anonymous access", "NFS exports world-readable"],
      required: false,
      difficulty: "hard"
    }
  ];

  // Initialize file system
  useEffect(() => {
    const initFileSystem = {
      "/home/scanner": {
        type: "directory",
        contents: {
          "scan_results": { 
            type: "directory", 
            contents: {
              "readme.txt": { 
                type: "file", 
                content: "Scan results will be saved here automatically.\nUse 'cat scan_results/<target_ip>.txt' to view detailed reports." 
              }
            }
          },
          "tools": { 
            type: "directory", 
            contents: {
              "nmap": { type: "file", content: "Network Mapper - Advanced port scanning tool\nUsage: nmap -sS -sV -O <target>" },
              "netcat": { type: "file", content: "Network utility - Swiss army knife for TCP/IP\nUsage: nc -zv <target> <port>" },
              "masscan": { type: "file", content: "Mass port scanner - Fast parallel scanning\nUsage: masscan -p1-65535 <target> --rate=1000" }
            }
          },
          "scripts": {
            type: "directory",
            contents: {
              "vuln_scanner.sh": { 
                type: "file", 
                content: "#!/bin/bash\n# Basic vulnerability scanner\necho \"Scanning for common vulnerabilities...\"\nnmap --script vuln $1" 
              },
              "stealth_scan.py": { 
                type: "file", 
                content: "#!/usr/bin/env python3\n# Stealth scanning techniques\nprint(\"Advanced scanning methods for protected targets\")" 
              }
            }
          },
          "notes.txt": { 
            type: "file", 
            content: "ADVANCED SCANNING TECHNIQUES:\n\nPROTECTED TARGETS:\n- Some targets use stealth techniques\n- Filtered ports require advanced scanning\n- Use multiple scan types for better results\n\nSCANNING STRATEGY:\n1. Start with easy targets (gateway, printer)\n2. Move to medium difficulty (web server)\n3. Finally tackle hard targets (file server, backup)\n4. Look for critical vulnerabilities (SMB, RDP, Rsync)\n\nTIPS:\n- Failed scans cost points\n- Use hints strategically\n- Focus on required targets first" 
          }
        }
      }
    };
    setFileSystem(initFileSystem);
  }, []);

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
  }, [gameState.completedLevels, gameState.levelUnlocks, gameState.isLoading]);

  // Handle scroll behavior
  useEffect(() => {
    const terminal = terminalContainerRef.current;
    if (!terminal) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = terminal;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10;
      setUserScrolled(!isAtBottom);
    };

    terminal.addEventListener('scroll', handleScroll);
    return () => terminal.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll only if user hasn't manually scrolled
  useEffect(() => {
    if (!userScrolled || gameStatus.status === "completed" || terminalHistory.length < 10) {
      terminalEndRef.current?.scrollIntoView({ 
        behavior: userScrolled ? "auto" : "smooth",
        block: "nearest"
      });
    }
    
    inputRef.current?.focus();
  }, [terminalHistory, activeScan, userScrolled, gameStatus.status]);

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

  // Handle keyboard navigation for command history
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : 0;
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
        } else {
          setHistoryIndex(-1);
          setTerminalInput('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandHistory, historyIndex]);

  // Password management
  const getStoredLevelPassword = () => {
    const sources = [
      gameState.levelPasswords[5],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[5],
      localStorage.getItem('level5_password')
    ];
    return sources.find(p => p && p.startsWith('HZ-L5-'));
  };

  const checkLevelPassword = () => {
    const inputPassword = terminalInput.trim().toUpperCase();
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      addToTerminal("Error: Please enter the Level 5 password", "error");
      return;
    }
    
    if (!savedPassword) {
      addToTerminal("Error: No Level 5 password found. Please complete Encrypted Zone level first.", "error");
      return;
    }
    
    const normalizedSavedPassword = savedPassword.toUpperCase();
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setShowTutorial(true);
      gameActions.unlockLevel(5);
      addToTerminal("Access granted! Level 5 unlocked.", "success");
      addToTerminal("Type 'start' to begin the Port Scanner challenge", "info");
      addToTerminal("scanner@hacking-zone:~$ ", "prompt");
    } else {
      addToTerminal(`Error: Invalid Level 5 password. The password should start with "HZ-L5-".`, "error");
      addToTerminal("scanner@hacking-zone:~$ ", "prompt");
    }
    setTerminalInput("");
  };

  // Enhanced command processor with difficulty
  const processCommand = (command) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;

    setCommandHistory(prev => [...prev, trimmedCommand]);
    setHistoryIndex(-1);

    const args = trimmedCommand.split(' ').filter(arg => arg);
    const cmd = args[0].toLowerCase();
    
    addToTerminal(`scanner@hacking-zone:${currentDirectory}$ ${trimmedCommand}`, "command");

    switch (cmd) {
      case 'help':
        addToTerminal("Available commands:", "info");
        addToTerminal("  help, clear, ls, cd, pwd, cat, whoami, uname", "info");
        addToTerminal("  portscan <ip>    - Scan target IP address", "info");
        addToTerminal("  view scan        - View scan results", "info");
        addToTerminal("  targets          - Show network targets", "info");
        addToTerminal("  start            - Start the challenge", "info");
        addToTerminal("  ifconfig         - Show network configuration", "info");
        addToTerminal("  ping <host>      - Ping network host", "info");
        addToTerminal("  history          - Show command history", "info");
        addToTerminal("  hint             - Get a strategic hint", "info");
        break;
      
      case 'hint':
        handleHintCommand();
        break;
      
      case 'clear':
        setTerminalHistory([]);
        setUserScrolled(false);
        break;
      
      case 'ls':
        handleLsCommand(args);
        break;
      
      case 'cd':
        handleCdCommand(args);
        break;
      
      case 'pwd':
        addToTerminal(currentDirectory, "output");
        break;
      
      case 'cat':
        handleCatCommand(args);
        break;
      
      case 'whoami':
        addToTerminal("scanner", "output");
        break;

      case 'uname':
        addToTerminal("Linux hacking-zone 5.15.0-kali3-amd64 #1 SMP Debian 5.15.13-2kali1 (2022-02-08) x86_64 GNU/Linux", "output");
        break;

      case 'ifconfig':
        addToTerminal("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500", "output");
        addToTerminal("        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255", "output");
        break;

      case 'ping':
        if (args.length < 2) {
          addToTerminal("Usage: ping <host>", "error");
        } else {
          handlePingCommand(args[1]);
        }
        break;

      case 'history':
        commandHistory.forEach((cmd, index) => {
          addToTerminal(` ${index + 1}  ${cmd}`, "output");
        });
        break;
      
      case 'portscan':
        handlePortScanCommand(args);
        break;
      
      case 'view':
        handleViewCommand(args);
        break;
      
      case 'start':
        if (gameStatus.status === "idle") {
          startGame();
        } else {
          addToTerminal("Game already running. Use 'view scan' to see progress.", "info");
        }
        break;
      
      case 'targets':
        handleTargetsCommand();
        break;
      
      default:
        addToTerminal(`bash: ${cmd}: command not found`, "error");
    }

    addToTerminal("scanner@hacking-zone:~$ ", "prompt");
  };

  const handleHintCommand = () => {
    setHintsUsed(prev => prev + 1);
    setGameStatus(prev => ({ ...prev, score: Math.max(0, prev.score - 10) }));
    
    const unscannedTargets = networkTargets.filter(target => 
      !scanResults.find(r => r.ip === target.ip)
    );
    
    if (unscannedTargets.length === 0) {
      addToTerminal("All targets scanned! Focus on finding critical vulnerabilities.", "info");
      return;
    }

    const easyTargets = unscannedTargets.filter(t => t.difficulty === "easy");
    const mediumTargets = unscannedTargets.filter(t => t.difficulty === "medium");
    
    if (easyTargets.length > 0) {
      const target = easyTargets[0];
      addToTerminal(`Hint: Start with ${target.ip} (${target.hostname}) - ${target.description}`, "info");
    } else if (mediumTargets.length > 0) {
      const target = mediumTargets[0];
      addToTerminal(`Hint: Try ${target.ip} (${target.hostname}) - Look for database services`, "info");
    } else {
      const target = unscannedTargets[0];
      addToTerminal(`Hint: Advanced target ${target.ip} - Use multiple scan attempts`, "info");
    }
  };

  const handleLsCommand = (args) => {
    const path = args[1] ? resolvePath(args[1]) : currentDirectory;
    const dir = getDirectory(path);
    
    if (!dir || dir.type !== "directory") {
      addToTerminal(`ls: cannot access '${args[1] || path}': No such file or directory`, "error");
      return;
    }
    
    const contents = Object.keys(dir.contents);
    if (contents.length === 0) {
      addToTerminal("", "output");
    } else {
      addToTerminal(`total ${contents.length * 4}`, "output");
      contents.forEach(item => {
        const itemData = dir.contents[item];
        const isDir = itemData.type === "directory";
        const perm = isDir ? "drwxr-xr-x" : "-rw-r--r--";
        const size = isDir ? "4096" : Math.floor(Math.random() * 1000) + 100;
        const date = "Jan 15 10:30";
        addToTerminal(`${perm} 1 scanner scanner ${size} ${date} ${item}`, "output");
      });
    }
  };

  const handleCdCommand = (args) => {
    if (args.length < 2) {
      setCurrentDirectory("/home/scanner");
      return;
    }
    
    const targetPath = resolvePath(args[1]);
    const dir = getDirectory(targetPath);
    
    if (!dir || dir.type !== "directory") {
      addToTerminal(`bash: cd: ${args[1]}: No such file or directory`, "error");
      return;
    }
    
    setCurrentDirectory(targetPath);
  };

  const handleCatCommand = (args) => {
    if (args.length < 2) {
      addToTerminal("cat: missing file operand", "error");
      return;
    }
    
    const filePath = resolvePath(args[1]);
    const file = getFile(filePath);
    
    if (!file || file.type !== "file") {
      addToTerminal(`cat: ${args[1]}: No such file or directory`, "error");
      return;
    }
    
    addToTerminal(file.content, "output");
  };

  const handlePingCommand = (host) => {
    const target = networkTargets.find(t => t.ip === host || t.hostname === host);
    if (!target) {
      addToTerminal(`ping: ${host}: Name or service not known`, "error");
      return;
    }
    
    addToTerminal(`PING ${host} (${target.ip}) 56(84) bytes of data.`, "output");
    addToTerminal("64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=1.23 ms", "output");
    addToTerminal("64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=1.45 ms", "output");
    addToTerminal("", "output");
    addToTerminal("--- ping statistics ---", "output");
    addToTerminal("2 packets transmitted, 2 received, 0% packet loss, time 1001ms", "output");
  };

  const handleTargetsCommand = () => {
    addToTerminal("Network Targets (Difficulty: 🟢 Easy 🟡 Medium 🔴 Hard):", "info");
    networkTargets.forEach(target => {
      const difficultyIcon = 
        target.difficulty === "easy" ? "🟢" :
        target.difficulty === "medium" ? "🟡" : "🔴";
      const scanned = scanResults.find(r => r.ip === target.ip);
      const status = scanned ? "✅ Scanned" : "❌ Not scanned";
      const required = target.required ? " [REQUIRED]" : "";
      addToTerminal(`  ${difficultyIcon} ${target.ip} - ${target.hostname}${required} - ${status}`, "output");
    });
    addToTerminal("Use 'portscan <ip>' to scan a target", "info");
  };

  const handlePortScanCommand = (args) => {
    if (args.length < 2) {
      addToTerminal("Usage: portscan <ip_address>", "error");
      addToTerminal("Example: portscan 192.168.1.1", "info");
      return;
    }
    
    const targetIP = args[1];
    const target = networkTargets.find(t => t.ip === targetIP);
    
    if (!target) {
      addToTerminal(`Target ${targetIP} not found in network`, "error");
      addToTerminal("Use 'targets' to see available targets", "info");
      return;
    }
    
    if (gameStatus.status !== "running") {
      addToTerminal("Start the game first with 'start' command", "error");
      return;
    }

    // Check if already scanned
    if (scanResults.find(r => r.ip === targetIP)) {
      addToTerminal(`Target ${targetIP} already scanned. Use 'view scan' to see results.`, "info");
      return;
    }
    
    setScanAttempts(prev => prev + 1);
    
    // Start scanning animation
    setActiveScan({ ip: targetIP, progress: 0 });
    addToTerminal(`Starting Nmap 7.92 scan against ${targetIP}...`, "info");
    addToTerminal(`Scanning 1000 most common ports on ${targetIP}`, "info");
    
    // Simulate scanning with potential failure based on difficulty
    const successChance = 
      target.difficulty === "easy" ? 0.9 :
      target.difficulty === "medium" ? 0.7 : 0.5;
    
    const willSucceed = Math.random() < successChance;
    
    const scanPhases = [
      { delay: 500, message: "Initiating ARP Ping Scan at 10:23" },
      { delay: 1000, message: "Scanning 1000 ports..." },
      { delay: 1500, message: "Discovering open ports..." },
      { delay: 2000, message: "Service version detection..." },
      { delay: 2500, message: "OS detection..." }
    ];

    let phaseIndex = 0;
    const scanInterval = setInterval(() => {
      if (phaseIndex < scanPhases.length) {
        addToTerminal(scanPhases[phaseIndex].message, "scan");
        phaseIndex++;
      }
      
      const progress = Math.min(100, (phaseIndex / scanPhases.length) * 100);
      setActiveScan(prev => prev ? { ...prev, progress } : null);
      
      if (progress >= 100) {
        clearInterval(scanInterval);
        setTimeout(() => {
          if (willSucceed) {
            completeScan(target);
          } else {
            handleScanFailure(target);
          }
        }, 1000);
      }
    }, 500);
  };

  const handleScanFailure = (target) => {
    setActiveScan(null);
    setFailedScans(prev => prev + 1);
    setGameStatus(prev => ({ ...prev, score: Math.max(0, prev.score - 15) }));
    
    addToTerminal(`Scan failed: ${target.ip} may be protected or using stealth techniques`, "error");
    addToTerminal("Try scanning again or use a different approach", "info");
    
    if (failedScans >= 2) {
      addToTerminal("Warning: Multiple failed scans detected. Consider using 'hint' command.", "warning");
    }
  };

  const handleViewCommand = (args) => {
    if (args.length < 2) {
      addToTerminal("Usage: view <scan|results|targets>", "error");
      return;
    }
    
    switch (args[1]) {
      case 'scan':
      case 'results':
        if (scanResults.length === 0) {
          addToTerminal("No scan results yet. Use 'portscan <ip>' first.", "info");
        } else {
          scanResults.forEach(result => {
            addToTerminal(`\nScan Report for ${result.ip} (${result.hostname})`, "info");
            addToTerminal(`Host is up (0.0012s latency).`, "output");
            addToTerminal(`Not shown: 996 filtered ports`, "output");
            addToTerminal(`PORT     STATE SERVICE    VERSION`, "output");
            
            result.ports.forEach(port => {
              const state = port.status === "open" ? "open" : "filtered";
              const securityIcon = 
                port.security === "critical" ? "🔴" :
                port.security === "high" ? "🟡" :
                port.security === "medium" ? "🟢" : "⚪";
              addToTerminal(`${port.port}/tcp  ${state.padEnd(6)} ${port.service.padEnd(11)} ${port.version} ${securityIcon}`, "output");
            });
            
            addToTerminal(`OS: ${result.os}`, "output");
            addToTerminal(`Service detection performed.`, "output");
            addToTerminal(`${result.ports.filter(p => p.status === "open").length} ports open, ${result.vulnerabilities.length} potential vulnerabilities found.`, "output");
          });
        }
        break;
      
      default:
        addToTerminal(`Unknown view option: ${args[1]}`, "error");
    }
  };

  const completeScan = (target) => {
    setActiveScan(null);
    setScanResults(prev => [...prev.filter(r => r.ip !== target.ip), target]);
    
    // Calculate score based on difficulty and findings
    const openPorts = target.ports.filter(p => p.status === "open").length;
    const criticalPorts = target.ports.filter(p => p.security === "critical" && p.status === "open").length;
    const highRiskPorts = target.ports.filter(p => p.security === "high" && p.status === "open").length;
    
    const baseScore = openPorts * 5;
    const riskBonus = (criticalPorts * 30) + (highRiskPorts * 15);
    const difficultyMultiplier = 
      target.difficulty === "easy" ? 1 :
      target.difficulty === "medium" ? 1.5 : 2;
    
    const scanScore = Math.floor((baseScore + riskBonus) * difficultyMultiplier);
    
    setGameStatus(prev => ({
      ...prev,
      targetsFound: prev.targetsFound + (target.required ? 1 : 0),
      vulnerabilitiesFound: prev.vulnerabilitiesFound + criticalPorts + highRiskPorts,
      score: prev.score + scanScore
    }));
    
    addToTerminal(`Nmap scan report for ${target.ip}`, "success");
    addToTerminal(`Host is up (0.0012s latency).`, "output");
    addToTerminal(`Found ${openPorts} open ports (${criticalPorts} critical, ${highRiskPorts} high risk)`, "info");
    addToTerminal(`+${scanScore} points earned`, "success");
    
    // Check win condition
    const requiredTargetsScanned = networkTargets.filter(t => t.required)
      .every(t => scanResults.find(r => r.ip === t.ip));
    const hasCriticalVulnerabilities = scanResults.some(r => 
      r.ports.some(p => p.security === "critical" && p.status === "open")
    );
    const totalVulnerabilities = scanResults.reduce((sum, r) => 
      sum + r.ports.filter(p => (p.security === "critical" || p.security === "high") && p.status === "open").length, 0
    );
    
    if (requiredTargetsScanned && hasCriticalVulnerabilities && totalVulnerabilities >= 4) {
      setTimeout(completeLevel, 1500);
    } else {
      const remainingRequired = networkTargets.filter(t => t.required && !scanResults.find(r => r.ip === t.ip)).length;
      const neededVulnerabilities = 4 - totalVulnerabilities;
      addToTerminal(`Progress: ${remainingRequired} required targets, ${neededVulnerabilities} more vulnerabilities needed`, "info");
    }
  };

  const getDirectory = (path) => {
    const parts = path.split('/').filter(p => p);
    let current = fileSystem['/'];
    
    for (const part of parts) {
      if (current?.contents?.[part]?.type === "directory") {
        current = current.contents[part];
      } else {
        return null;
      }
    }
    return current;
  };

  const getFile = (path) => {
    const parts = path.split('/').filter(p => p);
    const filename = parts.pop();
    const dirPath = '/' + parts.join('/');
    const dir = getDirectory(dirPath || '/');
    
    return dir?.contents?.[filename];
  };

  const resolvePath = (path) => {
    if (path.startsWith('/')) {
      return path;
    }
    
    const currentParts = currentDirectory.split('/').filter(p => p);
    const pathParts = path.split('/').filter(p => p);
    
    for (const part of pathParts) {
      if (part === '..') {
        currentParts.pop();
      } else if (part !== '.') {
        currentParts.push(part);
      }
    }
    
    return '/' + currentParts.join('/');
  };

  const addToTerminal = (message, type = "output") => {
    setTerminalHistory(prev => [...prev, { 
      id: Date.now() + Math.random(), 
      message, 
      type,
      timestamp: new Date().toLocaleTimeString() 
    }]);
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = terminalInput.trim();
    if (!trimmedInput) return;

    // When user submits a command, assume they want to see the output
    setUserScrolled(false);

    if (gameStatus.status === "locked") {
      checkLevelPassword();
    } else {
      processCommand(trimmedInput);
    }
    
    setTerminalInput("");
    setHistoryIndex(-1);
  };

  const startGame = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    setGameStatus({
      status: "running",
      timeElapsed: 0,
      score: 100,
      targetsFound: 0,
      vulnerabilitiesFound: 0,
      level: 5,
      isPaused: false,
      phase: "exploration"
    });
    
    setScanResults([]);
    setActiveScan(null);
    setCommandHistory([]);
    setScanAttempts(0);
    setFailedScans(0);
    setHintsUsed(0);
    setLevelPassword("");
    setShowTutorial(false);
    setMobileMenuOpen(false);
    
    // Reset scroll position for new game
    setUserScrolled(false);
    
    addToTerminal("🚀 ADVANCED PORT SCANNER CHALLENGE STARTED!", "success");
    addToTerminal("MISSION OBJECTIVES:", "info");
    addToTerminal("• Scan all REQUIRED targets (gateway, file server, web server)", "info");
    addToTerminal("• Find at least 4 HIGH/CRITICAL risk vulnerabilities", "info");
    addToTerminal("• Discover at least 1 CRITICAL vulnerability", "info");
    addToTerminal("", "info");
    addToTerminal("STRATEGY:", "info");
    addToTerminal("• Start with easy targets (🟢)", "info");
    addToTerminal("• Some scans may fail - try again", "info");
    addToTerminal("• Use 'hint' command if stuck (costs 10 points)", "info");
    addToTerminal("scanner@hacking-zone:~$ ", "prompt");
  };

  const pauseGame = () => {
    setGameStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameStatus({
      status: "idle",
      timeElapsed: 0,
      score: 0,
      targetsFound: 0,
      vulnerabilitiesFound: 0,
      level: 5,
      isPaused: false,
      phase: "exploration"
    });
    
    setScanResults([]);
    setActiveScan(null);
    setTerminalHistory([
      { 
        id: 1, 
        message: "System reset complete.", 
        type: "system",
        timestamp: new Date().toLocaleTimeString()
      },
      { 
        id: 2, 
        message: "Type 'start' to begin the Port Scanner challenge", 
        type: "info",
        timestamp: new Date().toLocaleTimeString()
      },
      { 
        id: 3, 
        message: "scanner@hacking-zone:~$ ", 
        type: "prompt",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setCommandHistory([]);
    setScanAttempts(0);
    setFailedScans(0);
    setHintsUsed(0);
    setLevelPassword("");
    setMobileMenuOpen(false);
    setCurrentDirectory("/home/scanner");
    setUserScrolled(false);
  };

  const generateLevelPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L6-${password}`;
  };

  const completeLevel = () => {
    if (gameStatus.status === "running") {
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      // Calculate final score with bonuses/penalties
      const timeBonus = Math.max(0, 300 - gameStatus.timeElapsed) * 2;
      const efficiencyBonus = Math.max(0, 50 - (failedScans * 10));
      const hintPenalty = hintsUsed * 10;
      const finalScore = gameStatus.score + timeBonus + efficiencyBonus - hintPenalty;
      
      addToTerminal("🎉 ADVANCED PORT SCANNING MASTERED!", "success");
      addToTerminal("All mission objectives completed successfully!", "success");
      addToTerminal(`🔑 Level 6 Password: ${password}`, "success");
      addToTerminal(`📊 Final Score: ${finalScore} (Base: ${gameStatus.score} + Time: ${timeBonus} + Efficiency: ${efficiencyBonus} - Hints: ${hintPenalty})`, "success");
      
      const xpEarned = 200 + Math.floor(finalScore / 5);
      addToTerminal(`✨ +${xpEarned} XP Earned!`, "success");
      
      try {
        gameActions.completeLevel(5, xpEarned, password);
      } catch (error) {
        console.error('GameContext error:', error);
      }
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  const quickCommands = [
    { command: "targets", description: "Show network targets" },
    { command: "portscan 192.168.1.1", description: "Scan gateway" },
    { command: "portscan 192.168.1.50", description: "Scan file server" },
    { command: "portscan 192.168.1.100", description: "Scan web server" },
    { command: "view scan", description: "View results" },
    { command: "hint", description: "Get hint (-10 points)" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Terminal className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="glass card-cyber p-4 sm:p-8 rounded-2xl border border-green-500/30">
            <Terminal className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 text-center">The Port Scanner</h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-lg text-center">Level 5: Advanced Network Reconnaissance</p>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base text-center">Level 5 Password Required</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 text-center">
                Enter the password from Encrypted Zone level
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="terminal bg-black border border-green-500/50 rounded-lg p-4 mb-3">
                  <div className="text-green-400 font-mono text-sm">
                    <div>$ Enter Level 5 Password:</div>
                    <form onSubmit={(e) => { e.preventDefault(); checkLevelPassword(); }} className="flex items-center">
                      <span className="text-green-400 mr-2">$</span>
                      <input
                        type="text"
                        value={terminalInput}
                        onChange={(e) => setTerminalInput(e.target.value)}
                        className="flex-1 bg-transparent text-green-400 outline-none font-mono"
                        placeholder="HZ-L5-..."
                        autoFocus
                      />
                    </form>
                  </div>
                </div>
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all text-sm sm:text-base"
                >
                  Unlock Level 5
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                Advanced Challenge Features:
              </h4>
              <ul className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-2">
                <li>• Realistic terminal with scan failures</li>
                <li>• Multiple difficulty levels (Easy 🟢, Medium 🟡, Hard 🔴)</li>
                <li>• Strategic hint system with point costs</li>
                <li>• Critical vulnerability detection</li>
                <li>• Smart scroll behavior - respects user position</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
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
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Port Scanner</h1>
              <p className="text-green-400 text-xs">Level 5 - ADVANCED</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <div className="text-green-400 font-bold">{gameStatus.score}</div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-cyan-400 font-bold">{gameStatus.targetsFound}</div>
                <div className="text-gray-400">Scanned</div>
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

        {/* Mobile Start Button */}
        {gameStatus.status === "idle" && (
          <div className="mt-3">
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center justify-center gap-2 text-sm"
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
              className="absolute w-2 h-2 bg-green-400 rounded-full animate-pulse"
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
              <Terminal className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">The Port Scanner</h1>
                <p className="text-green-400 text-sm">Advanced Network Reconnaissance</p>
              </div>
            </div>
          </div>

          {gameStatus.status === "idle" && (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/20 transition-all flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Advanced Challenge
            </button>
          )}

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{gameStatus.targetsFound}/4</div>
              <div className="text-gray-400 text-sm">Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{gameStatus.vulnerabilitiesFound}/4</div>
              <div className="text-gray-400 text-sm">Vulnerabilities</div>
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
                  <Command className="w-5 h-5 text-green-400" />
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
                    <span className="text-green-400">{gameStatus.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Required Targets:</span>
                    <span className="text-cyan-400">{gameStatus.targetsFound}/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vulnerabilities:</span>
                    <span className="text-yellow-400">{gameStatus.vulnerabilitiesFound}/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Failed Scans:</span>
                    <span className="text-red-400">{failedScans}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hints Used:</span>
                    <span className="text-blue-400">{hintsUsed}</span>
                  </div>
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
                className="glass card-cyber p-4 sm:p-6 max-w-2xl w-full border border-green-500/30 rounded-2xl"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 text-center">Advanced Port Scanner</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Smart Scroll Behavior</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Terminal respects your reading position. Use 'Scroll to Bottom' button when needed.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Strategic Gameplay</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Start with easy targets, use hints wisely (-10 points)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Mission Objectives</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Scan 3 required targets, find 4+ vulnerabilities including 1 critical</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Scan Failures</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Scans can fail! Hard targets have 50% success rate. Try again!</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-green-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors text-sm sm:text-base"
                >
                  Start Advanced Challenge
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Terminal Area */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                  Advanced Scanner Terminal
                  {activeScan && (
                    <span className="text-yellow-400 text-sm font-normal">
                      Scanning {activeScan.ip}... {activeScan.progress}%
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-400">Failed: {failedScans}</span>
                  <span className="text-blue-400">Hints: {hintsUsed}</span>
                </div>
              </div>

              {/* Terminal Output */}
              <div 
                ref={terminalContainerRef}
                className="terminal bg-black border border-green-500/30 rounded-xl p-3 sm:p-4 h-96 overflow-y-auto font-mono text-sm scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-gray-800/50"
                onWheel={(e) => {
                  // Detect if user is intentionally scrolling up
                  if (e.deltaY < 0) {
                    setUserScrolled(true);
                  }
                }}
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
                        entry.type === "scan" ? "text-blue-400" :
                        entry.type === "system" ? "text-gray-400" :
                        entry.type === "prompt" ? "text-green-400 font-semibold" : "text-gray-300"
                      }`}>
                        {entry.message}
                      </pre>
                    </div>
                  ))}
                </div>
                <div ref={terminalEndRef} />
              </div>

              {/* Scroll to bottom button - Only shows when user has scrolled up */}
              {userScrolled && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => {
                    setUserScrolled(false);
                    setTimeout(() => {
                      terminalEndRef.current?.scrollIntoView({ 
                        behavior: "smooth",
                        block: "nearest"
                      });
                    }, 100);
                  }}
                  className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 ml-auto shadow-lg border border-green-400/30 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 rotate-90" />
                  New Output Available - Scroll to Bottom
                </motion.button>
              )}

              {/* Terminal Input and Controls */}
              <form onSubmit={handleTerminalSubmit} className="mt-4">
                <div className="flex items-center gap-2 bg-gray-800 border border-green-500/30 rounded-lg p-2 sm:p-3">
                  <span className="text-green-400 font-mono">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type commands here... (help for commands)"
                    className="flex-1 bg-transparent text-white outline-none font-mono placeholder-gray-400 text-sm sm:text-base"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white p-1 sm:p-2 rounded hover:bg-green-600 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick Commands */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setTerminalInput("hint");
                    setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                  }}
                  className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors text-xs text-left border border-blue-500/30"
                >
                  <div className="text-blue-400 font-mono">hint</div>
                  <div className="text-gray-400">Get help (-10 points)</div>
                </button>
                <button
                  onClick={() => {
                    setTerminalInput("targets");
                    setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                  }}
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-xs text-left"
                >
                  <div className="text-green-400 font-mono">targets</div>
                  <div className="text-gray-400">Show targets</div>
                </button>
                <button
                  onClick={() => {
                    setTerminalInput("portscan 192.168.1.1");
                    setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                  }}
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-xs text-left"
                >
                  <div className="text-green-400 font-mono">portscan 192.168.1.1</div>
                  <div className="text-gray-400">Scan gateway</div>
                </button>
                <button
                  onClick={() => {
                    setTerminalInput("view scan");
                    setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                  }}
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-xs text-left"
                >
                  <div className="text-green-400 font-mono">view scan</div>
                  <div className="text-gray-400">View results</div>
                </button>
                <button
                  onClick={() => {
                    setTerminalInput("clear");
                    setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                  }}
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-xs text-left"
                >
                  <div className="text-green-400 font-mono">clear</div>
                  <div className="text-gray-400">Clear terminal</div>
                </button>
                <button
                  onClick={() => {
                    setTerminalInput("help");
                    setTimeout(() => handleTerminalSubmit(new Event('submit')), 100);
                  }}
                  className="p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors text-xs text-left"
                >
                  <div className="text-green-400 font-mono">help</div>
                  <div className="text-gray-400">All commands</div>
                </button>
              </div>

              {/* Game Controls */}
              {gameStatus.status === "running" && (
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
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
            </div>
          </div>

          {/* Side Panel */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Difficulty Guide */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Challenge Guide
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-white">Easy Targets</span>
                  <span className="text-gray-400 ml-auto">90% success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-white">Medium Targets</span>
                  <span className="text-gray-400 ml-auto">70% success</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-white">Hard Targets</span>
                  <span className="text-gray-400 ml-auto">50% success</span>
                </div>
                <div className="mt-2 p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
                  <div className="text-yellow-400 text-xs">Scans can fail! Failed attempts cost points.</div>
                </div>
              </div>
            </div>

            {/* Mission Objectives */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Mission Objectives
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Required Targets:</span>
                  <span className="text-cyan-400">{gameStatus.targetsFound}/4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Vulnerabilities:</span>
                  <span className="text-yellow-400">{gameStatus.vulnerabilitiesFound}/4</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Critical Found:</span>
                  <span className={scanResults.some(r => r.ports.some(p => p.security === "critical")) ? "text-green-400" : "text-red-400"}>
                    {scanResults.some(r => r.ports.some(p => p.security === "critical")) ? "✅" : "❌"}
                  </span>
                </div>
                <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                  <div className="text-blue-400 text-xs">Find SMB, RDP, or Rsync for critical vulnerabilities</div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Scan Attempts:</span>
                  <span className="text-cyan-400">{scanAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Failed Scans:</span>
                  <span className="text-red-400">{failedScans}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Hints Used:</span>
                  <span className="text-blue-400">{hintsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Success Rate:</span>
                  <span className="text-green-400">
                    {scanAttempts > 0 ? Math.round(((scanAttempts - failedScans) / scanAttempts) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Command Reference */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Command className="w-5 h-5 text-green-400" />
                Quick Commands
              </h3>
              <div className="space-y-2 text-sm">
                {quickCommands.map((cmd, index) => (
                  <div key={index} className="p-2 bg-gray-800/50 rounded">
                    <div className="text-green-400 font-mono text-xs">{cmd.command}</div>
                    <div className="text-gray-400 text-xs">{cmd.description}</div>
                  </div>
                ))}
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
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">Advanced Scanning</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn realistic port scanning with failure scenarios and retry strategies</p>
            </div>
            <div className="p-3 sm:p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <h4 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">Risk Assessment</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Identify critical vulnerabilities like SMB, RDP, and database exposures</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Strategic Planning</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Develop scanning strategies based on target difficulty and success probability</p>
            </div>
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-1 sm:mb-2 text-sm sm:text-base">Resource Management</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Manage scan attempts, hints, and points for optimal penetration testing</p>
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
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Advanced Port Scanning Mastered!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">All mission objectives completed successfully</p>
                
                <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-purple-500/30 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Level 6 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
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
                    className="flex-1 bg-green-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-green-600 transition-colors text-sm sm:text-base"
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