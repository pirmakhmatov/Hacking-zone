// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useGame } from "../context/GameContext";
import { 
  Code2, User, LogOut, Menu, X, 
  Shield, Zap, Trophy, BookOpen, Info,
  ChevronDown, Star, Crown, Award
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, userRank, userXP } = useAuth();
  const { state: gameState } = useGame();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Shield },
    { path: "/learning", label: "Learning", icon: BookOpen },
    { path: "/levels", label: "Levels", icon: Zap },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/about", label: "About", icon: Info }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getRankColor = (rank) => {
    switch(rank) {
      case 'Recruit': return 'text-green-400 bg-green-500/20';
      case 'Specialist': return 'text-yellow-400 bg-yellow-500/20';
      case 'Cyber Sentinel': return 'text-purple-400 bg-purple-500/20';
      default: return 'text-cyan-400 bg-cyan-500/20';
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 'Recruit': return <Star className="w-3 h-3" />;
      case 'Specialist': return <Award className="w-3 h-3" />;
      case 'Cyber Sentinel': return <Crown className="w-3 h-3" />;
      default: return <Star className="w-3 h-3" />;
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const userMenuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'glass-dark border-b border-gray-700/50 backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Hacking-Zone
                </h1>
                <p className="text-xs text-gray-400 group-hover:text-cyan-400 transition-colors">
                  Play. Hack. Learn.
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                        : "text-gray-300 hover:text-cyan-400 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              // Authenticated User
              <motion.div 
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {user?.username || 'Agent'}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getRankColor(userRank)} flex items-center gap-1`}>
                        {getRankIcon(userRank)}
                        {userRank}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-full flex items-center justify-center border-2 border-white/20 group-hover:border-cyan-400/50 transition-colors">
                    <User className="w-5 h-5 text-black" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isUserMenuOpen ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      variants={userMenuVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="absolute right-0 top-full mt-2 w-64 glass-dark border border-gray-700/50 rounded-xl shadow-2xl shadow-cyan-500/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-700/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-black" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-white text-sm">
                              {user?.username || 'Agent'}
                            </h3>
                            <p className="text-cyan-400 text-xs">{user?.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center p-2 bg-cyan-500/10 rounded-lg">
                            <div className="text-cyan-400 font-bold">{userXP} XP</div>
                            <div className="text-gray-400">Total XP</div>
                          </div>
                          <div className="text-center p-2 bg-purple-500/10 rounded-lg">
                            <div className="text-purple-400 font-bold">{gameState.completedLevels.length}/10</div>
                            <div className="text-gray-400">Levels</div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Not Authenticated - Login Button
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link 
                  to="/login" 
                  className="btn-cyber flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Access Terminal</span>
                  <span className="sm:hidden">Login</span>
                </Link>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-300 hover:text-cyan-400"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden glass-dark border-t border-gray-700/50 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-300 ${
                        isActive
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-gray-300 hover:text-cyan-400 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
                
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 mx-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl -z-10" />
    </nav>
  );
}