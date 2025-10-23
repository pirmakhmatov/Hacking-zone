// src/pages/Learning.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { 
  BookOpen, Code2, Video, FileText, CheckCircle, 
  Lock, Play, Clock, Star, Users, ArrowRight,
  Trophy, Zap, Shield, Terminal, Brain, Search,
  Filter, BarChart3, Target, Award, Crown, Sparkles
} from "lucide-react";
import WebSecurity from "./Learning/courses/WebSecurity";
export default function Learning() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("difficulty");
  const [progress, setProgress] = useState({});
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

  // Complete courses data
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample1",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample2",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample3",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample4",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample5",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample6",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample7",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample8",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample9",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample10",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample11",
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
      youtubeUrl: "https://youtube.com/playlist?list=PL_sample12",
      page: "incident-response"
    }
  ];

  // Calculate user progress
  useEffect(() => {
    const userProgress = {};
    courses.forEach(course => {
      userProgress[course.id] = {
        completed: course.completed,
        progress: course.completed ? 100 : Math.floor(Math.random() * 30),
        currentLesson: course.completed ? course.lessons : Math.floor(Math.random() * course.lessons) + 1
      };
    });
    setProgress(userProgress);
  }, [gameState.completedLevels]);

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesCategory = activeCategory === "all" || course.category === activeCategory;
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch(sortBy) {
        case "difficulty":
          return a.difficulty - b.difficulty;
        case "rating":
          return b.rating - a.rating;
        case "students":
          return b.students - a.students;
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return a.difficulty - b.difficulty;
      }
    });

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

  const handleStartCourse = (courseId) => {
    if (!isAuthenticated) {
      // Redirect to login or show modal
      return;
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
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.section className="text-center mb-12" variants={itemVariants}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
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
          variants={statsVariants}
        >
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-cyan-400 mb-1">{courses.length}</div>
            <div className="text-gray-400 text-sm">Courses</div>
          </div>
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {courses.reduce((total, course) => total + course.lessons, 0)}+
            </div>
            <div className="text-gray-400 text-sm">Lessons</div>
          </div>
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {courses.reduce((total, course) => total + course.students, 0)}+
            </div>
            <div className="text-gray-400 text-sm">Students</div>
          </div>
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-yellow-400 mb-1">4.7</div>
            <div className="text-gray-400 text-sm">Avg Rating</div>
          </div>
        </motion.section>

        {/* Controls Section */}
        <motion.section className="glass card-cyber p-6 mb-8 border border-gray-700/50" variants={itemVariants}>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeCategory === category.id
                        ? `bg-${category.color}-500/20 text-${category.color}-300 border border-${category.color}-500/30`
                        : "glass text-gray-300 hover:text-cyan-400 hover:bg-white/5 border border-gray-700/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                      {category.count}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors w-full"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none w-full"
                >
                  <option value="difficulty">Sort by Difficulty</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="students">Sort by Popularity</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Courses Grid */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {filteredCourses.map((course) => (
            <motion.div 
              key={course.id}
              className="glass card-cyber p-6 group hover:scale-105 transition-all duration-300 border border-gray-700/50 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ 
                y: -5,
                borderColor: "rgba(6, 182, 212, 0.3)",
              }}
            >
              {/* Completed Badge */}
              {course.completed && (
                <motion.div 
                  className="absolute top-4 right-4 z-10"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-400 fill-current" />
                </motion.div>
              )}

              {/* Course Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl`}>
                  {course.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">{course.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(course.difficulty)}`}>
                      {getLevelText(course.difficulty)}
                    </span>
                    {course.completed && (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                {course.description}
              </p>

              {/* Instructor */}
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                <Users className="w-3 h-3" />
                <span>By {course.instructor}</span>
              </div>

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
                    <span>{progress[course.id].progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className={`h-2 rounded-full bg-gradient-to-r ${course.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress[course.id].progress}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {course.features.slice(0, 2).map((feature, index) => (
                  <span key={index} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">
                    {feature}
                  </span>
                ))}
                {course.features.length > 2 && (
                  <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded text-xs">
                    +{course.features.length - 2} more
                  </span>
                )}
              </div>

              {/* Action Button */}
              <Link 
                to={`/learning/${course.page}`}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  course.completed
                    ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
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
                ) : progress[course.id]?.progress > 0 ? (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Continue</span>
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
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs border border-yellow-500/30">
                  <Trophy className="w-3 h-3" />
                  <span>{course.xp} XP</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Learning Path Section */}
        <motion.section 
          className="glass card-cyber p-8 border border-gray-700/50 mb-12"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-3">
              Recommended Learning Path
            </h2>
            <p className="text-gray-400">
              Follow this structured path to become a cybersecurity expert step by step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Beginner Path */}
            <motion.div 
              className="text-center p-6 rounded-xl border-2 border-green-500/20 bg-green-500/5 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
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
              className="text-center p-6 rounded-xl border-2 border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
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
              className="text-center p-6 rounded-xl border-2 border-red-500/20 bg-red-500/5 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
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

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div 
            className="text-center py-12"
            variants={itemVariants}
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search criteria or browse all categories
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="btn-cyber"
            >
              View All Courses
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}