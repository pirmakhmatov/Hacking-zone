// src/pages/Levels.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { 
  Lock, Unlock, Star, Trophy, Zap, Shield, 
  Code2, Key, Network, Eye, Search, Flag,
  Award, Clock, Users, Brain, Crown, Sparkles,
  Play, CheckCircle, XCircle, AlertTriangle,
  BarChart3, Target, Calendar, Rocket
} from "lucide-react";

export default function Levels() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("order");

  // Complete game levels data matching your design
  const gameLevels = [
    {
      id: 1,
      name: "The Firewall Gate",
      concept: "Network Security Basics",
      description: "Learn how firewalls protect systems and networks from unauthorized access.",
      mission: "Configure virtual firewall rules to stop a simulated DDoS attack and block malicious IP addresses.",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      xp: 100,
      badge: "Firewall Master",
      duration: "15-20 min",
      difficulty: "Easy",
      difficultyLevel: 1,
      prerequisites: [],
      tools: ["iptables", "Windows Firewall"],
      skills: ["Firewall Configuration", "Rule Management", "Traffic Analysis"],
      enemies: ["Script Kiddies", "Basic Bots"],
      story: "A mysterious entity is trying to breach your network. Configure the firewall to protect your digital fortress.",
      unlockMessage: "Welcome to Hacking-Zone! Start your journey by mastering firewall basics."
    },
    {
      id: 2,
      name: "Phisher's Trap",
      concept: "Phishing Awareness", 
      description: "Learn to recognize and avoid phishing emails, malicious links, and social engineering attacks.",
      mission: "Identify fake URLs, suspicious email headers, and social engineering attempts in a simulated corporate environment.",
      icon: Eye,
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      xp: 150,
      badge: "Phish Buster",
      duration: "10-15 min",
      difficulty: "Easy",
      difficultyLevel: 1,
      prerequisites: [1],
      tools: ["Email Headers", "URL Analysis"],
      skills: ["Email Analysis", "Social Engineering Detection", "URL Verification"],
      enemies: ["Phishing Gangs", "Social Engineers"],
      story: "Your company is being targeted by sophisticated phishing campaigns. Identify the threats before they cause damage.",
      unlockMessage: "Complete Firewall Gate to learn about email security threats."
    },
    {
      id: 3,
      name: "Password Vault",
      concept: "Password Security",
      description: "Understand password strength, hashing algorithms, and brute-force protection mechanisms.",
      mission: "Create secure passwords, implement proper hashing, and defend against brute-force attacks.",
      icon: Key,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
      xp: 200,
      badge: "Vault Guardian",
      duration: "20-25 min",
      difficulty: "Medium",
      difficultyLevel: 2,
      prerequisites: [1, 2],
      tools: ["Hashcat", "John the Ripper", "Password Managers"],
      skills: ["Password Cracking", "Hash Analysis", "Security Policies"],
      enemies: ["Brute-Force Bots", "Password Crackers"],
      story: "A hacker has stolen password hashes from your database. Secure the vault before they crack all passwords.",
      unlockMessage: "Master phishing detection to advance to password security."
    },
    {
      id: 4,
      name: "Encrypted Zone",
      concept: "Encryption & Decryption",
      description: "Introduction to classical and modern encryption techniques including AES, RSA, and cryptographic protocols.",
      mission: "Decrypt hidden messages using various ciphers and implement secure communication channels.",
      icon: Lock,
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      xp: 250,
      badge: "Encryption Master",
      duration: "25-30 min",
      difficulty: "Medium",
      difficultyLevel: 2,
      prerequisites: [3],
      tools: ["OpenSSL", "Cryptool", "Custom Ciphers"],
      skills: ["Cryptanalysis", "Algorithm Understanding", "Key Management"],
      enemies: ["Code Breakers", "Cryptanalysts"],
      story: "Intercept and decrypt enemy communications while protecting your own messages with strong encryption.",
      unlockMessage: "Complete Password Vault to unlock encryption challenges."
    },
    {
      id: 5,
      name: "The Port Scanner",
      concept: "Networking & Ports",
      description: "Learn about TCP/IP protocols, port scanning techniques, and network reconnaissance.",
      mission: "Use network scanning tools to discover open ports, services, and potential vulnerabilities.",
      icon: Network,
      color: "from-yellow-500 to-orange-500",
      gradient: "bg-gradient-to-br from-yellow-500 to-orange-500",
      xp: 300,
      badge: "Network Scout",
      duration: "15-20 min",
      difficulty: "Medium",
      difficultyLevel: 2,
      prerequisites: [4],
      tools: ["Nmap", "Netcat", "Wireshark"],
      skills: ["Network Scanning", "Service Detection", "Traffic Analysis"],
      enemies: ["Network Scouts", "Reconnaissance Teams"],
      story: "Scan the enemy network to gather intelligence while avoiding detection by their security systems.",
      unlockMessage: "Master encryption to begin network exploration."
    },
    {
      id: 6,
      name: "SQL Vault Breach", 
      concept: "SQL Injection Basics",
      description: "Understand database vulnerabilities and SQL injection attacks that can compromise web applications.",
      mission: "Identify and exploit SQL injection vulnerabilities in a vulnerable web application, then implement proper defenses.",
      icon: Code2,
      color: "from-red-500 to-pink-500",
      gradient: "bg-gradient-to-br from-red-500 to-pink-500",
      xp: 350,
      badge: "SQL Sentinel",
      duration: "30-35 min",
      difficulty: "Hard",
      difficultyLevel: 3,
      prerequisites: [5],
      tools: ["SQLmap", "Burp Suite", "Custom Scripts"],
      skills: ["SQL Injection", "Database Security", "Input Validation"],
      enemies: ["Web Hackers", "Database Raiders"],
      story: "A vulnerable web application contains sensitive data. Exploit SQL injection to access it, then secure the application.",
      unlockMessage: "Complete network scanning to access web application security."
    },
    {
      id: 7,
      name: "XSS Arena",
      concept: "Cross-Site Scripting",
      description: "Learn about XSS vulnerabilities, their impact, and how to prevent them in web applications.",
      mission: "Inject and execute malicious scripts in a vulnerable web application, then implement proper input sanitization.",
      icon: Zap,
      color: "from-pink-500 to-purple-500",
      gradient: "bg-gradient-to-br from-pink-500 to-purple-500",
      xp: 400,
      badge: "XSS Warrior",
      duration: "25-30 min",
      difficulty: "Hard",
      difficultyLevel: 3,
      prerequisites: [6],
      tools: ["Browser DevTools", "XSS Payloads", "Security Headers"],
      skills: ["XSS Exploitation", "Input Sanitization", "Content Security Policy"],
      enemies: ["XSS Specialists", "Web Warriors"],
      story: "A popular forum is vulnerable to XSS attacks. Demonstrate the risk and help implement proper defenses.",
      unlockMessage: "Master SQL injection to advance to client-side attacks."
    },
    {
      id: 8,
      name: "Man-in-the-Middle",
      concept: "Network Sniffing & HTTPS", 
      description: "Learn how attackers intercept network traffic and the importance of encrypted communications.",
      mission: "Intercept and analyze network packets, then implement proper TLS/SSL configurations.",
      icon: Search,
      color: "from-cyan-500 to-blue-500",
      gradient: "bg-gradient-to-br from-cyan-500 to-blue-500",
      xp: 450,
      badge: "Packet Inspector",
      duration: "35-40 min",
      difficulty: "Hard",
      difficultyLevel: 3,
      prerequisites: [7],
      tools: ["Wireshark", "SSLstrip", "Certificate Analysis"],
      skills: ["Packet Analysis", "TLS/SSL", "Certificate Management"],
      enemies: ["Network Sniffers", "Traffic Interceptors"],
      story: "An attacker is intercepting your company's communications. Detect and prevent the MITM attack.",
      unlockMessage: "Complete XSS challenges to learn about network interception."
    },
    {
      id: 9,
      name: "Digital Forensics Lab",
      concept: "Trace Investigation",
      description: "Learn digital forensics techniques to analyze logs, recover data, and investigate security incidents.",
      mission: "Analyze system logs, recover deleted files, and trace the steps of a cyber intruder.",
      icon: Brain,
      color: "from-emerald-500 to-green-500",
      gradient: "bg-gradient-to-br from-emerald-500 to-green-500",
      xp: 500,
      badge: "Cyber Detective",
      duration: "40-45 min",
      difficulty: "Expert",
      difficultyLevel: 4,
      prerequisites: [8],
      tools: ["Autopsy", "FTK Imager", "Log Analysis"],
      skills: ["Forensic Analysis", "Evidence Handling", "Incident Response"],
      enemies: ["Advanced Hackers", "Incident Responders"],
      story: "A sophisticated attacker has compromised a system. Use forensic tools to uncover their methods and tracks.",
      unlockMessage: "Master network analysis to begin forensic investigation."
    },
    {
      id: 10,
      name: "The Cyber Fortress",
      concept: "Final Challenge",
      description: "Combine all learned skills in a comprehensive cybersecurity defense scenario.",
      mission: "Defend a complete organization infrastructure against multiple attack vectors using all techniques learned.",
      icon: Crown,
      color: "from-yellow-500 to-red-500",
      gradient: "bg-gradient-to-br from-yellow-500 to-red-500",
      xp: 1000,
      badge: "Cyber Guardian",
      duration: "60+ min",
      difficulty: "Expert",
      difficultyLevel: 4,
      prerequisites: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tools: ["All Previous Tools", "SIEM", "IDS/IPS"],
      skills: ["Comprehensive Defense", "Incident Management", "Security Architecture"],
      enemies: ["Elite Hacker Group", "APT Actors"],
      story: "A coordinated attack is targeting your entire organization. Use every skill you've learned to defend the fortress.",
      unlockMessage: "Complete all previous levels to face the ultimate challenge."
    }
  ];

  // Filter and sort levels
  const filteredLevels = gameLevels
    .filter(level => {
      const matchesSearch = level.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           level.concept.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = filterDifficulty === "all" || level.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "order": return a.id - b.id;
        case "difficulty": return a.difficultyLevel - b.difficultyLevel;
        case "xp": return b.xp - a.xp;
        case "duration": return a.duration.localeCompare(b.duration);
        default: return a.id - b.id;
      }
    });

  const isLevelUnlocked = (levelId) => {
    if (!isAuthenticated) return false;
    if (levelId === 1) return true; // First level is always unlocked
    const level = gameLevels.find(l => l.id === levelId);
    return level.prerequisites.every(prereqId => 
      gameState.completedLevels.includes(prereqId)
    );
  };

  const isLevelCompleted = (levelId) => {
    return gameState.completedLevels.includes(levelId);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case "Easy": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
      case "Hard": return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "Expert": return "text-red-400 bg-red-500/20 border-red-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getProgressStats = () => {
    const totalLevels = gameLevels.length;
    const completedCount = gameState.completedLevels.length;
    const completionPercentage = Math.round((completedCount / totalLevels) * 100);
    const totalXP = gameLevels
      .filter(level => isLevelCompleted(level.id))
      .reduce((sum, level) => sum + level.xp, 0);
    const availableXP = gameLevels.reduce((sum, level) => sum + level.xp, 0);

    return {
      totalLevels,
      completedCount,
      completionPercentage,
      totalXP,
      availableXP,
      badgesEarned: gameLevels.filter(level => isLevelCompleted(level.id)).length
    };
  };

  const progressStats = getProgressStats();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const levelCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-24">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="max-w-6xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.section className="text-center mb-12" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Game Levels
            </h1>
            <Flag className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
            Complete challenges, earn badges, and become a cybersecurity expert through hands-on learning
          </p>

          {/* Progress Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            variants={statsVariants}
          >
            <div className="glass card-cyber p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {progressStats.completedCount}/{progressStats.totalLevels}
              </div>
              <div className="text-gray-400 text-sm">Completed</div>
            </div>
            <div className="glass card-cyber p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-emerald-400 mb-1">
                {progressStats.totalXP}
              </div>
              <div className="text-gray-400 text-sm">Total XP</div>
            </div>
            <div className="glass card-cyber p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {progressStats.completionPercentage}%
              </div>
              <div className="text-gray-400 text-sm">Progress</div>
            </div>
            <div className="glass card-cyber p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {progressStats.badgesEarned}
              </div>
              <div className="text-gray-400 text-sm">Badges</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Controls */}
        <motion.section className="glass card-cyber p-6 mb-8 border border-gray-700/50" variants={itemVariants}>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search levels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="order">Sort by Order</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="xp">Sort by XP</option>
                <option value="duration">Sort by Duration</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* Levels Grid */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredLevels.map((level) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = isLevelCompleted(level.id);
            const LevelIcon = level.icon;

            return (
              <motion.div 
                key={level.id}
                className={`glass card-cyber p-6 group transition-all duration-300 border relative overflow-hidden ${
                  completed 
                    ? "border-emerald-500/50 bg-emerald-500/5" 
                    : unlocked 
                    ? "border-cyan-500/30 hover:border-cyan-500/50" 
                    : "border-gray-600/50 opacity-60"
                }`}
                variants={levelCardVariants}
                whileHover={unlocked ? "hover" : ""}
                onClick={() => unlocked && setSelectedLevel(level)}
              >
                {/* Level Number */}
                <div className="absolute top-4 right-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    completed 
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                      : unlocked 
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                      : "bg-gray-600/50 text-gray-400 border border-gray-600/50"
                  }`}>
                    {level.id}
                  </div>
                </div>

                {/* Level Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl ${level.gradient} flex items-center justify-center ${
                    !unlocked && "grayscale opacity-50"
                  }`}>
                    <LevelIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">{level.name}</h3>
                      {completed && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-cyan-400 text-sm font-mono">{level.concept}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                  {level.description}
                </p>

                {/* Mission Preview */}
                <div className="mb-4">
                  <p className="text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-yellow-400" />
                    Mission:
                  </p>
                  <p className="text-gray-400 text-sm italic line-clamp-2">{level.mission}</p>
                </div>

                {/* Level Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{level.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>{level.xp} XP</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="truncate">{level.badge}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(level.difficulty)} border`}>
                      {level.difficulty}
                    </span>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {level.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                  {level.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                      +{level.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Button */}
                {unlocked ? (
                  <Link 
                    to={`/level${level.id}`}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      completed
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                    }`}
                  >
                    {completed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Play Again
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Start Challenge
                      </>
                    )}
                  </Link>
                ) : (
                  <div className="w-full py-3 rounded-lg font-semibold bg-gray-600/30 text-gray-500 flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Complete Level {level.prerequisites[level.prerequisites.length - 1]} to Unlock</span>
                  </div>
                )}

                {/* XP Badge */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs border border-yellow-500/30">
                    <Trophy className="w-3 h-3" />
                    <span>{level.xp} XP</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.section>

        {/* Badges Showcase */}
        <motion.section 
          className="glass card-cyber p-8 border border-gray-700/50"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-3">
              Earn Badges & Level Up
            </h2>
            <p className="text-gray-400">
              Complete levels to unlock achievements and showcase your cybersecurity expertise
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {gameLevels.slice(0, 5).map((level) => {
              const completed = isLevelCompleted(level.id);
              return (
                <motion.div 
                  key={level.id} 
                  className="text-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`w-16 h-16 rounded-full ${level.gradient} flex items-center justify-center mx-auto mb-3 relative ${
                    !completed && "grayscale opacity-50"
                  }`}>
                    <level.icon className="w-6 h-6 text-white" />
                    {completed && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 fill-current" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">{level.badge}</p>
                  <p className="text-cyan-400 text-xs">{level.xp} XP</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {completed ? "Earned" : "Locked"}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Empty State */}
        {filteredLevels.length === 0 && (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No levels found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterDifficulty("all");
              }}
              className="btn-cyber"
            >
              Show All Levels
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Level Detail Modal */}
      {selectedLevel && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedLevel(null)}
        >
          <motion.div
            className="glass card-cyber p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedLevel.name}</h3>
              <button
                onClick={() => setSelectedLevel(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Mission Objective</h4>
                <p className="text-gray-300">{selectedLevel.mission}</p>
              </div>
              
              <div>
                <h4 className="text-cyan-400 font-semibold mb-2">Story</h4>
                <p className="text-gray-300 italic">{selectedLevel.story}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Tools & Skills</h4>
                  <div className="space-y-1">
                    {selectedLevel.tools.map((tool, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {tool}</div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">Enemies</h4>
                  <div className="space-y-1">
                    {selectedLevel.enemies.map((enemy, index) => (
                      <div key={index} className="text-gray-300 text-sm">• {enemy}</div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Link 
                  to={`/level${selectedLevel.id}`}
                  className="btn-cyber flex-1 text-center"
                  onClick={() => setSelectedLevel(null)}
                >
                  Start Challenge
                </Link>
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}