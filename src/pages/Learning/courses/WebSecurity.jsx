import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, BookOpen, Shield, Zap, CheckCircle, Clock, Users, Target, Download, MessageCircle, Star, Bookmark, Share2, FileText, Award, Video, Code } from "lucide-react";
import { useState } from "react";

export default function WebSecurity() {
  const [currentVideo, setCurrentVideo] = useState("ciNHn38EyRc");
  const [progress, setProgress] = useState(50);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(4.8);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");

  const lessons = [
    {
      id: 1,
      title: "SQL Injection Fundamentals",
      description: "Learn how SQL injection attacks work and how to prevent them using parameterized queries",
      duration: "15 min",
      completed: true,
      type: "video",
      youtubeId: "ciNHn38EyRc",
      resources: ["SQL Injection Cheat Sheet", "Practice Lab Files"]
    },
    {
      id: 2,
      title: "Cross-Site Scripting (XSS)",
      description: "Understand XSS vulnerabilities and implement Content Security Policy",
      duration: "20 min",
      completed: true,
      type: "interactive",
      youtubeId: "80VviDER96I",
      resources: ["XSS Payload Examples", "CSP Guide"]
    },
    {
      id: 3,
      title: "Cross-Site Request Forgery (CSRF)",
      description: "Learn about CSRF attacks and protection methods with anti-CSRF tokens",
      duration: "18 min",
      completed: false,
      type: "video",
      youtubeId: "vRBihr41JTo",
      resources: ["CSRF Protection Guide", "Token Implementation"]
    },
    {
      id: 4,
      title: "How Hackers Hack Websites",
      description: "Real-world website hacking techniques and defense strategies",
      duration: "25 min",
      completed: false,
      type: "interactive",
      youtubeId: "oWRI6xKEZMk",
      resources: ["Security Checklist", "Penetration Testing Tools"]
    }
  ];

  const resources = [
    { name: "OWASP Top 10 Guide", type: "PDF", size: "3.2 MB", icon: FileText, downloads: 1240 },
    { name: "Web Security Tools", type: "ZIP", size: "18 MB", icon: Download, downloads: 890 },
    { name: "Security Best Practices", type: "PDF", size: "2.8 MB", icon: FileText, downloads: 1560 },
    { name: "Code Examples", type: "ZIP", size: "12 MB", icon: Code, downloads: 670 }
  ];

  const achievements = [
    { id: 1, name: "SQL Master", description: "Complete SQL Injection lesson", earned: true, icon: Shield },
    { id: 2, name: "XSS Defender", description: "Finish XSS protection module", earned: true, icon: Zap },
    { id: 3, name: "CSRF Expert", description: "Master CSRF prevention", earned: false, icon: Target },
    { id: 4, name: "Web Guardian", description: "Complete all lessons", earned: false, icon: Award }
  ];

  const handleLessonClick = (youtubeId) => {
    setCurrentVideo(youtubeId);
  };

  const handleContinueLearning = () => {
    const nextLesson = lessons.find(lesson => !lesson.completed) || lessons[0];
    setCurrentVideo(nextLesson.youtubeId);
    setProgress(prev => Math.min(prev + 25, 100));
  };

  const handleCompleteLesson = (lessonId) => {
    // In real app, this would update backend
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && !lesson.completed) {
      setProgress(prev => Math.min(prev + 25, 100));
    }
  };

  const handleDownloadResource = (resourceName) => {
    // Simulate download
    alert(`Downloading ${resourceName}...`);
  };

  const handleRateCourse = (newRating) => {
    setRating(newRating);
  };

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalLessons = lessons.length;

  return (
    <div className="min-h-screen py-4 md:py-8 px-3 md:px-4 pt-20 md:pt-24">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div className="max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
          <Link to="/learning" className="glass card-cyber p-2 md:p-3 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors self-start">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 flex-1">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Web Security Fundamentals</h1>
                  <p className="text-cyan-400 text-sm md:text-lg">Master OWASP Top 10 vulnerabilities</p>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isBookmarked 
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" 
                        : "glass border border-gray-700/50 text-gray-400 hover:text-yellow-400"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass p-2 border border-gray-700/50 rounded-lg text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Video Player */}
            <motion.div className="glass card-cyber p-4 md:p-6 border border-cyan-500/30"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo}?rel=0&modestbranding=1`}
                  title="Web Security Course"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="mt-3 md:mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <h2 className="text-lg md:text-xl font-semibold text-white">Web Application Security</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRateCourse(star)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Star className={`w-4 h-4 ${star <= rating ? 'fill-current' : ''}`} />
                        </motion.button>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">({rating}/5)</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm md:text-base">
                  Learn the fundamentals of web application security, common vulnerabilities like SQL Injection, XSS, CSRF, 
                  and real-world hacking techniques used by cybersecurity professionals.
                </p>
              </div>
            </motion.div>

            {/* Tabs Navigation */}
            <motion.div className="glass card-cyber p-1 border border-gray-700/50"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex space-x-1">
                {[
                  { id: "lessons", label: "Lessons", icon: Play },
                  { id: "resources", label: "Resources", icon: Download },
                  { id: "achievements", label: "Achievements", icon: Award }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 flex-1 justify-center text-sm md:text-base ${
                        activeTab === tab.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-gray-400 hover:text-cyan-400 hover:bg-white/5"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Tab Content */}
            {activeTab === "lessons" && (
              <motion.div className="space-y-4"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {/* Course Description */}
                <motion.div className="glass card-cyber p-4 md:p-6 border border-gray-700/50"
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    Course Overview
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">
                    This comprehensive course covers the most critical web application security risks as identified by OWASP Top 10. 
                    You'll learn both offensive techniques to find vulnerabilities and defensive strategies to protect applications.
                  </p>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span>4 hours total</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      <span>1,250 students</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Target className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Beginner level</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      <span>200 XP reward</span>
                    </div>
                  </div>
                </motion.div>

                {/* Lessons List */}
                <motion.div className="glass card-cyber p-4 md:p-6 border border-cyan-500/30"
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                    <Video className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    Course Lessons ({completedLessons}/{totalLessons})
                  </h3>
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <motion.div 
                        key={lesson.id} 
                        onClick={() => handleLessonClick(lesson.youtubeId)}
                        className={`p-3 md:p-4 rounded-lg border transition-all duration-300 cursor-pointer group ${
                          lesson.completed 
                            ? "bg-emerald-500/10 border-emerald-500/30" 
                            : "bg-gray-800/50 border-gray-700/50 hover:border-cyan-500/30"
                        }`}
                        whileHover={{ y: -2 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 fill-current mt-0.5 flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-cyan-400 group-hover:border-cyan-300 transition-colors mt-0.5 flex-shrink-0"></div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-medium text-sm md:text-base">{lesson.title}</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  lesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                                }`}>
                                  {lesson.type}
                                </span>
                              </div>
                              <p className="text-gray-400 text-xs md:text-sm">{lesson.description}</p>
                              
                              {/* Lesson Resources */}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {lesson.resources.map((resource, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">
                                    {resource}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs md:text-sm flex-shrink-0 ml-2">{lesson.duration}</span>
                        </div>
                        
                        {!lesson.completed && (
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompleteLesson(lesson.id);
                              }}
                              className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30 transition-colors"
                            >
                              Mark Complete
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div className="glass card-cyber p-4 md:p-6 border border-blue-500/30"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  Course Resources
                </h3>
                <div className="space-y-3">
                  {resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleDownloadResource(resource.name)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="text-white font-medium text-sm">{resource.name}</div>
                            <div className="text-gray-400 text-xs">{resource.type} • {resource.size} • {resource.downloads} downloads</div>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === "achievements" && (
              <motion.div className="glass card-cyber p-4 md:p-6 border border-yellow-500/30"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                  Your Achievements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((achievement) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={achievement.id} className={`p-3 rounded-lg border transition-all duration-300 ${
                        achievement.earned 
                          ? "bg-yellow-500/10 border-yellow-500/30" 
                          : "bg-gray-800/30 border-gray-700/50 opacity-60"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            achievement.earned ? "bg-yellow-500/20" : "bg-gray-700/50"
                          }`}>
                            <Icon className={`w-4 h-4 ${achievement.earned ? "text-yellow-400" : "text-gray-400"}`} />
                          </div>
                          <div>
                            <div className={`font-medium text-sm ${achievement.earned ? "text-white" : "text-gray-400"}`}>
                              {achievement.name}
                            </div>
                            <div className="text-xs text-gray-400">{achievement.description}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Notes Section */}
            <motion.div className="glass card-cyber p-4 md:p-6 border border-emerald-500/30"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-base md:text-lg font-semibold text-white flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                  My Notes
                </h3>
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors"
                >
                  {showNotes ? 'Hide' : 'Show'} Notes
                </button>
              </div>
              {showNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Take notes about SQL Injection, XSS protection, or other web security topics..."
                    className="w-full h-32 bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none text-sm"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-xs">{notes.length}/500 characters</span>
                    <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors">
                      Save Notes
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Progress & Stats */}
            <motion.div className="glass card-cyber p-4 md:p-6 border border-emerald-500/30"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Your Progress</h3>
              <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs md:text-sm text-gray-400 mb-2">
                    <span>Course Completion</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div 
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
                    <div className="text-cyan-400 font-bold text-lg">{completedLessons}/{totalLessons}</div>
                    <div className="text-gray-400 text-xs">Lessons</div>
                  </div>
                  <div className="p-2 bg-purple-500/10 rounded border border-purple-500/20">
                    <div className="text-purple-400 font-bold text-lg">{Math.round((completedLessons/totalLessons) * 100)}%</div>
                    <div className="text-gray-400 text-xs">Completed</div>
                  </div>
                </div>

                {/* Continue Button */}
                <button 
                  onClick={handleContinueLearning}
                  className="w-full py-2 md:py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  <Play className="w-3 h-3 md:w-4 md:h-4" />
                  Continue Learning
                </button>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div className="glass card-cyber p-4 md:p-6 border border-blue-500/30"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors text-sm flex flex-col items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>Resources</span>
                </button>
                <button className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400 hover:bg-purple-500/20 transition-colors text-sm flex flex-col items-center gap-1">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm flex flex-col items-center gap-1">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm flex flex-col items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Notes</span>
                </button>
              </div>
            </motion.div>

            {/* Course Info */}
            <motion.div className="glass card-cyber p-4 md:p-6 border border-gray-700/50"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
              <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Course Info</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="text-cyan-400">Alex Chen</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>Jan 15, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-purple-400">Web Security</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificate:</span>
                  <span className="text-emerald-400">Available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}