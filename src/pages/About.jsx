// src/pages/About.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Target, Users, Rocket, Code2, 
  Shield, Zap, Heart, ArrowRight,
  Globe, Award, Star, Clock,
  BookOpen, Terminal, Cpu, Network,
  Lock, Eye, Key, Brain,
  TrendingUp, GraduationCap, Users2,
  Mail, MessageCircle, Github,
  Instagram, ExternalLink, Sparkles
} from "lucide-react";

const About = () => {
  const { user, isAuthenticated } = useAuth();

  const teamMembers = [
    {
      name: "Pirmakhmatov Og'abek",
      role: "Lead Security Engineer",
      avatar: "👨‍💻",
      expertise: ["Web Security", "Penetration Testing"],
      xp: 2850,
      badge: "Cyber Sentinel"
    },
    {
      name: "Unknown",
      role: "Curriculum Developer",
      avatar: "👩‍🏫",
      expertise: ["Network Security", "Cryptography"],
      xp: 2650,
      badge: "Cyber Sentinel"
    },
    {
      name: "Unknown",
      role: "CTF Challenge Designer",
      avatar: "🧙‍♂️",
      expertise: ["Reverse Engineering", "Forensics"],
      xp: 2400,
      badge: "Specialist"
    },
    {
      name: "Unknown",
      role: "Security Researcher",
      avatar: "👩‍🔬",
      expertise: ["Cryptanalysis", "Security Protocols"],
      xp: 2200,
      badge: "Specialist"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Launch",
      description: "Hacking-Zone officially launched with 10 comprehensive cybersecurity levels",
      icon: Rocket,
      color: "from-cyan-500 to-blue-500"
    },
    {
      year: "2024",
      title: "10,000+ Users",
      description: "Reached milestone of 10,000 registered ethical hackers and learners",
      icon: Users,
      color: "from-green-500 to-emerald-500"
    },
    {
      year: "2024",
      title: "Mobile App Beta",
      description: "Started development of mobile application for on-the-go learning",
      icon: Cpu,
      color: "from-purple-500 to-pink-500"
    },
    {
      year: "2025",
      title: "AI Integration",
      description: "Planned integration of AI-powered personalized learning paths",
      icon: Brain,
      color: "from-orange-500 to-red-500"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Hands-on Learning",
      description: "Practice real cybersecurity skills in safe, controlled environments with immediate feedback",
      color: "cyan"
    },
    {
      icon: Zap,
      title: "Gamified Experience",
      description: "Earn XP, unlock badges, and climb leaderboards while mastering complex security concepts",
      color: "yellow"
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join thousands of ethical hackers worldwide in collaborative learning and competition",
      color: "green"
    },
    {
      icon: Award,
      title: "Career Preparation",
      description: "Develop practical skills that are directly applicable to cybersecurity careers and certifications",
      color: "purple"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Learners", icon: Users2 },
    { value: "50+", label: "Challenges", icon: Target },
    { value: "98%", label: "Completion Rate", icon: Star },
    { value: "24/7", label: "Platform Uptime", icon: Clock }
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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
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
        {/* Hero Section */}
        <motion.section className="text-center mb-20" variants={itemVariants}>
          <motion.div 
            className="flex items-center justify-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              About Hacking-Zone
            </h1>
            <Zap className="w-8 h-8 text-emerald-400" />
          </motion.div>
          
          <motion.p
            className="text-center text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8"
            variants={itemVariants}
          >
            We make learning cybersecurity feel like a game — because defending the digital world 
            should be engaging, accessible, and empowering for everyone.
          </motion.p>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
            variants={containerVariants}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="glass card-cyber p-4 text-center border border-gray-700/50"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className={`w-6 h-6 text-cyan-400 mx-auto mb-2`} />
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Mission Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div 
            className="glass card-cyber p-8 border border-cyan-500/30 relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-emerald-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gradient">Our Mission</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  Cybersecurity education often feels dry, intimidating, and disconnected from real-world applications. 
                  We've transformed it into an <span className="text-cyan-400 font-semibold">interactive adventure</span> where every challenge builds practical skills.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Our platform makes complex security concepts approachable through hands-on learning, gamification, 
                  and a supportive community of like-minded individuals passionate about digital defense.
                </p>
                <div className="flex items-center gap-2 text-cyan-400 mt-6">
                  <Heart className="w-5 h-5" />
                  <span className="font-semibold">Making cybersecurity education accessible to all</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div 
            className="glass card-cyber p-8 border border-emerald-500/30"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gradient">How It Works</h2>
            </div>
            <div className="space-y-6">
              <p className="text-gray-300 text-lg leading-relaxed">
                Each level teaches a real skill — from configuring firewalls to digital forensics. 
                You'll progress through <span className="text-emerald-400 font-semibold">10 unique challenges</span> that simulate actual cybersecurity scenarios encountered by professionals.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: BookOpen, text: "Learn by doing in safe environments", color: "cyan" },
                  { icon: Zap, text: "Earn XP and unlock achievements", color: "yellow" },
                  { icon: Users, text: "Compete on global leaderboards", color: "purple" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="text-center p-6 bg-gray-800/30 rounded-lg border border-gray-700/50"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className={`w-8 h-8 text-${item.color}-400 mx-auto mb-3`} />
                    <p className="text-gray-300 text-sm">{item.text}</p>
                  </motion.div>
                ))}
              </div>

              {/* Learning Path Visualization */}
              <div className="mt-8 p-6 bg-gray-800/20 rounded-lg border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Learning Journey</h3>
                <div className="flex items-center justify-between relative">
                  {[
                    { level: "1-3", name: "Fundamentals", icon: Shield },
                    { level: "4-7", name: "Intermediate", icon: Network },
                    { level: "8-10", name: "Advanced", icon: Brain }
                  ].map((stage, index) => (
                    <motion.div
                      key={index}
                      className="text-center flex-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <stage.icon className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-cyan-400 font-semibold text-sm">{stage.level}</div>
                      <div className="text-gray-400 text-xs">{stage.name}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Why Hacking-Zone Stands Out
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We combine cutting-edge technology with proven educational methodologies to create 
              the most engaging cybersecurity learning platform available.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="glass card-cyber p-6 border border-gray-700/50"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* Team Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              The Team
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built by passionate cybersecurity professionals and educators who believe that 
              security knowledge should be accessible to everyone.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="glass card-cyber p-6 text-center border border-gray-700/50"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="text-4xl mb-4">{member.avatar}</div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                
                <div className="flex justify-center gap-1 mb-3">
                  {member.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{member.xp} XP</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                    {member.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-8 p-6 bg-cyan-500/5 rounded-lg border border-cyan-500/20"
            variants={itemVariants}
          >
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold">Coding Club Members</span>
            </div>
            <p className="text-gray-400 text-sm">
              Supported by students and members of coding clubs worldwide who contribute to challenge development and platform improvements.
            </p>
          </motion.div>
        </motion.section>

        {/* Milestones Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Our Journey
            </h2>
            <p className="text-gray-400 text-lg">
              From concept to platform, follow our growth and future vision
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-cyan-500/20 h-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={index}
                    className={`flex items-center ${isEven ? 'flex-row' : 'flex-row-reverse'} gap-8`}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                      <motion.div 
                        className="glass card-cyber p-6 border border-gray-700/50"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`w-12 h-12 ${milestone.color} bg-gradient-to-br rounded-xl flex items-center justify-center mb-4 ${isEven ? 'ml-auto' : 'mr-auto'}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-400 text-sm">{milestone.description}</p>
                        <div className="text-cyan-400 font-semibold mt-3">{milestone.year}</div>
                      </motion.div>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative">
                      <div className="w-4 h-4 bg-cyan-500 rounded-full border-4 border-gray-900"></div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1"></div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Future Vision Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div 
            className="glass card-cyber p-8 border border-purple-500/30 relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-cyan-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-purple-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gradient">The Future</h2>
              </div>
              <div className="space-y-4">
                <p className="text-gray-300 text-lg leading-relaxed">
                  We're building toward an even more immersive experience with{" "}
                  <span className="text-purple-400 font-semibold">AI-powered adaptive learning</span>, 
                  live <span className="text-purple-400 font-semibold">Capture-the-Flag tournaments</span>, 
                  and mobile accessibility — making cybersecurity learning truly cutting-edge and accessible to everyone.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm">
                  {[
                    "🤖 AI-powered adaptive learning paths",
                    "🏆 Live CTF competitions with real-time scoring", 
                    "📱 Mobile app for on-the-go learning",
                    "🌐 Multiplayer hacking simulations",
                    "🎓 Industry certification preparation",
                    "🔗 Integration with professional security tools"
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 text-gray-300"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Contact Us Section */}
        <motion.section className="mb-20" variants={itemVariants}>
          <motion.div 
            className="glass card-cyber p-8 border border-cyan-500/30 relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-emerald-500/5"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gradient">Contact Us</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Introduction */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-full flex items-center justify-center text-2xl">
                      👋
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">Pirmaxmatov Og'abek</h3>
                      <p className="text-cyan-400 text-sm">Creator of Hacking-Zone</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    Hi, I'm the creator of Hacking-Zone — a gamified cybersecurity learning platform made for 
                    curious minds who love to explore, learn, and protect.
                  </p>
                  
                  <p className="text-gray-300 leading-relaxed">
                    If you have ideas, feedback, or just want to connect about coding, cybersecurity, 
                    or tech innovation — I'd love to hear from you.
                  </p>
                  
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 mt-4">
                    <p className="text-cyan-300 text-sm text-center">
                      Let's collaborate and make the digital world safer — one line of code at a time.
                    </p>
                  </div>
                </div>

                {/* Contact Methods */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Get In Touch</h4>
                  
                  {/* Email */}
                  <motion.a
                    href="mailto:o.pirmaxmatov@gmail.com"
                    className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold group-hover:text-cyan-300 transition-colors">
                        Email
                      </div>
                      <div className="text-gray-400 text-sm">o.pirmaxmatov@gmail.com</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </motion.a>

                  {/* Telegram */}
                  <motion.a
                    href="https://t.me/pirmaxmatov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                        Telegram
                      </div>
                      <div className="text-gray-400 text-sm">@pirmaxmatov | @pirmaxmatovs</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </motion.a>

                  {/* Instagram */}
                  <motion.a
                    href="https://instagram.com/pirmakhmatov_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-pink-500/30 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6 text-pink-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold group-hover:text-pink-300 transition-colors">
                        Instagram
                      </div>
                      <div className="text-gray-400 text-sm">@pirmakhmatov_</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
                  </motion.a>

                  {/* GitHub */}
                  <motion.a
                    href="https://github.com/pirmakhmatov"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Github className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                        GitHub
                      </div>
                      <div className="text-gray-400 text-sm">@pirmakhmatov</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                  </motion.a>
                </div>
              </div>

              {/* Collaboration Call-to-Action */}
              <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-semibold text-white">Open for Collaboration</h4>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Interested in cybersecurity projects, open-source contributions, or tech innovation? 
                  I'm always open to discussing new opportunities and collaborations that push the 
                  boundaries of digital security education.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Final CTA */}
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
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-emerald-500/5 to-purple-500/5"></div>
            
            <Terminal className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Cybersecurity Journey?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of hackers worldwide who are mastering cybersecurity skills 
              and building their careers in digital defense. Start learning today and become 
              part of the next generation of cyber defenders.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to={isAuthenticated ? "/levels" : "/signup"}
                  className="btn-cyber text-lg px-8 py-4 inline-flex items-center gap-3"
                >
                  <Zap className="w-5 h-5" />
                  <span>{isAuthenticated ? "Continue Learning" : "Start Your Journey"}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/learning"
                  className="glass border border-gray-600 text-lg px-8 py-4 rounded-lg text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10 transition-all duration-300 inline-flex items-center gap-3 hover:border-cyan-400/50"
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Explore Courses</span>
                </Link>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contact@hacking-zone.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>@hackingzone_support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  <span>github.com/hackingzone</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default About;