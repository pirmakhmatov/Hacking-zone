import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, BookOpen, Lock, Zap, CheckCircle, Clock, Users, Target } from "lucide-react";

export default function Cryptography() {
  const lessons = [
    {
      id: 1,
      title: "Symmetric Encryption",
      description: "Learn AES, DES, and other symmetric encryption algorithms",
      duration: "25 min",
      completed: true,
      type: "video",
      youtubeId: "VYech-c5Dic"
    },
    {
      id: 2,
      title: "Asymmetric Cryptography",
      description: "Master RSA, ECC, and public key infrastructure",
      duration: "30 min",
      completed: true,
      type: "interactive",
      youtubeId: "GSIDS_lvRv4"
    },
    {
      id: 3,
      title: "Hash Functions & Digital Signatures",
      description: "Understand SHA, MD5 and digital signature algorithms",
      duration: "28 min",
      completed: false,
      type: "video",
      youtubeId: "O4xNJsjtN6E"
    },
    {
      id: 4,
      title: "Cryptographic Protocols",
      description: "Implement TLS/SSL, PGP and secure communication",
      duration: "35 min",
      completed: false,
      type: "interactive",
      youtubeId: "S2iBR2ZlZfY"
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 pt-24">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div className="max-w-6xl mx-auto relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        
        <div className="flex items-center gap-4 mb-8">
          <Link to="/learning" className="glass card-cyber p-3 border border-green-500/30 hover:border-green-500/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-green-400" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Cryptography & Encryption</h1>
              <p className="text-green-400 text-lg">Master encryption algorithms and protocols</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div className="glass card-cyber p-6 border border-green-500/30"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/VYech-c5Dic"
                  title="Cryptography Fundamentals"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-white mb-2">Cryptography Essentials</h2>
                <p className="text-gray-400">Learn the mathematical foundations of cryptography and how encryption protects data in transit and at rest.</p>
              </div>
            </motion.div>

            <motion.div className="glass card-cyber p-6 border border-gray-700/50"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-400" />
                Course Overview
              </h3>
              <p className="text-gray-400 mb-4">
                This course covers both classical and modern cryptography, from basic ciphers to advanced 
                encryption standards used in modern security systems.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <Clock className="w-4 h-4" />
                  <span>5 hours total</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-400">
                  <Users className="w-4 h-4" />
                  <span>670 students</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <Target className="w-4 h-4" />
                  <span>Intermediate level</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Zap className="w-4 h-4" />
                  <span>300 XP reward</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div className="glass card-cyber p-6 border border-green-500/30"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-green-400" />
                Course Lessons
              </h3>
              <div className="space-y-3">
                {lessons.map((lesson, index) => (
                  <motion.div key={lesson.id} 
                    className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer hover:scale-105 ${
                      lesson.completed 
                        ? "bg-emerald-500/10 border-emerald-500/30" 
                        : "bg-gray-800/50 border-gray-700/50 hover:border-green-500/30"
                    }`}
                    whileHover={{ y: -2 }}
                    transition={{ delay: index * 0.1 }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5 text-emerald-400 fill-current" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-green-400"></div>
                        )}
                        <span className="text-white font-medium">{lesson.title}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{lesson.duration}</span>
                    </div>
                    <p className="text-gray-400 text-sm ml-8">{lesson.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="glass card-cyber p-6 border border-emerald-500/30"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <h3 className="text-lg font-semibold text-white mb-4">Your Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Course Completion</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                      initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ duration: 1, delay: 0.6 }} />
                  </div>
                </div>
                <div className="text-center">
                  <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    Continue Learning
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}