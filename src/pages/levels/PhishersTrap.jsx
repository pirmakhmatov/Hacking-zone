// hacking_zone/src/pages/levels/PhishersTrap.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import { Menu, Transition } from '@headlessui/react';
import {
  Shield, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft,
  Mail, Lock, Unlock, Filter, Eye, EyeOff, Server,
  Users, Cpu, Wifi, Globe, Terminal, Key, Copy, Check,
  MessageCircle, Link, User, Phone, CreditCard, Smartphone,
  HelpCircle, Star, Award, Sparkles, ChevronDown, Volume2, VolumeX,
  Menu as MenuIcon, X, Settings
} from "lucide-react";

export default function PhishersTrap() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    phishingDetected: 0,
    phishingMissed: 0,
    level: 2,
    isPaused: false,
    streak: 0,
    maxStreak: 0,
    lives: 3
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emails, setEmails] = useState([]);
  const [gameLog, setGameLog] = useState([]);
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [unlockMethod, setUnlockMethod] = useState("password");
  const [difficulty, setDifficulty] = useState("normal");
  const [achievements, setAchievements] = useState({
    perfectGame: false,
    speedRunner: false,
    noMistakes: false,
    firstBlood: false
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const audioContextRef = useRef(null);
  const emailCounterRef = useRef(0);
  const usedTemplatesRef = useRef(new Set());
  const totalEmailsSentRef = useRef(0);

  // Check level status
  useEffect(() => {
    if (gameState.isLoading) return;

    if (gameState.completedLevels.includes(2)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      const existingPassword = gameState.levelPasswords[3];
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
      return;
    }

    if (gameState.levelUnlocks[2] || gameState.completedLevels.includes(1)) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      if (!gameState.levelUnlocks[2]) {
        gameActions.unlockLevel(2);
      }
    }
  }, [gameState.completedLevels, gameState.levelUnlocks, gameState.isLoading]);

  // 30 Enhanced email templates
  const emailTemplates = [
    // Legitimate emails (15)
    {
      type: "legitimate", sender: "security@yourbank.com",
      subject: "Security Notice: Recent Login Detected",
      body: "We noticed a recent login to your account from a new device. If this was you, no action is needed.",
      indicators: [], urgency: "medium",
      hints: ["Official bank domain", "No urgent action demanded"]
    },
    {
      type: "legitimate", sender: "support@github.com",
      subject: "Your password was reset successfully",
      body: "Your GitHub password was recently reset. If you did not perform this action, please contact support.",
      indicators: [], urgency: "low",
      hints: ["Official GitHub domain", "Directs to official website"]
    },
    {
      type: "legitimate", sender: "noreply@paypal.com",
      subject: "Receipt for Your Payment",
      body: "Thank you for your payment. Your transaction has been completed. A receipt has been sent to your email.",
      indicators: [], urgency: "low",
      hints: ["Official PayPal domain", "No links provided"]
    },
    {
      type: "legitimate", sender: "accounts@google.com",
      subject: "New sign-in to your Google Account",
      body: "We noticed a new sign-in to your Google Account. If this was you, you can ignore this message.",
      indicators: [], urgency: "medium",
      hints: ["Official Google domain", "Clear security language"]
    },
    {
      type: "legitimate", sender: "notifications@dropbox.com",
      subject: "New device connected to your Dropbox",
      body: "A new device has been connected to your Dropbox account. If this wasn't you, secure your account.",
      indicators: [], urgency: "medium",
      hints: ["Official Dropbox domain", "Clear security notification"]
    },
    {
      type: "legitimate", sender: "security@microsoft.com",
      subject: "Unusual sign-in activity",
      body: "We detected a sign-in from a new device. If this was you, no action is needed.",
      indicators: [], urgency: "medium",
      hints: ["Official Microsoft domain", "Professional tone"]
    },
    {
      type: "legitimate", sender: "noreply@spotify.com",
      subject: "Your subscription receipt",
      body: "Thank you for your Spotify Premium subscription. Your payment has been processed successfully.",
      indicators: [], urgency: "low",
      hints: ["Official Spotify domain", "Transaction confirmation"]
    },
    {
      type: "legitimate", sender: "no-reply@accounts.twitter.com",
      subject: "Login verification code",
      body: "Your Twitter verification code is: 458392. This code will expire in 15 minutes.",
      indicators: [], urgency: "medium",
      hints: ["Official Twitter domain", "Security code provided"]
    },
    {
      type: "legitimate", sender: "auto-confirm@amazon.com",
      subject: "Your Amazon.com order",
      body: "Thank you for your order. We'll send a confirmation when your items ship.",
      indicators: [], urgency: "low",
      hints: ["Official Amazon domain", "Order confirmation"]
    },
    {
      type: "legitimate", sender: "security@linkedin.com",
      subject: "New login to your account",
      body: "We noticed a new login to your LinkedIn account. If this wasn't you, secure your account.",
      indicators: [], urgency: "medium",
      hints: ["Official LinkedIn domain", "Professional security alert"]
    },
    {
      type: "legitimate", sender: "donotreply@apple.com",
      subject: "Your Apple ID was used to sign in",
      body: "Your Apple ID was used to sign in to iCloud on a web browser. If this was you, you can ignore this message.",
      indicators: [], urgency: "medium",
      hints: ["Official Apple domain", "Clear security notification"]
    },
    {
      type: "legitimate", sender: "noreply@netflix.com",
      subject: "Your payment has been processed",
      body: "Your Netflix membership payment has been completed. Thank you for your subscription.",
      indicators: [], urgency: "low",
      hints: ["Official Netflix domain", "Payment confirmation"]
    },
    {
      type: "legitimate", sender: "mail@facebookmail.com",
      subject: "New login to Facebook",
      body: "We noticed a new login to your Facebook account. If this wasn't you, please secure your account.",
      indicators: [], urgency: "medium",
      hints: ["Official Facebook domain", "Standard security alert"]
    },
    {
      type: "legitimate", sender: "no-reply@instagram.com",
      subject: "Login attempt detected",
      body: "There was a login attempt on your Instagram account. If this was you, no action is needed.",
      indicators: [], urgency: "medium",
      hints: ["Official Instagram domain", "Security notification"]
    },
    {
      type: "legitimate", sender: "account@steampowered.com",
      subject: "Steam Guard code",
      body: "Your Steam Guard code is: 739F2. Enter this code in Steam to complete your login.",
      indicators: [], urgency: "medium",
      hints: ["Official Steam domain", "Authentication code"]
    },

    // Phishing emails (15)
    {
      type: "phishing", sender: "security@your-bank.com",
      subject: "URGENT: Your Account Will Be Suspended",
      body: "Your account has been flagged for suspicious activity. Click here to verify your identity immediately.",
      indicators: ["suspicious_domain", "urgency", "click_here", "threats"], urgency: "high",
      hints: ["Hyphen in domain name", "Creates false urgency"]
    },
    {
      type: "phishing", sender: "amazon-security@amaz0n-support.com",
      subject: "Unusual Login Activity Detected",
      body: "We detected unusual login attempts on your Amazon account. Please click the link below immediately.",
      indicators: ["typosquatting", "generic_greeting", "suspicious_link", "urgency"], urgency: "high",
      hints: ["Zero instead of 'o' in domain", "Immediate action demanded"]
    },
    {
      type: "phishing", sender: "netflix@billing-info.net",
      subject: "Payment Issue - Update Required",
      body: "Dear Customer, We're having trouble with your last payment. Please update your payment method.",
      indicators: ["generic_greeting", "suspicious_domain", "payment_urgency", "suspicious_links"], urgency: "medium",
      hints: ["Uses 'Dear Customer'", "Non-official domain"]
    },
    {
      type: "phishing", sender: "microsoft-security@account-verify.com",
      subject: "Verify Your Microsoft Account",
      body: "Your Microsoft account requires immediate verification. Failure to verify will result in termination.",
      indicators: ["fake_sender", "false_urgency", "threats", "suspicious_domain"], urgency: "high",
      hints: ["Non-Microsoft domain", "Account termination threat"]
    },
    {
      type: "phishing", sender: "apple-security@icloud-verify.net",
      subject: "iCloud Security Alert - Action Required",
      body: "Your iCloud account has been accessed from unrecognized device. Verify your identity now.",
      indicators: ["fake_sender", "urgency", "geographic_alarm", "suspicious_domain"], urgency: "high",
      hints: ["Non-Apple domain", "Foreign location scare tactic"]
    },
    {
      type: "phishing", sender: "facebook@security-update.com",
      subject: "Your Facebook Account Needs Verification",
      body: "We've detected suspicious activity on your Facebook account. Click below to verify your account.",
      indicators: ["suspicious_domain", "urgency", "threats", "generic_greeting"], urgency: "medium",
      hints: ["Non-Facebook domain", "Account deletion threat"]
    },
    {
      type: "phishing", sender: "paypal@security-alert.org",
      subject: "URGENT: Account Limited - Verify Now",
      body: "Your PayPal account has been temporarily limited due to suspicious activity. Click to verify.",
      indicators: ["suspicious_domain", "urgency", "fake_sender", "threats"], urgency: "high",
      hints: [".org domain for PayPal", "Account limitation threat"]
    },
    {
      type: "phishing", sender: "google-security@account-recovery.com",
      subject: "Critical Security Alert - Action Required",
      body: "We detected suspicious activity in your Google Account. Verify your identity immediately.",
      indicators: ["fake_sender", "urgency", "suspicious_domain"], urgency: "high",
      hints: ["Non-Google domain", "Urgent security warning"]
    },
    {
      type: "phishing", sender: "instagram@account-recovery.com",
      subject: "Your Instagram Account is at Risk",
      body: "We detected unusual activity. Confirm your identity now to secure your account.",
      indicators: ["suspicious_domain", "urgency", "fake_sender"], urgency: "high",
      hints: ["Non-Instagram domain", "Urgent security warning"]
    },
    {
      type: "phishing", sender: "twitter-support@verify-account.net",
      subject: "Account Suspension Warning",
      body: "Your Twitter account will be suspended due to policy violations. Click here to appeal.",
      indicators: ["suspicious_domain", "urgency", "threats", "fake_sender"], urgency: "high",
      hints: ["Non-Twitter domain", "Suspension threat"]
    },
    {
      type: "phishing", sender: "linkedin-security@profile-verify.com",
      subject: "Profile Verification Required",
      body: "Your LinkedIn profile requires immediate verification to avoid restrictions.",
      indicators: ["fake_sender", "urgency", "suspicious_domain"], urgency: "medium",
      hints: ["Non-LinkedIn domain", "Profile restriction threat"]
    },
    {
      type: "phishing", sender: "whatsapp@account-security.org",
      subject: "WhatsApp Account Security Alert",
      body: "Your WhatsApp account shows suspicious activity. Verify now to prevent deletion.",
      indicators: ["suspicious_domain", "urgency", "fake_sender"], urgency: "high",
      hints: ["Non-WhatsApp domain", "Account deletion threat"]
    },
    {
      type: "phishing", sender: "bankofamerica@secure-alert.net",
      subject: "Fraud Alert - Immediate Action Required",
      body: "Potential fraud detected on your Bank of America account. Click to secure your account.",
      indicators: ["fake_sender", "urgency", "suspicious_domain"], urgency: "high",
      hints: ["Non-official bank domain", "Fraud scare tactic"]
    },
    {
      type: "phishing", sender: "chase@account-protection.com",
      subject: "Account Security Update Required",
      body: "Your Chase account needs security verification. Update your information immediately.",
      indicators: ["fake_sender", "urgency", "suspicious_domain"], urgency: "high",
      hints: ["Non-Chase domain", "Security update demand"]
    },
    {
      type: "phishing", sender: "wellsfargo@online-banking.net",
      subject: "Online Banking Access Suspended",
      body: "Your online banking access has been suspended due to security concerns. Reactivate now.",
      indicators: ["fake_sender", "urgency", "suspicious_domain", "threats"], urgency: "high",
      hints: ["Non-Wells Fargo domain", "Access suspension threat"]
    }
  ];

  // Dynamic email template variations
  const getDynamicTemplate = (baseTemplate) => {
    const variants = {
      subjects: ["URGENT: ", "IMPORTANT: ", "Security Alert: ", "Action Required: ", "Notice: "],
      urgencyWords: ["immediately", "right away", "as soon as possible", "urgently"],
      locations: ["China", "Russia", "Brazil", "Nigeria", "Unknown location"]
    };

    let dynamicTemplate = { ...baseTemplate };
    
    if (baseTemplate.type === "phishing" && Math.random() > 0.4) {
      const randomSubject = variants.subjects[Math.floor(Math.random() * variants.subjects.length)];
      if (!dynamicTemplate.subject.startsWith("URGENT: ") && !dynamicTemplate.subject.startsWith("IMPORTANT: ")) {
        dynamicTemplate.subject = randomSubject + dynamicTemplate.subject;
      }
      
      // Add location variation
      if (Math.random() > 0.6 && dynamicTemplate.body.includes("from")) {
        const randomLocation = variants.locations[Math.floor(Math.random() * variants.locations.length)];
        dynamicTemplate.body = dynamicTemplate.body.replace(/from.*?\./g, `from ${randomLocation}.`);
      }
    }

    return dynamicTemplate;
  };

  // Sound effects
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
      gameState.levelPasswords[2],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[2],
      localStorage.getItem('level2_password')
    ];

    return sources.find(p => p && p.startsWith('HZ-L2-'));
  };

  const normalizePassword = (password) => {
    return password.trim().toUpperCase();
  };

  const checkLevelPassword = () => {
    initAudio();
    
    const inputPassword = normalizePassword(passwordInput);
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      setPasswordError("Please enter the Level 2 password");
      return;
    }
    
    if (!savedPassword) {
      setPasswordError("No Level 2 password found. Please complete The Firewall Gate level first.");
      return;
    }
    
    const normalizedSavedPassword = normalizePassword(savedPassword);
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setPasswordError("");
      setShowTutorial(true);
      gameActions.unlockLevel(2);
      playSound(800, 0.2);
    } else {
      setPasswordError(`Invalid Level 2 password. The password should start with "HZ-L2-".`);
      playSound(300, 0.3, 'square');
    }
  };

  const skipPassword = () => {
    initAudio();
    setGameStatus(prev => ({ ...prev, status: "idle" }));
    setShowTutorial(true);
    gameActions.unlockLevel(2);
  };

  const generateLevelPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L3-${password}`;
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

  // Enhanced email generation with better pacing
  useEffect(() => {
    let emailInterval;
    
    if (gameStatus.status === "running" && !gameStatus.isPaused) {
      const getEmailInterval = () => {
        // Base intervals with better pacing
        const baseIntervals = {
          easy: 6000,
          normal: 4500,
          hard: 3000
        };
        
        const baseInterval = baseIntervals[difficulty] || 4500;
        const progressFactor = Math.max(0.7, 1 - (gameStatus.phishingDetected / 15));
        const speedFactor = 1 / gameSpeed;
        
        return (baseInterval * progressFactor * speedFactor);
      };

      const generateEmail = () => {
        // Check if all templates have been used and player hasn't reached goal
        if (usedTemplatesRef.current.size >= emailTemplates.length && gameStatus.phishingDetected < 5) {
          handleGameOver("Templates exhausted");
          return;
        }

        // Remove old emails (older than 2 minutes or more than 8 emails)
        const now = Date.now();
        setEmails(prev => prev.filter(email => 
          now - email.id < 120000 && prev.indexOf(email) < 30
        ));

        // Don't generate if we have too many active emails
        if (emails.length >= 8) return;

        // Dynamic phishing ratio
        let phishingRatio = difficulty === "easy" ? 0.4 : difficulty === "normal" ? 0.5 : 0.6;
        
        // Adjust ratio based on player performance
        const totalActions = gameStatus.phishingDetected + gameStatus.phishingMissed;
        if (totalActions > 5) {
          const accuracy = gameStatus.phishingDetected / totalActions;
          if (accuracy > 0.8) phishingRatio = Math.min(0.8, phishingRatio + 0.1);
          if (accuracy < 0.4) phishingRatio = Math.max(0.3, phishingRatio - 0.1);
        }

        // Get available templates (prefer unused ones)
        const unusedTemplates = emailTemplates.filter(t => !usedTemplatesRef.current.has(t.sender + t.subject));
        const availableTemplates = unusedTemplates.length > 0 ? unusedTemplates : emailTemplates;
        
        const filteredTemplates = availableTemplates.filter(email => 
          email.type === "phishing" ? Math.random() < phishingRatio : Math.random() < (1 - phishingRatio)
        );
        
        if (filteredTemplates.length === 0) return;
        
        const baseTemplate = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
        const dynamicTemplate = getDynamicTemplate(baseTemplate);
        
        // Mark template as used
        usedTemplatesRef.current.add(baseTemplate.sender + baseTemplate.subject);
        totalEmailsSentRef.current += 1;
        
        emailCounterRef.current += 1;
        const newEmail = {
          id: Date.now() + emailCounterRef.current,
          ...dynamicTemplate,
          originalTemplate: baseTemplate,
          timestamp: new Date().toLocaleTimeString(),
          isRead: false,
          userAction: null
        };

        setEmails(prev => [newEmail, ...prev.slice(0, 7)]);
        addGameLog(`📧 New email from ${newEmail.sender}`, "info");
        
        // Check if we're running out of templates
        if (usedTemplatesRef.current.size >= emailTemplates.length - 5) {
          addGameLog("⚠️  Warning: Running low on email templates!", "warning");
        }
      };

      // Initial delay then start generating
      const initialDelay = setTimeout(() => {
        generateEmail();
        emailInterval = setInterval(generateEmail, getEmailInterval());
      }, 2000);

      return () => {
        clearTimeout(initialDelay);
        if (emailInterval) clearInterval(emailInterval);
      };
    }
    
    return () => {
      if (emailInterval) clearInterval(emailInterval);
    };
  }, [gameStatus.status, gameStatus.isPaused, difficulty, gameSpeed, gameStatus.phishingDetected, emails.length]);

  const handleEmailAction = (emailId, action) => {
    if (gameStatus.status !== "running" || gameStatus.isPaused) return;

    const email = emails.find(e => e.id === emailId);
    if (!email || email.userAction) return;

    const isCorrect = 
      (action === "reported" && email.type === "phishing") ||
      (action === "ignored" && email.type === "legitimate");

    const newCombo = isCorrect ? comboMultiplier + 0.1 : 1;
    setComboMultiplier(newCombo);

    const newStreak = isCorrect ? gameStatus.streak + 1 : 0;
    const newMaxStreak = Math.max(gameStatus.maxStreak, newStreak);

    if (isCorrect) {
      const basePoints = action === "reported" ? 25 : 10;
      const streakBonus = newStreak * 2;
      const comboBonus = (newCombo - 1) * 10;
      const totalPoints = Math.floor((basePoints + streakBonus + comboBonus) * gameSpeed);

      if (action === "reported") {
        setGameStatus(prev => ({
          ...prev,
          phishingDetected: prev.phishingDetected + 1,
          score: prev.score + totalPoints,
          streak: newStreak,
          maxStreak: newMaxStreak
        }));
        playSound(800, 0.2);
        addGameLog(`✅ Correctly reported phishing from ${email.sender} (+${totalPoints})`, "success");
      } else {
        setGameStatus(prev => ({
          ...prev,
          score: prev.score + totalPoints,
          streak: newStreak,
          maxStreak: newMaxStreak
        }));
        playSound(600, 0.15);
        addGameLog(`✅ Correctly ignored legitimate email from ${email.sender} (+${totalPoints})`, "success");
      }

      if (!achievements.firstBlood && gameStatus.phishingDetected === 0 && action === "reported") {
        setAchievements(prev => ({ ...prev, firstBlood: true }));
      }
    } else {
      const newLives = gameStatus.lives - 1;
      setGameStatus(prev => ({
        ...prev,
        phishingMissed: prev.phishingMissed + 1,
        score: Math.max(0, prev.score - 20),
        streak: 0,
        lives: newLives
      }));
      setComboMultiplier(1);
      playSound(300, 0.3, 'square');

      if (action === "reported") {
        addGameLog(`❌ Wrongly reported legitimate email from ${email.sender}`, "error");
      } else {
        addGameLog(`❌ Missed phishing email from ${email.sender}`, "error");
      }

      if (newLives <= 0) {
        setTimeout(() => handleGameOver("No lives left"), 500);
      }
    }

    setEmails(prev => 
      prev.map(e => 
        e.id === emailId ? { ...e, userAction: action, isRead: true } : e
      )
    );

    checkAchievements();
  };

  const checkAchievements = () => {
    const newAchievements = { ...achievements };
    
    if (gameStatus.score >= 300 && !achievements.perfectGame) {
      newAchievements.perfectGame = true;
    }
    
    if (gameStatus.timeElapsed < 120 && gameStatus.phishingDetected >= 5 && !achievements.speedRunner) {
      newAchievements.speedRunner = true;
    }
    
    if (gameStatus.streak >= 5 && !achievements.noMistakes) {
      newAchievements.noMistakes = true;
    }
    
    setAchievements(newAchievements);
  };

  const addGameLog = (message, type = "info") => {
    setGameLog(prev => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 8)]);
  };

  const startGame = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    initAudio();
    
    // Reset all game state
    setGameStatus({
      status: "running",
      timeElapsed: 0,
      score: 0,
      phishingDetected: 0,
      phishingMissed: 0,
      level: 2,
      isPaused: false,
      streak: 0,
      maxStreak: 0,
      lives: 3
    });
    setEmails([]);
    setGameLog([]);
    setLevelPassword("");
    setShowTutorial(false);
    setComboMultiplier(1);
    setAchievements({
      perfectGame: false,
      speedRunner: false,
      noMistakes: false,
      firstBlood: false
    });
    
    // Reset counters
    emailCounterRef.current = 0;
    usedTemplatesRef.current = new Set();
    totalEmailsSentRef.current = 0;
    
    addGameLog("🎯 Game started! Identify and report phishing emails", "info");
    addGameLog(`🎚️ Difficulty: ${difficulty.toUpperCase()}`, "info");
    addGameLog(`📧 ${emailTemplates.length} unique email templates loaded`, "info");
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
      phishingDetected: 0,
      phishingMissed: 0,
      level: 2,
      isPaused: false,
      streak: 0,
      maxStreak: 0,
      lives: 3
    });
    setEmails([]);
    setGameLog([]);
    setLevelPassword("");
    setComboMultiplier(1);
    usedTemplatesRef.current = new Set();
    totalEmailsSentRef.current = 0;
  };

  const handleGameOver = (reason = "No lives left") => {
    setGameStatus(prev => ({ ...prev, status: "failed" }));
    
    if (reason === "Templates exhausted") {
      addGameLog("💀 Game Over! All email templates exhausted - you didn't catch enough phishing emails", "error");
    } else {
      addGameLog("💀 Game Over! Too many phishing emails missed", "error");
    }
    
    addGameLog(`📊 Final Score: ${gameStatus.score} | Phishing Detected: ${gameStatus.phishingDetected}/5`, "info");
    playSound(200, 0.5, 'sawtooth');
  };

  const completeLevel = () => {
    if (gameStatus.status === "running" && gameStatus.phishingDetected >= 5) {
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      addGameLog("🎉 Level Completed! All phishing emails detected", "success");
      addGameLog(`🔑 Level 3 Password: ${password}`, "success");
      
      const xpEarned = 150 + Math.floor(gameStatus.score / 10);
      addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
      
      try {
        gameActions.completeLevel(2, xpEarned, password);
      } catch (error) {
        console.error('GameContext error:', error);
      }
      
      playSound(1000, 0.5);
    }
  };

  useEffect(() => {
    if (gameStatus.phishingDetected >= 5 && gameStatus.status === "running") {
      completeLevel();
    }
  }, [gameStatus.phishingDetected, gameStatus.status]);

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  const getEmailColor = (email) => {
    if (email.userAction) {
      return email.userAction === "reported" 
        ? "border-red-500/30 bg-red-500/10" 
        : "border-green-500/30 bg-green-500/10";
    }
    
    if (email.type === "phishing") {
      return email.urgency === "high" 
        ? "border-red-400/50 bg-red-500/5" 
        : "border-orange-400/50 bg-orange-500/5";
    }
    
    return "border-gray-500/30 bg-gray-500/5";
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case "high": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case "medium": return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case "low": return <MessageCircle className="w-4 h-4 text-blue-400" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  // Auto-pause when window loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameStatus.status === "running" && !gameStatus.isPaused) {
        setGameStatus(prev => ({ ...prev, isPaused: true }));
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameStatus.status, gameStatus.isPaused]);

  // Mobile responsive stats display
  const MobileStats = () => (
    <div className="flex items-center gap-4 text-xs">
      <div className="text-center">
        <div className="text-purple-400 font-bold">{gameStatus.score}</div>
        <div className="text-gray-400">Score</div>
      </div>
      <div className="text-center">
        <div className="text-green-400 font-bold">{gameStatus.phishingDetected}/5</div>
        <div className="text-gray-400">Caught</div>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1">
          <div className="text-red-400 font-bold">{gameStatus.lives}</div>
          <Heart className="w-3 h-3 text-red-400" />
        </div>
        <div className="text-gray-400">Lives</div>
      </div>
    </div>
  );

  // Enhanced mobile header similar to FirewallGame
  const MobileHeader = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-3 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/levels")}
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Phisher's Trap</h1>
            <p className="text-purple-400 text-xs">Level 2</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MobileStats />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 sm:p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile sidebar menu
  const MobileSidebar = () => (
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
                <span className="text-gray-400">Time:</span>
                <span className="text-cyan-400">
                  {Math.floor(gameStatus.timeElapsed / 60)}:{(gameStatus.timeElapsed % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Combo:</span>
                <span className="text-green-400">x{comboMultiplier.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Max Streak:</span>
                <span className="text-yellow-400">{gameStatus.maxStreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-green-400">
                  {gameStatus.phishingDetected + gameStatus.phishingMissed > 0 
                    ? Math.round((gameStatus.phishingDetected) / (gameStatus.phishingDetected + gameStatus.phishingMissed) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Templates Used:</span>
                <span className="text-purple-400">{usedTemplatesRef.current.size}/{emailTemplates.length}</span>
              </div>
            </div>
          </div>

          {/* Game Log */}
          <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
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

          {/* Achievements */}
          <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Achievements
            </h3>
            <div className="space-y-2 text-sm">
              <div className={`flex items-center gap-2 ${achievements.firstBlood ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-current rounded-full" />
                <span>First Blood</span>
              </div>
              <div className={`flex items-center gap-2 ${achievements.noMistakes ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-current rounded-full" />
                <span>5+ Streak</span>
              </div>
              <div className={`flex items-center gap-2 ${achievements.speedRunner ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-current rounded-full" />
                <span>Speed Runner</span>
              </div>
              <div className={`flex items-center gap-2 ${achievements.perfectGame ? 'text-green-400' : 'text-gray-500'}`}>
                <div className="w-2 h-2 bg-current rounded-full" />
                <span>Perfect Game</span>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mt-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Settings
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Sound:</span>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Hints:</span>
                <button
                  onClick={() => setShowHints(!showHints)}
                  className={`p-1 ${showHints ? 'text-green-400' : 'text-gray-400'}`}
                >
                  {showHints ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black py-4 px-3 sm:py-8 sm:px-4 pt-20 sm:pt-24">
        <MobileHeader />
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass card-cyber p-4 sm:p-8 rounded-2xl border border-purple-500/30">
            <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Phisher's Trap</h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-lg">Level 2: Email Security Challenge</p>
            
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => setUnlockMethod("password")}
                className={`flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-base ${
                  unlockMethod === "password" 
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20" 
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <Key className="w-3 h-3 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Enter with Password
              </button>
              <button
                onClick={() => setUnlockMethod("skip")}
                className={`flex-1 py-2 sm:py-3 rounded-xl font-semibold transition-all text-xs sm:text-base ${
                  unlockMethod === "skip" 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <HelpCircle className="w-3 h-3 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                Can't Remember
              </button>
            </div>

            {unlockMethod === "password" ? (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <Key className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Level 2 Password Required</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                  Enter the password from The Firewall Gate level
                </p>
                
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError("");
                    }}
                    placeholder="Enter Level 2 Password (HZ-L2-...)"
                    className="w-full bg-black/50 border border-purple-500/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 text-center font-mono text-sm sm:text-base"
                    onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                  />
                  {passwordError && (
                    <p className="text-red-400 text-xs sm:text-sm mt-2">{passwordError}</p>
                  )}
                  <button
                    onClick={checkLevelPassword}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold mt-3 sm:mt-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm sm:text-base"
                  >
                    Unlock Level 2
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400 mx-auto mb-2 sm:mb-3" />
                <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Can't Remember Password?</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                  Practice mode available. Complete The Firewall Gate for full progression.
                </p>
                
                <button
                  onClick={skipPassword}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all text-sm sm:text-base"
                >
                  Enter Practice Mode
                </button>
              </div>
            )}

            <div className="text-left bg-gray-800/30 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                What to Expect:
              </h4>
              <ul className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-2">
                <li>• Analyze 30 unique email templates</li>
                <li>• Report phishing and ignore legitimate emails</li>
                <li>• Multiple difficulty levels with better pacing</li>
                <li>• Catch 5 phishing emails before templates run out</li>
                <li>• Smart email generation prevents repetition</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black py-4 px-3 sm:py-8 sm:px-4 pt-20 sm:pt-24">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
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
        {/* Desktop Header - Hidden on mobile */}
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
              <Mail className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Phisher's Trap</h1>
                <p className="text-purple-400 text-sm">Email Security & Phishing Detection</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{gameStatus.phishingDetected}/5</div>
              <div className="text-gray-400 text-sm">Caught</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <div className="text-2xl font-bold text-red-400">{gameStatus.lives}</div>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-gray-400 text-sm">Lives</div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <div className="text-2xl font-bold text-yellow-400">{gameStatus.streak}</div>
              </div>
              <div className="text-gray-400 text-sm">Streak</div>
            </div>
          </div>
        </div>

        {/* Template Progress */}
        {gameStatus.status === "running" && (
          <div className="mb-4 sm:mb-6 glass card-cyber p-3 sm:p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1 sm:gap-2">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                <span className="text-white">Email Templates:</span>
                <span className="text-green-400">{usedTemplatesRef.current.size}</span>
                <span className="text-gray-400">/</span>
                <span className="text-cyan-400">{emailTemplates.length}</span>
                <span className="text-gray-400 hidden sm:inline">used</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-white hidden sm:inline">Remaining:</span>
                <span className="text-yellow-400">{emailTemplates.length - usedTemplatesRef.current.size}</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1 sm:h-2 mt-1 sm:mt-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 sm:h-2 rounded-full transition-all duration-500"
                style={{ width: `${(usedTemplatesRef.current.size / emailTemplates.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

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
                className="glass card-cyber p-4 sm:p-8 max-w-2xl w-full border border-purple-500/30 rounded-2xl"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">Welcome to Phisher's Trap</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">30 Unique Email Templates</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Analyze 30 different emails - no repeats until all are used</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Better Pacing</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Emails arrive at reasonable intervals based on difficulty</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Template Management</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Game ends if you run out of templates before catching 5 phishing emails</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-purple-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors text-sm sm:text-base"
                >
                  Start Game
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Email Inbox */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  Email Inbox
                  {gameStatus.status === "running" && (
                    <span className="text-xs sm:text-sm text-gray-400">
                      ({emails.length}/30 active)
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Difficulty Dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button 
                      className="bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white text-xs sm:text-sm flex items-center gap-1 sm:gap-2 min-h-[36px] sm:min-h-[40px]"
                      disabled={gameStatus.status === "running"}
                    >
                      {difficulty}
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Menu.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-28 sm:w-32 origin-top-right bg-gray-800 border border-gray-600 rounded-xl shadow-lg z-50">
                        <div className="p-1">
                          {['easy', 'normal', 'hard'].map((level) => (
                            <Menu.Item key={level}>
                              {({ active }) => (
                                <button
                                  onClick={() => setDifficulty(level)}
                                  disabled={gameStatus.status === "running"}
                                  className={`${active ? 'bg-purple-500 text-white' : 'text-gray-300'} rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm w-full text-left capitalize disabled:opacity-50`}
                                >
                                  {level}
                                </button>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/* Game Speed */}
                  <select
                    value={gameSpeed}
                    onChange={(e) => setGameSpeed(parseFloat(e.target.value))}
                    disabled={gameStatus.status === "running"}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 min-h-[36px] sm:min-h-[40px]"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={1}>1x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 sm:p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Email List */}
              <div className="space-y-3 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                {emails.length === 0 ? (
                  <div className="text-center py-8 sm:py-12 text-gray-500">
                    <Mail className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">No emails yet. Start the game to receive emails.</p>
                  </div>
                ) : (
                  emails.map(email => (
                    <motion.div
                      key={email.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${getEmailColor(email)}`}
                      onClick={() => !email.isRead && setEmails(prev => 
                        prev.map(e => e.id === email.id ? { ...e, isRead: true } : e)
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          {getUrgencyIcon(email.urgency)}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-white text-sm truncate">
                              {email.sender}
                            </div>
                            <div className="text-gray-300 text-xs truncate">
                              {email.subject}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                          {email.type === "phishing" && !email.userAction && (
                            <span className="px-1 sm:px-2 py-0.5 sm:py-1 bg-red-500/20 text-red-400 rounded text-xs">
                              Suspicious
                            </span>
                          )}
                          <span className="text-gray-500 text-xs hidden sm:block">
                            {email.timestamp}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {email.body}
                      </p>

                      {email.isRead && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmailAction(email.id, "reported");
                            }}
                            className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all min-h-[44px] ${
                              email.userAction === "reported"
                                ? "bg-red-500 text-white"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            }`}
                          >
                            Report Phishing
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEmailAction(email.id, "ignored");
                            }}
                            className={`flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all min-h-[44px] ${
                              email.userAction === "ignored"
                                ? "bg-green-500 text-white"
                                : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            }`}
                          >
                            Ignore (Legit)
                          </button>
                        </div>
                      )}

                      {showHints && email.indicators.length > 0 && email.type === "phishing" && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {email.indicators.map((indicator, idx) => (
                            <span key={idx} className="px-1 sm:px-2 py-0.5 sm:py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                              {indicator.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>

              {/* Game Controls */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                <div className="flex gap-2 sm:gap-3">
                  {gameStatus.status === "idle" ? (
                    <button
                      onClick={startGame}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base min-h-[44px]"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Start Game
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={pauseGame}
                        className="flex-1 bg-yellow-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base min-h-[44px]"
                      >
                        {gameStatus.isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
                        {gameStatus.isPaused ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={resetGame}
                        className="flex-1 bg-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base min-h-[44px]"
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
          <div className="hidden lg:block lg:col-span-1 space-y-6">
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
                  <span className="text-gray-400">Combo:</span>
                  <span className="text-green-400">x{comboMultiplier.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Max Streak:</span>
                  <span className="text-yellow-400">{gameStatus.maxStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-green-400">
                    {gameStatus.phishingDetected + gameStatus.phishingMissed > 0 
                      ? Math.round((gameStatus.phishingDetected) / (gameStatus.phishingDetected + gameStatus.phishingMissed) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Templates Used:</span>
                  <span className="text-purple-400">{usedTemplatesRef.current.size}/{emailTemplates.length}</span>
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

            {/* Achievements */}
            <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-2 text-sm">
                <div className={`flex items-center gap-2 ${achievements.firstBlood ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 bg-current rounded-full" />
                  <span>First Blood</span>
                </div>
                <div className={`flex items-center gap-2 ${achievements.noMistakes ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 bg-current rounded-full" />
                  <span>5+ Streak</span>
                </div>
                <div className={`flex items-center gap-2 ${achievements.speedRunner ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 bg-current rounded-full" />
                  <span>Speed Runner</span>
                </div>
                <div className={`flex items-center gap-2 ${achievements.perfectGame ? 'text-green-400' : 'text-gray-500'}`}>
                  <div className="w-2 h-2 bg-current rounded-full" />
                  <span>Perfect Game</span>
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
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-1 sm:mb-2 text-sm sm:text-base">Phishing Indicators</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Recognize suspicious domains, urgent language, and social engineering tactics</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">Email Analysis</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn to analyze email headers, sender addresses, and content for authenticity</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Social Engineering</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand psychological manipulation techniques used in phishing attacks</p>
            </div>
            <div className="p-3 sm:p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <h4 className="font-semibold text-red-400 mb-1 sm:mb-2 text-sm sm:text-base">Safe Practices</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Develop habits for verifying email authenticity and reporting suspicious messages</p>
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
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">You successfully identified phishing emails</p>
                <p className="text-yellow-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  Used {usedTemplatesRef.current.size} out of {emailTemplates.length} templates
                </p>
                
                <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-purple-500/30 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Level 3 Password:</span>
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
                    className="flex-1 bg-purple-500 text-white px-3 sm:px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => navigate("/levels")}
                    className="flex-1 bg-cyan-500 text-white px-3 sm:px-6 py-2 rounded-xl hover:bg-cyan-600 transition-colors text-sm sm:text-base"
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
              <div className="text-center bg-gray-800/95 p-4 sm:p-8 rounded-2xl border border-red-500/30 max-w-md w-full">
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-gray-300 mb-2 text-sm sm:text-base">
                  {usedTemplatesRef.current.size >= emailTemplates.length 
                    ? "All email templates exhausted - you didn't catch enough phishing emails!"
                    : "Too many phishing emails missed!"
                  }
                </p>
                <p className="text-yellow-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  Final Score: {gameStatus.score} | Phishing Detected: {gameStatus.phishingDetected}/5
                </p>
                <button
                  onClick={resetGame}
                  className="bg-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
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

// Heart icon component
const Heart = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
  </svg>
);