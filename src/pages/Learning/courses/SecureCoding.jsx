import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, BookOpen, Shield, Zap, CheckCircle, Clock, Users, Target, Download, MessageCircle, Star, Bookmark, Share2, FileText, Award, Video, Code, FileDigit, Calendar, User, Save, Trash2, Cpu, Binary, Key, Lock, Sparkles, Search, Server, Terminal, Bug, FileSearch } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";

export default function SecureCoding() {
  const [currentVideo, setCurrentVideo] = useState("HKDe1z7_AII");
  const [progress, setProgress] = useState(35);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [rating, setRating] = useState(4.5);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [userData, setUserData] = useState({ firstName: "", lastName: "" });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [savedNotes, setSavedNotes] = useState([]);
  const [currentNoteTitle, setCurrentNoteTitle] = useState("");
  
  const notesSectionRef = useRef(null);
  const notesTextareaRef = useRef(null);

  // Real downloadable files for Secure Coding
  const resources = [
    { 
      name: "Secure Coding Guidelines", 
      type: "PDF", 
      size: "3.2 MB", 
      icon: FileText, 
      downloads: 2100,
      fileUrl: "/downloads/secure-coding/Secure-Coding-Guidelines.pdf",
      description: "Comprehensive secure coding standards and best practices"
    },
    { 
      name: "OWASP Top 10 Reference", 
      type: "PDF", 
      size: "2.8 MB", 
      icon: Shield, 
      downloads: 1850,
      fileUrl: "/downloads/secure-coding/OWASP-Top-10-Reference.pdf",
      description: "Complete OWASP Top 10 security risks and prevention"
    },
    { 
      name: "Code Security Tools Suite", 
      type: "ZIP", 
      size: "15.7 MB", 
      icon: Download, 
      downloads: 920,
      fileUrl: "/downloads/secure-coding/Code-Security-Tools-Suite.zip",
      description: "Static analysis and security testing tools collection"
    },
    { 
      name: "Input Validation Templates", 
      type: "ZIP", 
      size: "4.2 MB", 
      icon: Code, 
      downloads: 1340,
      fileUrl: "/downloads/secure-coding/Input-Validation-Templates.zip",
      description: "Secure input validation patterns for multiple languages"
    },
    { 
      name: "Security Code Review Checklist", 
      type: "PDF", 
      size: "1.8 MB", 
      icon: FileSearch, 
      downloads: 1670,
      fileUrl: "/downloads/secure-coding/Security-Code-Review-Checklist.pdf",
      description: "Comprehensive code review checklist for security"
    },
    { 
      name: "Cryptography Implementation Guide", 
      type: "PDF", 
      size: "2.5 MB", 
      icon: Lock, 
      downloads: 980,
      fileUrl: "/downloads/secure-coding/Cryptography-Implementation-Guide.pdf",
      description: "Secure cryptography implementation patterns and examples"
    }
  ];

  const lessons = [
    {
      id: 1,
      title: "Secure Coding Fundamentals",
      description: "Learn core principles of secure software development and common vulnerability patterns",
      duration: "25 min",
      completed: true,
      type: "video",
      youtubeId: "HKDe1z7_AII",
      resources: ["Security Principles", "Common Vulnerabilities"]
    },
    {
      id: 2,
      title: "Input Validation & Sanitization",
      description: "Master input validation techniques and data sanitization to prevent injection attacks",
      duration: "30 min",
      completed: true,
      type: "interactive",
      youtubeId: "fhckQsZM9oQ",
      resources: ["Validation Patterns", "Sanitization Templates"]
    },
    {
      id: 3,
      title: "Authentication & Authorization",
      description: "Implement secure authentication systems and proper authorization mechanisms",
      duration: "35 min",
      completed: false,
      type: "video",
      youtubeId: "9JPnN1Z_iSY&t",
      resources: ["Auth Best Practices", "Session Management"]
    },
    {
      id: 4,
      title: "Cryptography & Data Protection",
      description: "Learn proper cryptographic implementation and data protection strategies",
      duration: "28 min",
      completed: false,
      type: "interactive",
      youtubeId: "C7vmouDOJYM",
      resources: ["Crypto Libraries", "Encryption Guide"]
    },
    {
      id: 5,
      title: "Error Handling & Logging",
      description: "Secure error handling practices and security-focused logging implementation",
      duration: "22 min",
      completed: false,
      type: "video",
      youtubeId: "_lHmH_URv1I",
      resources: ["Error Handling", "Security Logging"]
    },
    {
      id: 6,
      title: "Security Testing & Code Review",
      description: "Conduct security code reviews and implement security testing methodologies",
      duration: "40 min",
      completed: false,
      type: "interactive",
      youtubeId: "Y9sp8gONv9M&t",
      resources: ["Testing Tools", "Review Checklist"]
    }
  ];

  const achievements = [
    { id: 1, name: "Security Fundamentals", description: "Complete secure coding basics", earned: true, icon: Shield },
    { id: 2, name: "Input Validation Expert", description: "Master input validation techniques", earned: true, icon: CheckCircle },
    { id: 3, name: "Authentication Pro", description: "Finish authentication module", earned: false, icon: Key },
    { id: 4, name: "Cryptography Specialist", description: "Complete cryptography module", earned: false, icon: Lock },
    { id: 5, name: "Security Tester", description: "Master security testing", earned: false, icon: Bug },
    { id: 6, name: "Secure Coding Master", description: "Complete all course modules", earned: false, icon: Award }
  ];

  // Auto-focus to notes section when showNotes becomes true
  useEffect(() => {
    if (showNotes && notesSectionRef.current) {
      notesSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      if (notesTextareaRef.current) {
        notesTextareaRef.current.focus();
      }
    }
  }, [showNotes]);

  const handleLessonClick = (youtubeId) => {
    setCurrentVideo(youtubeId);
  };

  const handleContinueLearning = () => {
    const nextLesson = lessons.find(lesson => !lesson.completed) || lessons[0];
    setCurrentVideo(nextLesson.youtubeId);
    setProgress(prev => Math.min(prev + 16, 100));
  };

  const handleCompleteLesson = (lessonId) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && !lesson.completed) {
      lesson.completed = true;
      setProgress(prev => Math.min(prev + 16, 100));
    }
  };

  // Real download function for individual resources
  const handleDownloadResource = async (resource) => {
    try {
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.fileUrl.split('/').pop() || `${resource.name}.${resource.type.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`Downloading: ${resource.name}`);
      alert(`Download started: ${resource.name}\n\nFile: ${link.download}\nSize: ${resource.size}`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  // Download ALL resources as a single ZIP bundle
  const handleDownloadAll = () => {
    try {
      const bundlePath = "/downloads/secure-coding/hacking_zone_secure_coding.zip";
      const link = document.createElement('a');
      link.href = bundlePath;
      link.download = bundlePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('Downloading bundle:', bundlePath);
    } catch (err) {
      console.error('Bundle download failed', err);
      alert('Unable to start bundle download. Make sure hacking_zone_secure_coding.zip exists in /public/downloads/');
    }
  };

  const handleRateCourse = (newRating) => {
    setRating(newRating);
  };

  const handleShareCourse = () => {
    setShowShareOptions(true);
  };

  const copyCourseLink = () => {
    const courseUrl = window.location.href;
    navigator.clipboard.writeText(courseUrl)
      .then(() => {
        alert("Course link copied to clipboard!");
        setShowShareOptions(false);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        alert("Failed to copy link. Please try again.");
      });
  };

  // Enhanced Notes Functions
  const saveNote = () => {
    if (!notes.trim() || !currentNoteTitle.trim()) {
      alert("Please add both title and content for your note.");
      return;
    }

    const newNote = {
      id: Date.now(),
      title: currentNoteTitle,
      content: notes,
      date: new Date().toLocaleDateString(),
      lesson: lessons.find(l => l.youtubeId === currentVideo)?.title || "General Notes"
    };

    setSavedNotes(prev => [newNote, ...prev]);
    setNotes("");
    setCurrentNoteTitle("");
    alert("Note saved successfully!");
  };

  const deleteNote = (noteId) => {
    setSavedNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const loadNote = (note) => {
    setCurrentNoteTitle(note.title);
    setNotes(note.content);
    if (notesTextareaRef.current) {
      notesTextareaRef.current.focus();
    }
  };

  // Certificate Generation for Secure Coding
  const generateCertificate = () => {
    if (!userData.firstName || !userData.lastName) {
      alert("⚠️ Please enter your first and last name to generate certificate");
      return;
    }

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Professional white background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Top border with accent color
    pdf.setFillColor(59, 130, 246); // Blue theme
    pdf.rect(0, 0, pageWidth, 15, 'F');

    // Organization header
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246);
    pdf.setFont(undefined, 'bold');
    pdf.text('CYBER SECURITY ACADEMY', pageWidth / 2, 45, { align: 'center' });

    // Certification Number
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont(undefined, 'normal');
    pdf.text('Certification Number', pageWidth / 2, 60, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    const certNumber = 'CSA-SC' + Array.from({length: 8}, () => 
        Math.floor(Math.random() * 10)
    ).join('');
    pdf.text(certNumber, pageWidth / 2, 70, { align: 'center' });

    // Main certification title
    pdf.setFontSize(28);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    pdf.text('Secure Coding Specialist', pageWidth / 2, 100, { align: 'center' });

    // "This is to acknowledge that"
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont(undefined, 'normal');
    pdf.text('This is to acknowledge that', pageWidth / 2, 125, { align: 'center' });

    // Student Name
    pdf.setFontSize(32);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    const studentName = `${userData.firstName} ${userData.lastName}`;
    pdf.text(studentName, pageWidth / 2, 155, { align: 'center' });

    // Achievement statement
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.setFont(undefined, 'normal');

    const achievementLines = [
        'has successfully completed all requirements and criteria for',
        'Secure Coding Specialist certification through examination'
    ];

    achievementLines.forEach((line, index) => {
        pdf.text(line, pageWidth / 2, 180 + (index * 20), { align: 'center' });
    });

    // Course Title
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246);
    pdf.setFont(undefined, 'bold');
    pdf.text('Secure Coding Practices', pageWidth / 2, 225, { align: 'center' });

    // Dates section
    const datesY = 270;

    // Issue Date
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    pdf.text('Issue Date:', pageWidth / 2 - 60, datesY);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }), pageWidth / 2 - 60, datesY + 8);

    // Expiry Date
    pdf.setFont(undefined, 'bold');
    pdf.text('Expiry Date:', pageWidth / 2 + 60, datesY);
    pdf.setFont(undefined, 'normal');
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
    pdf.text(expiryDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    }), pageWidth / 2 + 60, datesY + 8);

    // Divider line
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.line(50, datesY + 25, pageWidth - 50, datesY + 25);

    // Skills section
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'bold');
    pdf.text('Skills Validated:', 50, datesY + 45);

    const skills = [
        '• Secure Coding Fundamentals & Principles',
        '• Input Validation & Sanitization Techniques',
        '• Authentication & Authorization Systems',
        '• Cryptography & Data Protection',
        '• Secure Error Handling & Logging',
        '• Security Testing & Code Review'
    ];

    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.setFont(undefined, 'normal');

    skills.forEach((skill, index) => {
        pdf.text(skill, 50, datesY + 60 + (index * 12));
    });

    // Accreditation section
    const accreditationY = datesY + 150;

    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('INTERNATIONAL CYBER SECURITY STANDARDS', pageWidth / 2, accreditationY, { align: 'center' });
    pdf.text('SECURE DEVELOPMENT SPECIALIZATION', pageWidth / 2, accreditationY + 6, { align: 'center' });

    // Signatures section
    const signatureY = accreditationY + 30;

    // Left signature
    pdf.setDrawColor(150, 150, 150);
    pdf.setLineWidth(0.5);
    pdf.line(80, signatureY, 150, signatureY);
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Dr. Sarah Chen', 115, signatureY + 8, { align: 'center' });
    pdf.setTextColor(100, 100, 100);
    pdf.text('Security Training Director', 115, signatureY + 15, { align: 'center' });

    // Right signature
    pdf.line(pageWidth - 150, signatureY, pageWidth - 80, signatureY);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Michael Rodriguez', pageWidth - 115, signatureY + 8, { align: 'center' });
    pdf.setTextColor(100, 100, 100);
    pdf.text('Chief Academic Officer', pageWidth - 115, signatureY + 15, { align: 'center' });

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('cybersecurity-academy.org | Verify at: cybersecurity-academy.org/verify', pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Border
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(1);
    pdf.rect(20, 20, pageWidth - 40, pageHeight - 40);

    // Save with professional filename
    const fileName = `SecureCoding_Certificate_${userData.firstName}_${userData.lastName}.pdf`;
    pdf.save(fileName);

    setShowCertificateModal(false);
    setUserData({ firstName: "", lastName: "" });

    setTimeout(() => {
        alert(`✅ Certificate Generated Successfully!\n\n📄 ${fileName}\n🎓 Your achievement has been certified!\n\nCongratulations, ${userData.firstName}!`);
    }, 500);
  };

  const downloadCertificate = () => {
    if (progress < 100) {
      alert("🔒 Complete all course lessons to unlock your certificate");
      return;
    }
    setShowCertificateModal(true);
  };

  const handleShowNotes = () => {
    setShowNotes(true);
    setActiveTab("lessons");
  };

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalLessons = lessons.length;

  return (
    <div className="min-h-screen py-4 md:py-8 px-3 md:px-4 pt-20 md:pt-24">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div className="max-w-7xl mx-auto relative z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 md:mb-8">
          <Link to="/learning" className="glass card-cyber p-2 md:p-3 border border-blue-500/30 hover:border-blue-500/50 transition-colors self-start">
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
          </Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 flex-1">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Secure Coding Practices</h1>
                  <p className="text-blue-400 text-sm md:text-lg">Build secure and resilient applications</p>
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
                    onClick={handleShareCourse}
                    className="glass p-2 border border-gray-700/50 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-8">
          {/* Lessons & Main Content - Left Side */}
          <div className="xl:col-span-3 space-y-4 md:space-y-6">
            {/* Video Player */}
            <motion.div className="glass card-cyber p-4 md:p-6 border border-blue-500/30"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo}?rel=0&modestbranding=1`}
                  title="Secure Coding Course"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="mt-3 md:mt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                  <h2 className="text-lg md:text-xl font-semibold text-white">Secure Development Fundamentals</h2>
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
                  Learn essential secure coding practices to build resilient applications. Master input validation, 
                  authentication security, cryptography, and security testing methodologies used by professional developers.
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
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "text-gray-400 hover:text-blue-400 hover:bg-white/5"
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
                    <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                    Course Overview
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base mb-3 md:mb-4">
                    This comprehensive secure coding course teaches you how to write secure, resilient code from the ground up. 
                    Learn to identify and prevent common vulnerabilities, implement security controls, and follow industry best practices.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-2 text-blue-400">
                      <Clock className="w-3 h-3 md:w-4 md:h-4" />
                      <span>6 hours total</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Users className="w-3 h-3 md:w-4 md:h-4" />
                      <span>1,890 students</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <Target className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Intermediate level</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                      <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      <span>450 XP reward</span>
                    </div>
                  </div>
                </motion.div>

                {/* Lessons List */}
                <motion.div className="glass card-cyber p-4 md:p-6 border border-blue-500/30"
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                    <Video className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
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
                            : "bg-gray-800/50 border-gray-700/50 hover:border-blue-500/30"
                        }`}
                        whileHover={{ y: -2 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-400 fill-current mt-0.5 flex-shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-blue-400 group-hover:border-blue-300 transition-colors mt-0.5 flex-shrink-0"></div>
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
                                  <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs">
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
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30 transition-colors"
                            >
                              Mark Complete
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced Notes Section */}
                <div ref={notesSectionRef}>
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
                        {showNotes ? 'Hide Notes' : 'Show Notes'}
                      </button>
                    </div>
                    
                    {showNotes && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Note Input */}
                        <div className="space-y-3">
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Note Title</label>
                            <input
                              type="text"
                              value={currentNoteTitle}
                              onChange={(e) => setCurrentNoteTitle(e.target.value)}
                              placeholder="Enter note title..."
                              className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 text-sm mb-2">Note Content</label>
                            <textarea
                              ref={notesTextareaRef}
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Take notes about secure coding practices, vulnerabilities, or security patterns..."
                              className="w-full h-32 bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none text-sm"
                            />
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-xs">{notes.length}/1000 characters</span>
                            <div className="flex gap-2">
                              <button 
                                onClick={saveNote}
                                className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" />
                                Save Note
                              </button>
                              <button 
                                onClick={() => { setNotes(""); setCurrentNoteTitle(""); }}
                                className="px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg text-sm hover:bg-gray-600/50 transition-colors"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Saved Notes */}
                        {savedNotes.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                              <Bookmark className="w-4 h-4 text-emerald-400" />
                              Saved Notes ({savedNotes.length})
                            </h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                              {savedNotes.map((note) => (
                                <div key={note.id} className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h5 className="text-white font-medium text-sm">{note.title}</h5>
                                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{note.date}</span>
                                        <span>•</span>
                                        <User className="w-3 h-3" />
                                        <span>{note.lesson}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => loadNote(note)}
                                        className="p-1 text-cyan-400 hover:text-cyan-300 transition-colors"
                                        title="Edit note"
                                      >
                                        <Save className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => deleteNote(note.id)}
                                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete note"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-gray-300 text-sm">{note.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === "resources" && (
              <motion.div className="glass card-cyber p-4 md:p-6 border border-blue-500/30"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <Download className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                  Course Resources ({resources.length} files)
                </h3>
                <div className="space-y-3">
                  {resources.map((resource, index) => {
                    const Icon = resource.icon;
                    return (
                      <motion.div 
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-blue-500/30 transition-colors cursor-pointer group"
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleDownloadResource(resource)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium text-sm">{resource.name}</div>
                            <div className="text-gray-400 text-xs">{resource.description}</div>
                            <div className="text-gray-500 text-xs mt-1">
                              {resource.type} • {resource.size} • {resource.downloads} downloads
                            </div>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors"
                        >
                          <Download className="w-4 h-4 text-blue-400" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Download All Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadAll}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download All Resources (bundle)
                </motion.button>
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
          </div>

          {/* Sidebar - Right Side */}
          <div className="xl:col-span-1 space-y-4 md:space-y-6">
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
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
                    <div className="text-blue-400 font-bold text-lg">{completedLessons}/{totalLessons}</div>
                    <div className="text-gray-400 text-xs">Lessons</div>
                  </div>
                  <div className="p-2 bg-cyan-500/10 rounded border border-cyan-500/20">
                    <div className="text-cyan-400 font-bold text-lg">{resources.length}</div>
                    <div className="text-gray-400 text-xs">Resources</div>
                  </div>
                </div>

                {/* Certificate Button */}
                <motion.button
                  whileHover={progress >= 100 ? { scale: 1.05 } : {}}
                  whileTap={progress >= 100 ? { scale: 0.95 } : {}}
                  onClick={downloadCertificate}
                  disabled={progress < 100}
                  className={`w-full py-2 md:py-3 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base ${
                    progress >= 100
                      ? "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg shadow-green-500/25"
                      : "bg-gray-700/50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {progress >= 100 ? "DOWNLOAD CERTIFICATE" : "COMPLETE COURSE"}
                </motion.button>

                {/* Continue Button */}
                <button 
                  onClick={handleContinueLearning}
                  className="w-full py-2 md:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
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
                <button 
                  onClick={() => setActiveTab("resources")}
                  className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors text-sm flex flex-col items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Resources</span>
                </button>
                <button 
                  onClick={handleShareCourse}
                  className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm flex flex-col items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 hover:bg-yellow-500/20 transition-colors text-sm flex flex-col items-center gap-1"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>Save</span>
                </button>
                <button 
                  onClick={handleShowNotes}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm flex flex-col items-center gap-1"
                >
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
                  <span className="text-blue-400">Dr. Emily Chen</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>Mar 12, 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="text-cyan-400">Secure Development</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificate:</span>
                  <button 
                    onClick={downloadCertificate}
                    className={`${progress >= 100 ? "text-green-400 hover:text-green-300" : "text-gray-500"} transition-colors`}
                  >
                    {progress >= 100 ? "AVAILABLE" : "LOCKED"}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span>Resources:</span>
                  <span className="text-blue-400">{resources.length} files</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Share Options Modal */}
      {showShareOptions && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass card-cyber p-6 border border-blue-500/30 rounded-xl max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-white mb-4">Share Course</h3>
            <p className="text-gray-400 mb-6">Copy the course link to share with others</p>
            <div className="flex gap-3">
              <button
                onClick={copyCourseLink}
                className="flex-1 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors font-medium"
              >
                Copy Link
              </button>
              <button
                onClick={() => setShowShareOptions(false)}
                className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Certificate Modal - Professional Style */}
      {showCertificateModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass card-cyber p-8 border border-green-500/50 rounded-2xl max-w-md w-full relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)'
            }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400">Professional Certificate</h3>
              </div>
              
              <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                🎓 Generate your professional Secure Coding certificate with official design, 
                skills verification, and achievement recognition.
              </p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-green-400" />
                  <h4 className="text-green-400 font-semibold">CERTIFICATE FEATURES</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>• Professional Design</div>
                  <div>• Skills Verification</div>
                  <div>• Official Certificate ID</div>
                  <div>• Instructor Signature</div>
                  <div>• Completion Date</div>
                  <div>• Organization Seal</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={generateCertificate}
                  className="flex-1 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-green-500/25 flex items-center justify-center gap-3"
                >
                  <FileText className="w-5 h-5" />
                  GENERATE CERTIFICATE
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-6 py-4 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
