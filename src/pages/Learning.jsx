// src/pages/Learning.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { Menu, Transition } from "@headlessui/react";
import { 
  BookOpen, Code2, FileText, CheckCircle, 
  Lock, Play, Clock, Star, Users, ArrowRight,
  Trophy, Zap, Shield, Terminal, Brain, Search,
  Filter, X, Sparkles, Bookmark, Eye, ChevronDown,
  TrendingUp, TrendingDown, Calendar, Award,
  Video, BarChart3, Target, Crown
} from "lucide-react";

export default function Learning() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("difficulty");
  const [progress, setProgress] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions } = useGame();

  // Categories with icons and counts
  const categories = [
    { id: "all", name: "All Courses", icon: BookOpen, count: 12, color: "cyan" },
    { id: "web", name: "Web Security", icon: Code2, count: 5, color: "blue" },
    { id: "network", name: "Network Security", icon: Zap, count: 3, color: "yellow" },
    { id: "reverse", name: "Reverse Engineering", icon: Terminal, count: 2, color: "purple" },
    { id: "crypto", name: "Cryptography", icon: Shield, count: 2, color: "green" }
  ];

  // Sort options with icons
  const sortOptions = [
    { id: "difficulty", name: "Difficulty", icon: TrendingUp, direction: "asc" },
    { id: "rating", name: "Rating", icon: Star, direction: "desc" },
    { id: "students", name: "Popularity", icon: Users, direction: "desc" },
    { id: "duration", name: "Duration", icon: Clock, direction: "asc" },
    { id: "title", name: "Title", icon: BookOpen, direction: "asc" }
  ];

  // Complete courses data with page routes - FULL VERSION
  const courses = [
    {
      id: 1,
      title: "Web Security Fundamentals",
      description: "Learn SQL Injection, XSS, CSRF and other web vulnerabilities through hands-on labs and real-world scenarios.",
      category: "web",
      level: "Beginner",
      duration: "4 hours",
      students: 1250,
      rating: 4.8,
      lessons: 15,
      completed: gameState.completedLevels.includes(1),
      image: "🌐",
      color: "from-blue-500 to-cyan-500",
      difficulty: 1,
      xp: 200,
      badges: ["Web Defender"],
      instructor: "Alex Chen",
      lastUpdated: "2024-01-15",
      features: ["Hands-on Labs", "Real Scenarios", "Certificate"],
      page: "web-security"
    },
    {
      id: 2,
      title: "Network Penetration Testing",
      description: "Master network scanning, enumeration, exploitation techniques and learn to secure network infrastructure.",
      category: "network",
      level: "Intermediate",
      duration: "6 hours",
      students: 890,
      rating: 4.7,
      lessons: 20,
      completed: gameState.completedLevels.includes(2),
      image: "🛜",
      color: "from-purple-500 to-pink-500",
      difficulty: 2,
      xp: 350,
      badges: ["Network Scout"],
      instructor: "Sarah Johnson",
      lastUpdated: "2024-02-01",
      features: ["Live Exercises", "Tools Training", "CTF Challenges"],
      page: "network-pentesting"
    },
    {
      id: 3,
      title: "Reverse Engineering Basics",
      description: "Learn to analyze and understand malicious software, binary analysis, and debugging techniques.",
      category: "reverse",
      level: "Advanced",
      duration: "8 hours",
      students: 450,
      rating: 4.9,
      lessons: 25,
      completed: gameState.completedLevels.includes(3),
      image: "🔍",
      color: "from-orange-500 to-red-500",
      difficulty: 3,
      xp: 500,
      badges: ["Code Breaker"],
      instructor: "Mike Rodriguez",
      lastUpdated: "2024-01-20",
      features: ["Malware Analysis", "Debugging", "Binary Exploitation"],
      page: "reverse-engineering"
    },
    {
      id: 4,
      title: "Cryptography & Encryption",
      description: "Understand encryption algorithms, cryptanalysis, and implement secure communication protocols.",
      category: "crypto",
      level: "Intermediate",
      duration: "5 hours",
      students: 670,
      rating: 4.6,
      lessons: 18,
      completed: gameState.completedLevels.includes(4),
      image: "🔐",
      color: "from-green-500 to-emerald-500",
      difficulty: 2,
      xp: 300,
      badges: ["Crypto Expert"],
      instructor: "Dr. Emily White",
      lastUpdated: "2024-02-10",
      features: ["Algorithm Study", "Code Implementation", "Security Protocols"],
      page: "cryptography"
    },
    {
      id: 5,
      title: "CTF Challenge Walkthroughs",
      description: "Step-by-step solutions for popular Capture The Flag challenges with detailed explanations.",
      category: "web",
      level: "All Levels",
      duration: "3 hours",
      students: 2100,
      rating: 4.9,
      lessons: 12,
      completed: gameState.completedLevels.includes(5),
      image: "🏆",
      color: "from-yellow-500 to-orange-500",
      difficulty: 2,
      xp: 400,
      badges: ["CTF Champion"],
      instructor: "CTF Team",
      lastUpdated: "2024-02-15",
      features: ["Step-by-Step", "Multiple CTFs", "Strategy Guides"],
      page: "ctf-walkthroughs"
    },
    {
      id: 6,
      title: "Linux for Ethical Hackers",
      description: "Essential Linux commands, tools, and scripting for cybersecurity professionals.",
      category: "network",
      level: "Beginner",
      duration: "2 hours",
      students: 1800,
      rating: 4.5,
      lessons: 10,
      completed: gameState.completedLevels.includes(6),
      image: "🐧",
      color: "from-gray-500 to-blue-500",
      difficulty: 1,
      xp: 150,
      badges: ["Linux Master"],
      instructor: "David Kim",
      lastUpdated: "2024-01-25",
      features: ["Command Line", "Scripting", "Tool Setup"],
      page: "linux-ethical-hacking"
    },
    {
      id: 7,
      title: "Social Engineering Defense",
      description: "Learn to recognize and defend against social engineering attacks and phishing attempts.",
      category: "web",
      level: "Beginner",
      duration: "2.5 hours",
      students: 950,
      rating: 4.4,
      lessons: 8,
      completed: gameState.completedLevels.includes(7),
      image: "🎣",
      color: "from-pink-500 to-rose-500",
      difficulty: 1,
      xp: 180,
      badges: ["Social Defender"],
      instructor: "Lisa Wang",
      lastUpdated: "2024-02-20",
      features: ["Case Studies", "Detection Methods", "Prevention"],
      page: "social-engineering"
    },
    {
      id: 8,
      title: "Wireless Network Security",
      description: "Understand wireless vulnerabilities, WPA2 cracking, and secure wireless deployment.",
      category: "network",
      level: "Intermediate",
      duration: "4.5 hours",
      students: 720,
      rating: 4.7,
      lessons: 14,
      completed: gameState.completedLevels.includes(8),
      image: "📡",
      color: "from-indigo-500 to-purple-500",
      difficulty: 2,
      xp: 320,
      badges: ["Wireless Expert"],
      instructor: "James Wilson",
      lastUpdated: "2024-02-05",
      features: ["Hands-on Testing", "Security Config", "Tools Usage"],
      page: "wireless-security"
    },
    {
      id: 9,
      title: "Digital Forensics Fundamentals",
      description: "Learn evidence collection, analysis techniques, and digital investigation methodologies.",
      category: "reverse",
      level: "Intermediate",
      duration: "5.5 hours",
      students: 580,
      rating: 4.8,
      lessons: 16,
      completed: gameState.completedLevels.includes(9),
      image: "🔎",
      color: "from-teal-500 to-cyan-500",
      difficulty: 2,
      xp: 380,
      badges: ["Cyber Detective"],
      instructor: "Forensics Team",
      lastUpdated: "2024-02-12",
      features: ["Evidence Handling", "Analysis Tools", "Case Work"],
      page: "digital-forensics"
    },
    {
      id: 10,
      title: "Advanced Persistent Threats",
      description: "Study sophisticated cyber attacks, APT groups, and advanced defense strategies.",
      category: "web",
      level: "Advanced",
      duration: "7 hours",
      students: 320,
      rating: 4.9,
      lessons: 22,
      completed: gameState.completedLevels.includes(10),
      image: "🎯",
      color: "from-red-500 to-orange-500",
      difficulty: 3,
      xp: 600,
      badges: ["APT Specialist"],
      instructor: "Security Analysts",
      lastUpdated: "2024-01-30",
      features: ["Case Analysis", "Defense Strategies", "Threat Intelligence"],
      page: "apt-threats"
    },
    {
      id: 11,
      title: "Secure Coding Practices",
      description: "Learn to write secure code and prevent common vulnerabilities in software development.",
      category: "web",
      level: "Intermediate",
      duration: "4 hours",
      students: 1100,
      rating: 4.6,
      lessons: 13,
      completed: false,
      image: "💻",
      color: "from-emerald-500 to-green-500",
      difficulty: 2,
      xp: 280,
      badges: ["Secure Coder"],
      instructor: "Code Security Team",
      lastUpdated: "2024-02-18",
      features: ["Code Review", "Best Practices", "Vulnerability Prevention"],
      page: "secure-coding"
    },
    {
      id: 12,
      title: "Incident Response Training",
      description: "Master incident response procedures, containment strategies, and recovery techniques.",
      category: "network",
      level: "Advanced",
      duration: "6.5 hours",
      students: 420,
      rating: 4.8,
      lessons: 19,
      completed: false,
      image: "🚨",
      color: "from-amber-500 to-yellow-500",
      difficulty: 3,
      xp: 450,
      badges: ["Incident Commander"],
      instructor: "CERT Team",
      lastUpdated: "2024-02-08",
      features: ["Response Plans", "Team Coordination", "Recovery Procedures"],
      page: "incident-response"
    }
  ];

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    if (activeCategory !== "all" && course.category !== activeCategory) {
      return false;
    }
    
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    switch(sortBy) {
      case "difficulty": return a.difficulty - b.difficulty;
      case "rating": return b.rating - a.rating;
      case "students": return b.students - a.students;
      case "duration": return a.duration.localeCompare(b.duration);
      case "title": return a.title.localeCompare(b.title);
      default: return a.difficulty - b.difficulty;
    }
  });

  // Get current sort option
  const currentSort = sortOptions.find(option => option.id === sortBy) || sortOptions[0];

  // Simplified progress calculation
  useEffect(() => {
    const userProgress = {};
    courses.forEach(course => {
      userProgress[course.id] = {
        completed: course.completed,
        status: course.completed ? "completed" : "not-started",
        currentLesson: course.completed ? course.lessons : 0
      };
    });
    setProgress(userProgress);
  }, [gameState.completedLevels]);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 1: return "text-green-400 bg-green-500/20";
      case 2: return "text-yellow-400 bg-yellow-500/20";
      case 3: return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getLevelText = (difficulty) => {
    switch(difficulty) {
      case 1: return "Beginner";
      case 2: return "Intermediate";
      case 3: return "Advanced";
      default: return "All Levels";
    }
  };

  const getProgressText = (courseId) => {
    if (!progress[courseId]) return "Not Started";
    return progress[courseId].completed ? "Completed" : "Ready to Start";
  };

  const getProgressColor = (courseId) => {
    if (!progress[courseId]) return "text-gray-400 bg-gray-500/20";
    return progress[courseId].completed ? "text-green-400 bg-green-500/20" : "text-cyan-400 bg-cyan-500/20";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.8,
        ease: "easeOut"
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
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 pt-24">
      {/* Enhanced Background with Blur */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.section className="text-center mb-12" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Learning Center
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Master cybersecurity with interactive courses, real-world challenges, and expert guidance. 
            Start your journey to becoming a cyber security expert.
          </p>
        </motion.section>

        {/* Stats Overview */}
        <motion.section 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
        >
          <motion.div className="glass card-cyber p-4 text-center border border-gray-700/50 rounded-xl" variants={itemVariants}>
            <div className="text-2xl font-bold text-cyan-400 mb-1">{courses.length}</div>
            <div className="text-gray-400 text-sm">Courses</div>
          </motion.div>
          <motion.div className="glass card-cyber p-4 text-center border border-gray-700/50 rounded-xl" variants={itemVariants}>
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {courses.reduce((total, course) => total + course.lessons, 0)}+
            </div>
            <div className="text-gray-400 text-sm">Lessons</div>
          </motion.div>
          <motion.div className="glass card-cyber p-4 text-center border border-gray-700/50 rounded-xl" variants={itemVariants}>
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {courses.reduce((total, course) => total + course.students, 0)}+
            </div>
            <div className="text-gray-400 text-sm">Students</div>
          </motion.div>
          <motion.div className="glass card-cyber p-4 text-center border border-gray-700/50 rounded-xl" variants={itemVariants}>
            <div className="text-2xl font-bold text-yellow-400 mb-1">4.7</div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </motion.div>
        </motion.section>

        {/* Enhanced Search Section */}
        <motion.section className="mb-8" variants={itemVariants}>
          <div className="glass card-cyber p-8 border border-gray-700/50 rounded-2xl backdrop-blur-xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Find Your Perfect Course
              </h2>
              <p className="text-gray-400">
                Search through our extensive library of cybersecurity courses
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className={`relative transition-all duration-300 ${
                isSearchFocused ? 'scale-105' : 'scale-100'
              }`}>
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
                <input
                  type="text"
                  placeholder="Search courses by title, description, or technology..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-800/70 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-xl text-lg"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {/* Search Suggestions */}
              <AnimatePresence>
                {isSearchFocused && searchQuery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 z-50"
                  >
                    <div className="text-sm text-gray-400 mb-2">Quick suggestions:</div>
                    <div className="flex flex-wrap gap-2">
                      {['web security', 'network', 'cryptography', 'linux', 'ctf'].map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setSearchQuery(suggestion)}
                          className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm hover:bg-cyan-500/30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = activeCategory === category.id;
                
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 border backdrop-blur-sm ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                        : "glass text-gray-300 hover:text-cyan-400 hover:bg-white/5 border-gray-700/50 hover:border-cyan-500/30"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{category.name}</span>
                    <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs font-semibold">
                      {category.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Results Header */}
        <motion.section className="flex items-center justify-between mb-6" variants={itemVariants}>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Courses'}
            </h2>
            <motion.span 
              key={filteredCourses.length}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold"
            >
              {filteredCourses.length} courses
            </motion.span>
          </div>
          
          {/* Enhanced Sort Dropdown */}
          <div className="flex items-center gap-3">
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white hover:bg-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Sort by: {currentSort.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Menu.Button>

                  <Transition
                    as={motion.div}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-xl shadow-black/20 z-50 focus:outline-none overflow-hidden">
                      <div className="p-2">
                        {sortOptions.map((option) => {
                          const Icon = option.icon;
                          const isActive = sortBy === option.id;
                          
                          return (
                            <Menu.Item key={option.id}>
                              {({ active }) => (
                                <button
                                  onClick={() => setSortBy(option.id)}
                                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                                    isActive
                                      ? 'bg-cyan-500/20 text-cyan-300'
                                      : active
                                      ? 'bg-gray-700/50 text-white'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                  <span className="flex-1 text-left">{option.name}</span>
                                  {isActive && (
                                    <motion.div 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-2 h-2 bg-cyan-400 rounded-full"
                                    />
                                  )}
                                </button>
                              )}
                            </Menu.Item>
                          );
                        })}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </motion.section>

        {/* Courses Grid */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
              <motion.div 
                key={course.id}
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ 
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="group relative"
              >
                <div className="glass card-cyber p-6 rounded-2xl border border-gray-700/50 relative overflow-hidden backdrop-blur-sm transition-all duration-300 group-hover:border-cyan-500/30 group-hover:shadow-xl group-hover:shadow-cyan-500/10">
                  
                  {/* Course Image & Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                      {course.image}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2 leading-tight group-hover:text-cyan-300 transition-colors duration-300">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {getLevelText(course.difficulty)}
                        </span>
                        {progress[course.id] && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgressColor(course.id)}`}>
                            {getProgressText(course.id)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <motion.div 
                      className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: 20 }}
                      whileHover={{ x: 0 }}
                    >
                      <button className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors duration-200">
                        <Bookmark className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors duration-200">
                        <Eye className="w-4 h-4" />
                      </button>
                    </motion.div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <FileText className="w-4 h-4" />
                      <span>{course.lessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {progress[course.id] && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Progress</span>
                        <span className={progress[course.id].completed ? "text-green-400" : "text-cyan-400"}>
                          {getProgressText(course.id)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className={`h-2 rounded-full ${
                            progress[course.id].completed 
                              ? "bg-gradient-to-r from-green-500 to-emerald-500" 
                              : "bg-gradient-to-r from-cyan-500 to-blue-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: progress[course.id].completed ? "100%" : "0%" }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Link 
                    to={isAuthenticated ? `/learning/${course.page}` : "#"}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      course.completed
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-500/20"
                        : "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 hover:from-cyan-500/30 hover:to-blue-500/30 hover:shadow-lg hover:shadow-cyan-500/20"
                    } ${!isAuthenticated ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
                    onClick={(e) => !isAuthenticated && e.preventDefault()}
                  >
                    {!isAuthenticated ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Login to Start</span>
                      </>
                    ) : course.completed ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>View Course</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Start Learning</span>
                      </>
                    )}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* XP Reward */}
                  <motion.div 
                    className="absolute top-4 left-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs border border-yellow-500/30 backdrop-blur-sm">
                      <Trophy className="w-3 h-3" />
                      <span className="font-semibold">{course.xp} XP</span>
                    </div>
                  </motion.div>

                  {/* Completed Badge */}
                  {course.completed && (
                    <motion.div 
                      className="absolute top-4 right-4 z-10"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    >
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-full shadow-lg">
                        <CheckCircle className="w-5 h-5 text-white fill-current" />
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="glass card-cyber p-8 rounded-2xl border border-gray-700/50 max-w-md mx-auto backdrop-blur-sm">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your search criteria'}
              </p>
              <motion.button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Courses
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Learning Path Section */}
        <motion.section 
          className="glass card-cyber p-8 border border-gray-700/50 mb-12 rounded-2xl backdrop-blur-sm"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              Recommended Learning Path
            </h2>
            <p className="text-gray-400">
              Follow this structured path to become a cybersecurity expert step by step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner Path */}
            <motion.div 
              className="text-center p-6 rounded-xl border-2 border-green-500/20 bg-green-500/5 relative overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Beginner</h3>
              <p className="text-gray-400 text-sm mb-4">
                Web Security Fundamentals, Linux Basics, Social Engineering Defense
              </p>
              <div className="text-green-400 font-semibold">2-3 weeks</div>
              <div className="mt-3 text-yellow-400 text-sm">200-500 XP per course</div>
            </motion.div>

            {/* Intermediate Path */}
            <motion.div 
              className="text-center p-6 rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Intermediate</h3>
              <p className="text-gray-400 text-sm mb-4">
                Network Pentesting, Cryptography, Wireless Security, Digital Forensics
              </p>
              <div className="text-yellow-400 font-semibold">4-6 weeks</div>
              <div className="mt-3 text-yellow-400 text-sm">300-600 XP per course</div>
            </motion.div>

            {/* Advanced Path */}
            <motion.div 
              className="text-center p-6 rounded-xl border-2 border-red-500/20 bg-red-500/5 relative overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Advanced</h3>
              <p className="text-gray-400 text-sm mb-4">
                Reverse Engineering, APT Analysis, Incident Response, Secure Coding
              </p>
              <div className="text-red-400 font-semibold">8-12 weeks</div>
              <div className="mt-3 text-yellow-400 text-sm">400-800 XP per course</div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}