// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { 
  Code2, Shield, Users, Clock, ArrowRight, Play, Sparkles, 
  Trophy, Zap, BookOpen, Target, Star, Globe, Award, Terminal,
  Cpu, Network, Lock, Brain, Rocket, Eye, Key
} from "lucide-react";

export default function Home() {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const { user, isAuthenticated, userRank, userXP } = useAuth();
  const { state: gameState, actions } = useGame(); // FIXED: actions dan getGameStats ni olish
  
  const textVariants = [
    "Welcome to Hacking-Zone — Play. Hack. Learn.",
    "Master Cybersecurity — Challenges. Skills. Growth.",
    "Join the Revolution — Code. Secure. Innovate.",
    "Become a Cyber Defender — Practice. Progress. Protect."
  ];

  // FIXED: getGameStats ni actions dan olish
  const gameStats = actions?.getGameStats ? actions.getGameStats() : {
    totalLevels: 10,
    completedCount: 0,
    completionPercentage: 0,
    currentRank: 'Beginner',
    totalXP: 0,
    badgesCount: 0,
    loginStreak: 0
  };

  // Typewriter effect
  useEffect(() => {
    const textChangeInterval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % textVariants.length);
      setDisplayText('');
      setCurrentIndex(0);
    }, 6000);

    return () => clearInterval(textChangeInterval);
  }, []);

  useEffect(() => {
    if (currentIndex < textVariants[currentTextIndex].length) {
      const timer = setTimeout(() => {
        setDisplayText(textVariants[currentTextIndex].slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentTextIndex]);

  const features = [
    {
      icon: Trophy,
      title: "CTF Challenges",
      description: "Capture The Flag musobaqalarda qatnashing va hakeringizni sinang. Real-world cybersecurity scenarios bilan ishlang.",
      color: "yellow",
      count: "25+",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Qo'llanmalar va amaliy mashqlar orqali cybersecurity ni o'rganing. Har bir dars real hayotdagi vaziyatlarga asoslangan.",
      color: "blue",
      count: "50+",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: "Real-World Scenarios",
      description: "Haqiqiy dunyo senariylari bilan ishlash tajribasiga ega bo'ling. Kompaniyalarda qo'llaniladigan metodlarni o'rganing.",
      color: "red",
      count: "15+",
      gradient: "from-red-500 to-pink-500"
    },
    {
      icon: Globe,
      title: "Global Leaderboard",
      description: "Dunyo bo'yicha hakeringizni boshqalar bilan solishtiring. Reytingda yuqori o'rinlarni egallash uchun kurashing.",
      color: "green",
      count: "10k+",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const learningPaths = [
    {
      level: "Beginner",
      title: "Web Security Fundamentals",
      description: "SQL Injection, XSS, CSRF kabi web zaifliklarni o'rganing",
      progress: isAuthenticated ? Math.min((gameStats.completedCount / 3) * 100, 100) : 0,
      icon: Shield,
      color: "from-green-500 to-cyan-500",
      lessons: 12,
      duration: "4 hours",
      xp: 200
    },
    {
      level: "Intermediate", 
      title: "Network Penetration Testing",
      description: "Tarmoq skanerlash, enumeration va exploitation metodlari",
      progress: isAuthenticated ? Math.min(((gameStats.completedCount - 3) / 3) * 100, 100) : 0,
      icon: Zap,
      color: "from-blue-500 to-purple-500",
      lessons: 18,
      duration: "6 hours",
      xp: 350
    },
    {
      level: "Advanced",
      title: "Reverse Engineering",
      description: "Zararli dasturlarni tahlil qilish va tushunish",
      progress: isAuthenticated ? Math.min(((gameStats.completedCount - 6) / 4) * 100, 100) : 0,
      icon: Terminal,
      color: "from-purple-500 to-pink-500",
      lessons: 24,
      duration: "8 hours",
      xp: 500
    }
  ];

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Hackers",
      color: "text-cyan-400"
    },
    {
      icon: Trophy,
      value: "50+",
      label: "Challenges",
      color: "text-yellow-400"
    },
    {
      icon: Award,
      value: "1M+",
      label: "XP Earned",
      color: "text-emerald-400"
    },
    {
      icon: Clock,
      value: "24/7",
      label: "Learning",
      color: "text-purple-400"
    }
  ];

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const userStatsVariants = {
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

  return (
    <div className="relative min-h-screen px-4 py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-bounce" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

        {/* Floating Icons */}
        <motion.div
          className="absolute top-20 left-10 opacity-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <Cpu className="w-16 h-16 text-cyan-400" />
        </motion.div>
        <motion.div
          className="absolute bottom-40 right-20 opacity-10"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        >
          <Lock className="w-12 h-12 text-emerald-400" />
        </motion.div>
        <motion.div
          className="absolute top-40 left-1/3 opacity-10"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        >
          <Key className="w-14 h-14 text-purple-400" />
        </motion.div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section className="text-center mb-20" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gradient mb-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Hacking-Zone
            </motion.h1>
            <Sparkles className="w-8 h-8 text-emerald-400" />
          </div>
          
          {/* Typewriter Terminal */}
          <motion.div 
            className="glass card-cyber p-6 mb-8 max-w-2xl mx-auto border border-cyan-500/30 relative overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Terminal className="w-5 h-5" />
                <span className="text-sm font-mono">terminal@hacking-zone:~$</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>
            
            {/* Typewriter Text */}
            <div className="font-mono text-lg text-gray-200 min-h-[2rem] border-l-2 border-cyan-400 pl-4 flex items-center">
              <span>{displayText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="ml-1 text-cyan-400"
              >
                █
              </motion.span>
            </div>
            
            {/* Text Indicator Dots */}
            <div className="flex justify-center gap-1 mt-4">
              {textVariants.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentTextIndex === index 
                      ? 'bg-cyan-400 scale-125' 
                      : 'bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            className="glass card-cyber p-8 mb-12 max-w-2xl mx-auto"
            variants={itemVariants}
            whileHover={{ 
              y: -5,
              borderColor: "rgba(6, 182, 212, 0.3)",
              transition: { duration: 0.3 }
            }}
          >
            <p className="text-lg text-gray-200 leading-relaxed mb-6">
              Join the next generation of cyber defenders through{" "}
              <span className="text-cyan-400 font-semibold">interactive learning</span>,{" "}
              <span className="text-emerald-400 font-semibold">coding puzzles</span>, and{" "}
              <span className="text-purple-400 font-semibold">real-world challenges</span>. 
              Master cybersecurity skills in a safe, legal environment designed for all skill levels.
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Ethical Hacking • CTF Challenges • Real-World Scenarios • Career Preparation</span>
            </div>
          </motion.div>

          {/* User Stats (if authenticated) */}
          {isAuthenticated && (
            <motion.div
              variants={userStatsVariants}
              className="glass card-cyber p-6 mb-8 max-w-2xl mx-auto border border-emerald-500/30"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{userRank}</div>
                  <div className="text-gray-400 text-sm">Current Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{userXP}</div>
                  <div className="text-gray-400 text-sm">Total XP</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">{gameStats.completedCount}/10</div>
                  <div className="text-gray-400 text-sm">Levels Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{gameStats.completionPercentage}%</div>
                  <div className="text-gray-400 text-sm">Progress</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            variants={itemVariants}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to={isAuthenticated ? "/learning" : "/signup"}
                className="btn-cyber text-lg px-8 py-4 flex items-center gap-3 group"
              >
                <Code2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{isAuthenticated ? "Continue Learning" : "Start Learning"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/levels"
                className="glass border border-gray-600 text-lg px-8 py-4 rounded-lg text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-3 group hover:border-cyan-400/50"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Play Challenges</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Stats Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="glass card-cyber p-6 text-center group hover:scale-105 transition-all duration-300 border border-gray-700/50"
                variants={itemVariants}
                whileHover={{ 
                  y: -5,
                  borderColor: "rgba(6, 182, 212, 0.3)",
                }}
              >
                <div className={`w-12 h-12 ${stat.color} bg-opacity-20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Grid Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Why Choose Hacking-Zone?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to master cybersecurity in one platform. 
              From beginner to expert, we've got you covered.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="glass card-cyber p-6 group hover:scale-105 transition-all duration-300 border border-gray-700/50 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className={`w-14 h-14 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-${feature.color}-500/30 transition-colors relative z-10`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed relative z-10">{feature.description}</p>
                <div className="flex items-center justify-between relative z-10">
                  <span className={`text-${feature.color}-400 font-bold text-lg`}>{feature.count}</span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Learning Paths Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Start Your Cybersecurity Journey
            </h2>
            <p className="text-gray-400 text-lg">
              Choose your learning path and become a cybersecurity expert step by step
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {learningPaths.map((path, index) => (
              <motion.div 
                key={index}
                className="glass card-cyber p-6 group hover:scale-105 transition-all duration-300 border border-gray-700/50 relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 font-mono">
                      {path.level}
                    </span>
                    <path.icon className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">{path.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">{path.description}</p>
                  
                  {/* Progress Bar */}
                  {isAuthenticated && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.round(path.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div 
                          className={`h-2 rounded-full bg-gradient-to-r ${path.color}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${path.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-4">
                    <div className="text-center">
                      <div className="font-semibold">{path.lessons}</div>
                      <div>Lessons</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{path.duration}</div>
                      <div>Duration</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-400">{path.xp} XP</div>
                      <div>Reward</div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {path.progress > 0 ? `${Math.round(path.progress)}% Complete` : "Not Started"}
                    </span>
                    <Link 
                      to="/learning" 
                      className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
                    >
                      {path.progress > 0 ? "Continue" : "Start"} 
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Final CTA Section */}
        <motion.section 
          className="text-center"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div 
            className="glass card-cyber p-12 border border-cyan-500/30 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-emerald-500/5"></div>
            
            <Rocket className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Mission?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of hackers worldwide who are mastering cybersecurity skills 
              and building their careers in digital defense.
            </p>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to={isAuthenticated ? "/levels" : "/signup"}
                className="btn-cyber text-lg px-8 py-4 inline-flex items-center gap-3"
              >
                <Zap className="w-5 h-5" />
                <span>{isAuthenticated ? "Launch Next Mission" : "Begin Your Journey"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
}