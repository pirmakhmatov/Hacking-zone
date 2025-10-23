// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Code2, Heart, Instagram, MessageCircle, 
  Facebook, Github, Twitter, Mail, ExternalLink
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      icon: Instagram, 
      href: "https://instagram.com/@pirmakhmatov_", 
      label: "Instagram", 
      color: "hover:text-pink-400" 
    },
    { 
      icon: MessageCircle, 
      href: "https://t.me/pirmaxmatovs", 
      label: "Telegram", 
      color: "hover:text-blue-400" 
    },
    { 
      icon: Facebook, 
      href: "https://facebook.com/pirmaxmatov", 
      label: "Facebook", 
      color: "hover:text-blue-600" 
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/hackingzone", 
      label: "Twitter", 
      color: "hover:text-sky-400" 
    },
    { 
      icon: Github, 
      href: "https://github.com/pirmakhmatov", 
      label: "GitHub", 
      color: "hover:text-gray-300" 
    },
    { 
      icon: Mail, 
      href: "mailto:contact@hacking-zone.com", 
      label: "Email", 
      color: "hover:text-red-400" 
    }
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Learning", href: "/learning" },
    { name: "Challenges", href: "/levels" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "About", href: "/about" }
  ];

  const resourceLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Community", href: "/community" },
    { name: "Support", href: "/support" },
    { name: "Privacy Policy", href: "/privacy" }
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.footer 
      className="glass-dark border-t border-gray-700/50 mt-auto"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Hacking-Zone
                </h3>
                <p className="text-gray-400 text-sm">Play. Hack. Learn.</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
              Master cybersecurity through interactive challenges, real-world scenarios, 
              and hands-on learning. Join thousands of ethical hackers worldwide in our 
              mission to make digital security education accessible and engaging.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 transition-all duration-300 ${social.color} hover:scale-110 hover:bg-white/10 border border-gray-700/50`}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:scale-150 transition-transform"></div>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <span>Resources</span>
            </h4>
            <ul className="space-y-3">
              {resourceLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full group-hover:scale-150 transition-transform"></div>
                    {link.name}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="mt-6 p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/10">
              <h5 className="text-sm font-semibold text-cyan-300 mb-2">Get In Touch</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  contact@hacking-zone.com
                </p>
                <p className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-blue-400" />
                  @hackingzone_support
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700/50 pt-8 flex flex-col md:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
            <span className="text-sm">Made with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Heart className="w-4 h-4 text-red-400 fill-current" />
            </motion.div>
            <span className="text-sm">for the hacker community</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
              © {currentYear} Hacking-Zone-pirmaxmatov. All Rights Reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Built for the next generation of cyber defenders
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
    </motion.footer>
  );
}