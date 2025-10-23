// src/pages/Leaderboard.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { 
  Trophy, Crown, Star, Medal, Users, Zap, 
  Shield, Clock, Filter, Search, Award,
  TrendingUp, Globe, User, Target, BarChart3,
  Calendar, TrendingDown, Sparkles, Eye,
  ArrowUp, ArrowDown, Minus, CheckCircle
} from "lucide-react";

// Simple bar chart component
const ProgressBar = ({ value, max, color = "cyan", label }) => (
  <div className="flex items-center gap-3">
    <span className="text-gray-400 text-sm w-20">{label}</span>
    <div className="flex-1 bg-gray-700/50 rounded-full h-3 overflow-hidden">
      <motion.div 
        className={`h-full rounded-full bg-gradient-to-r ${
          color === "cyan" ? "from-cyan-500 to-cyan-400" :
          color === "yellow" ? "from-yellow-500 to-yellow-400" :
          color === "green" ? "from-green-500 to-green-400" :
          "from-purple-500 to-purple-400"
        }`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
    <span className="text-gray-300 text-sm w-12 text-right">{value}</span>
  </div>
);

// Simple bar chart for XP distribution
const XPChart = ({ data }) => (
  <div className="glass card-cyber p-6 border border-gray-700/50">
    <div className="flex items-center gap-2 mb-4">
      <BarChart3 className="w-5 h-5 text-cyan-400" />
      <h3 className="text-lg font-semibold text-white">XP Distribution</h3>
    </div>
    <div className="space-y-4">
      {data.slice(0, 5).map((player, index) => (
        <div key={player.id} className="flex items-center gap-3">
          <div className="w-8 text-sm text-gray-400 flex items-center justify-center">
            {index === 0 ? <Crown className="w-4 h-4 text-yellow-400" /> :
             index === 1 ? <Medal className="w-4 h-4 text-gray-400" /> :
             index === 2 ? <Award className="w-4 h-4 text-orange-400" /> :
             `#${index + 1}`}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 truncate">{player.username}</span>
              <span className="text-cyan-400">{player.xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2">
              <motion.div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                initial={{ width: 0 }}
                animate={{ width: `${(player.xp / 3000) * 100}%` }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Progress chart component
const ProgressChart = ({ completed, total }) => {
  const percentage = Math.round((completed / total) * 100);
  
  return (
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="rgba(75, 85, 99, 0.3)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${(completed / total) * 251} 251`}
          transform="rotate(-90 50 50)"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white font-bold text-sm">
          {percentage}%
        </span>
      </div>
    </div>
  );
};

// Rank change indicator
const RankChange = ({ change }) => {
  if (change > 0) {
    return (
      <div className="flex items-center gap-1 text-green-400">
        <ArrowUp className="w-3 h-3" />
        <span className="text-xs font-semibold">+{change}</span>
      </div>
    );
  } else if (change < 0) {
    return (
      <div className="flex items-center gap-1 text-red-400">
        <ArrowDown className="w-3 h-3" />
        <span className="text-xs font-semibold">{Math.abs(change)}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 text-gray-400">
        <Minus className="w-3 h-3" />
        <span className="text-xs font-semibold">0</span>
      </div>
    );
  }
};

export default function Leaderboard() {
  const [activeFilter, setActiveFilter] = useState("global");
  const [sortBy, setSortBy] = useState("xp");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("all-time");
  const { user } = useAuth();

  // Sample leaderboard data with realistic information
  const leaderboardData = [
    {
      id: 1,
      username: "CyberMaster",
      xp: 2850,
      levelsCompleted: 10,
      badges: 8,
      averageTime: "12:30",
      rank: 1,
      previousRank: 1,
      avatar: "🦸",
      progress: 100,
      joinDate: "2024-01-15",
      rankName: "Cyber Sentinel",
      streak: 15,
      lastActive: "2 hours ago",
      country: "🇺🇸",
      achievements: ["Speed Runner", "Perfect Score", "Early Adopter"]
    },
    {
      id: 2,
      username: "CodeBreaker",
      xp: 2650,
      levelsCompleted: 9,
      badges: 7,
      averageTime: "15:45",
      rank: 2,
      previousRank: 3,
      avatar: "🔓",
      progress: 90,
      joinDate: "2024-02-01",
      rankName: "Cyber Sentinel",
      streak: 8,
      lastActive: "1 hour ago",
      country: "🇬🇧",
      achievements: ["Code Master", "Quick Learner"]
    },
    {
      id: 3,
      username: "FirewallKing",
      xp: 2400,
      levelsCompleted: 8,
      badges: 6,
      averageTime: "18:20",
      rank: 3,
      previousRank: 2,
      avatar: "🛡️",
      progress: 80,
      joinDate: "2024-01-20",
      rankName: "Specialist",
      streak: 12,
      lastActive: "5 hours ago",
      country: "🇩🇪",
      achievements: ["Security Expert", "Consistent Performer"]
    },
    {
      id: 4,
      username: "PhishBuster",
      xp: 2200,
      levelsCompleted: 7,
      badges: 5,
      averageTime: "20:15",
      rank: 4,
      previousRank: 5,
      avatar: "🎣",
      progress: 70,
      joinDate: "2024-02-10",
      rankName: "Specialist",
      streak: 6,
      lastActive: "1 day ago",
      country: "🇨🇦",
      achievements: ["Phishing Expert"]
    },
    {
      id: 5,
      username: "EncryptExpert",
      xp: 1950,
      levelsCompleted: 6,
      badges: 4,
      averageTime: "22:30",
      rank: 5,
      previousRank: 4,
      avatar: "🔐",
      progress: 60,
      joinDate: "2024-01-25",
      rankName: "Specialist",
      streak: 3,
      lastActive: "2 days ago",
      country: "🇫🇷",
      achievements: ["Crypto Wizard"]
    },
    {
      id: 6,
      username: "NetHunter",
      xp: 1700,
      levelsCompleted: 5,
      badges: 3,
      averageTime: "25:10",
      rank: 6,
      previousRank: 7,
      avatar: "🌐",
      progress: 50,
      joinDate: "2024-02-15",
      rankName: "Recruit",
      streak: 9,
      lastActive: "3 hours ago",
      country: "🇯🇵",
      achievements: ["Network Pro"]
    },
    {
      id: 7,
      username: "BugFinder",
      xp: 1450,
      levelsCompleted: 4,
      badges: 2,
      averageTime: "28:45",
      rank: 7,
      previousRank: 6,
      avatar: "🐛",
      progress: 40,
      joinDate: "2024-02-05",
      rankName: "Recruit",
      streak: 4,
      lastActive: "1 week ago",
      country: "🇦🇺",
      achievements: ["Bug Hunter"]
    },
    {
      id: 8,
      username: "SecurityPro",
      xp: 1200,
      levelsCompleted: 3,
      badges: 2,
      averageTime: "32:20",
      rank: 8,
      previousRank: 9,
      avatar: "👨‍💻",
      progress: 30,
      joinDate: "2024-02-20",
      rankName: "Recruit",
      streak: 2,
      lastActive: "2 days ago",
      country: "🇸🇬",
      achievements: []
    },
    {
      id: 9,
      username: "CryptoWizard",
      xp: 950,
      levelsCompleted: 2,
      badges: 1,
      averageTime: "35:50",
      rank: 9,
      previousRank: 8,
      avatar: "🧙",
      progress: 20,
      joinDate: "2024-02-12",
      rankName: "Recruit",
      streak: 1,
      lastActive: "5 days ago",
      country: "🇮🇳",
      achievements: []
    },
    {
      id: 10,
      username: "WebGuardian",
      xp: 650,
      levelsCompleted: 1,
      badges: 1,
      averageTime: "40:15",
      rank: 10,
      previousRank: 10,
      avatar: "🚨",
      progress: 10,
      joinDate: "2024-02-25",
      rankName: "Recruit",
      streak: 0,
      lastActive: "3 weeks ago",
      country: "🇧🇷",
      achievements: []
    },
    // Add current user if not in top 10
    ...(user && !leaderboardData.find(p => p.username === user.username) ? [{
      id: 25,
      username: user.username,
      xp: user.xp || 450,
      levelsCompleted: user.completedLevels?.length || 2,
      badges: user.badges?.length || 1,
      averageTime: "45:30",
      rank: 25,
      previousRank: 28,
      avatar: "👤",
      progress: 20,
      joinDate: "2024-03-01",
      rankName: "Recruit",
      streak: 2,
      lastActive: "Just now",
      country: "🌍",
      achievements: ["Newcomer"]
    }] : [])
  ];

  // Filter and sort data
  const filteredData = leaderboardData
    .filter(player => 
      player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.rankName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case "xp": return b.xp - a.xp;
        case "levels": return b.levelsCompleted - a.levelsCompleted;
        case "time": return a.averageTime.localeCompare(b.averageTime);
        case "badges": return b.badges - a.badges;
        case "streak": return b.streak - a.streak;
        default: return a.rank - b.rank;
      }
    });

  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return "text-yellow-400 bg-yellow-500/20 border-yellow-500/40 shadow-lg shadow-yellow-500/20";
      case 2: return "text-gray-400 bg-gray-500/20 border-gray-500/40 shadow-lg shadow-gray-500/20";
      case 3: return "text-orange-400 bg-orange-500/20 border-orange-500/40 shadow-lg shadow-orange-500/20";
      default: return "text-cyan-400 bg-cyan-500/20 border-cyan-500/40";
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-5 h-5 fill-current" />;
      case 2: return <Medal className="w-5 h-5 fill-current" />;
      case 3: return <Award className="w-5 h-5 fill-current" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getRankNameColor = (rankName) => {
    switch(rankName) {
      case "Cyber Sentinel": return "text-purple-400 bg-purple-500/20";
      case "Specialist": return "text-yellow-400 bg-yellow-500/20";
      case "Recruit": return "text-green-400 bg-green-500/20";
      default: return "text-cyan-400 bg-cyan-500/20";
    }
  };

  const platformStats = {
    totalPlayers: 12560,
    averageXP: 1850,
    totalChallengesCompleted: 45620,
    activeThisWeek: 3240
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
            <Trophy className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Leaderboard
            </h1>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Compete with hackers worldwide and climb to the top of the cybersecurity elite!
          </p>
        </motion.section>

        {/* Platform Stats */}
        <motion.section 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          variants={statsVariants}
        >
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-cyan-400 mb-1">
              {platformStats.totalPlayers.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Players</div>
          </div>
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-emerald-400 mb-1">
              {platformStats.averageXP}
            </div>
            <div className="text-gray-400 text-sm">Avg XP</div>
          </div>
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {platformStats.totalChallengesCompleted.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Challenges Completed</div>
          </div>
          <div className="glass card-cyber p-4 text-center border border-gray-700/50">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {platformStats.activeThisWeek.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Active This Week</div>
          </div>
        </motion.section>

        {/* Controls */}
        <motion.section className="glass card-cyber p-6 mb-8 border border-gray-700/50" variants={itemVariants}>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "global", label: "Global", icon: Globe },
                { id: "weekly", label: "Weekly", icon: Calendar },
                { id: "friends", label: "Friends", icon: Users },
                { id: "country", label: "Country", icon: User }
              ].map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeFilter === filter.id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "glass text-gray-300 hover:text-cyan-400 hover:bg-white/5 border border-gray-700/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <filter.icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-colors w-full"
                />
              </div>

              {/* Time Range */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="all-time">All Time</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="quarterly">This Quarter</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
              >
                <option value="xp">Sort by XP</option>
                <option value="levels">Sort by Levels</option>
                <option value="badges">Sort by Badges</option>
                <option value="time">Sort by Time</option>
                <option value="streak">Sort by Streak</option>
              </select>
            </div>
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard List */}
          <motion.section className="lg:col-span-2" variants={itemVariants}>
            <div className="glass card-cyber p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Global Rankings
                </h2>
                <div className="text-sm text-gray-400">
                  Showing {filteredData.length} of {leaderboardData.length} players
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredData.map((player) => (
                  <motion.div 
                    key={player.id}
                    className={`glass p-4 rounded-lg border transition-all duration-300 hover:scale-105 ${
                      player.rank <= 3 
                        ? getRankColor(player.rank) 
                        : "border-gray-700/50 hover:border-cyan-500/30"
                    } ${player.username === user?.username ? "ring-2 ring-cyan-500/50" : ""}`}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center justify-between">
                      {/* Rank & Avatar */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            player.rank <= 3 ? getRankColor(player.rank) : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          }`}>
                            {getRankIcon(player.rank)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-300">
                              #{player.rank}
                            </span>
                            <RankChange change={player.previousRank - player.rank} />
                          </div>
                        </div>
                        <div className="text-2xl">{player.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-white truncate">
                              {player.username}
                              {player.username === user?.username && (
                                <span className="ml-2 text-cyan-400 text-xs">(You)</span>
                              )}
                            </h3>
                            <span className="text-lg">{player.country}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${getRankNameColor(player.rankName)}`}>
                              {player.rankName}
                            </span>
                            <span className="text-gray-400 text-xs">
                              Joined {new Date(player.joinDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Chart */}
                      <ProgressChart completed={player.levelsCompleted} total={10} />
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-cyan-400">
                          <Zap className="w-4 h-4" />
                          <span className="font-bold">{player.xp.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-400 text-xs">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-emerald-400">
                          <Target className="w-4 h-4" />
                          <span className="font-bold">{player.levelsCompleted}/10</span>
                        </div>
                        <div className="text-gray-400 text-xs">Levels</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-yellow-400">
                          <Award className="w-4 h-4" />
                          <span className="font-bold">{player.badges}</span>
                        </div>
                        <div className="text-gray-400 text-xs">Badges</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-purple-400">
                          <Clock className="w-4 h-4" />
                          <span className="font-bold">{player.averageTime}</span>
                        </div>
                        <div className="text-gray-400 text-xs">Avg Time</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-orange-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-bold">{player.streak}</span>
                        </div>
                        <div className="text-gray-400 text-xs">Day Streak</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    {player.achievements.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-yellow-400" />
                        <div className="flex flex-wrap gap-1">
                          {player.achievements.map((achievement, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs">
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last Active */}
                    <div className="mt-2 text-right">
                      <span className="text-gray-500 text-xs">
                        Last active: {player.lastActive}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Charts Sidebar */}
          <motion.section className="space-y-6" variants={containerVariants}>
            {/* XP Distribution Chart */}
            <XPChart data={filteredData} />

            {/* Platform Stats */}
            <div className="glass card-cyber p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Platform Stats
              </h3>
              <div className="space-y-4">
                <ProgressBar value={2850} max={3000} color="cyan" label="Top XP" />
                <ProgressBar value={8.7} max={10} color="green" label="Avg Level" />
                <ProgressBar value={75} max={100} color="yellow" label="Completion" />
                <ProgressBar value={4.2} max={5} color="purple" label="Badges Avg" />
              </div>
            </div>

            {/* Top Badges */}
            <div className="glass card-cyber p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Popular Badges
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Firewall Master", count: 234, emoji: "🛡️", color: "blue" },
                  { name: "Phish Buster", count: 189, emoji: "🎣", color: "green" },
                  { name: "Encryption Expert", count: 156, emoji: "🔐", color: "purple" },
                  { name: "SQL Sentinel", count: 142, emoji: "💾", color: "red" },
                  { name: "Network Scout", count: 128, emoji: "🌐", color: "cyan" }
                ].map((badge, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg group hover:bg-gray-700/50 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{badge.emoji}</span>
                      <div>
                        <span className="text-gray-300 text-sm font-semibold">{badge.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-400 text-xs">{badge.count} earned</span>
                        </div>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your Stats (if logged in) */}
            {user && (
              <motion.div 
                className="glass card-cyber p-6 border border-cyan-500/30"
                variants={itemVariants}
              >
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-cyan-400" />
                  Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Global Rank</span>
                    <span className="text-cyan-400 font-semibold">#25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total XP</span>
                    <span className="text-emerald-400 font-semibold">450</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Levels Completed</span>
                    <span className="text-yellow-400 font-semibold">2/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Streak</span>
                    <span className="text-orange-400 font-semibold">2 days</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-700/50">
                    <div className="text-center">
                      <span className="text-gray-400 text-sm">Next Rank: </span>
                      <span className="text-yellow-400 text-sm font-semibold">Specialist</span>
                      <div className="text-gray-500 text-xs mt-1">550 XP needed</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.section>
        </div>
      </motion.div>
    </div>
  );
}