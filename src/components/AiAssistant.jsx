import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAi } from '../context/AiContext';
import ReactMarkdown from 'react-markdown';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Loader2,
  Sparkles,
  Trash2,
  Cpu,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Copy,
  BookOpen,
  Target,
  Key
} from 'lucide-react';

export default function AiAssistant() {
  const { 
    isAiOpen, 
    setIsAiOpen, 
    messages, 
    sendMessage, 
    isLoading, 
    clearChat
  } = useAi();
  
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fixed scroll function - simplified
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Scroll when messages change or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const suggestedQuestions = [
    {
      question: "What is ethical hacking?",
      icon: Shield
    },
    {
      question: "How to start learning cybersecurity?",
      icon: BookOpen
    },
    {
      question: "Explain SQL injection attacks",
      icon: Target
    },
    {
      question: "Web application security basics",
      icon: Key
    }
  ];

  const quickActions = [
    {
      label: "Clear Chat",
      action: clearChat,
      icon: Trash2,
      color: "text-red-400"
    },
    {
      label: "Copy Last Response",
      action: () => {
        const lastAiMessage = messages.filter(m => m.role === 'assistant').pop();
        if (lastAiMessage) copyToClipboard(lastAiMessage.content);
      },
      icon: Copy,
      color: "text-cyan-400"
    }
  ];

  // Container variants for smooth animations
  const containerVariants = {
    collapsed: {
      width: 300,
      height: 80,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    expanded: {
      width: 420,
      height: 600, // Adjusted height
      transition: {
        type: "spring", 
        stiffness: 300,
        damping: 30
      }
    }
  };

  const contentVariants = {
    collapsed: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    },
    expanded: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    }
  };

  // Custom markdown components for styling
  const markdownComponents = {
    strong: ({children}) => <strong className="text-cyan-400 font-semibold">{children}</strong>,
    a: ({href, children}) => (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
        {children}
      </a>
    ),
    p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
    ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
    li: ({children}) => <li className="text-sm">{children}</li>,
    code: ({children}) => <code className="bg-gray-700 px-1 py-0.5 rounded text-xs">{children}</code>
  };

  return (
    <>
      {/* AI Assistant - Card Style */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={false}
        animate={isAiOpen ? "expanded" : "collapsed"}
        variants={containerVariants}
      >
        {/* Main Card Container */}
        <div className="glass-dark rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 overflow-hidden h-full flex flex-col backdrop-blur-xl">
          
          {/* Fixed Header - Always visible when expanded */}
          <motion.div
            className={`p-4 border-b border-cyan-500/20 cursor-pointer ${
              isAiOpen ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20' : 'bg-gray-800/80 hover:bg-gray-700/80'
            } transition-all duration-300 flex-shrink-0`}
            onClick={() => setIsAiOpen(!isAiOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                    <Cpu className="w-6 h-6 text-black" />
                  </div>
                  <motion.div
                    className="absolute -inset-1 border-2 border-cyan-400/50 rounded-xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  {/* Online Status */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Cyber AI</h3>
                  <p className="text-cyan-300 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {messages.length > 0 ? `${messages.length} messages` : 'Online'}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isAiOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2"
              >
                {!isAiOpen && (
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
                {isAiOpen ? (
                  <ChevronDown className="w-5 h-5 text-cyan-400" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-cyan-400" />
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isAiOpen && (
              <motion.div
                className="flex-1 flex flex-col min-h-0" // Important: min-h-0 for flex children
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
              >
                {/* Messages Area with Proper Scroll Container */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-900/50 to-gray-900/30 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-gray-800/50 min-h-0"
                  style={{ maxHeight: '400px' }} // Fixed max height for scrolling
                >
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 h-full flex flex-col justify-center py-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/30"
                      >
                        <Shield className="w-8 h-8 text-cyan-400" />
                      </motion.div>
                      <h4 className="text-white text-lg mb-2 font-bold">Hacking-Zone AI</h4>
                      <p className="text-sm mb-2">Your cybersecurity learning assistant</p>
                      
                      {/* Quick Questions Grid */}
                      <div className="grid grid-cols-1 gap-2 mb-6 mt-4">
                        {suggestedQuestions.map((item, index) => {
                          const Icon = item.icon;
                          return (
                            <motion.button
                              key={index}
                              onClick={() => sendMessage(item.question)}
                              className="p-3 text-xs bg-gray-800/50 hover:bg-cyan-500/20 rounded-lg border border-gray-700 hover:border-cyan-500/30 transition-all duration-300 text-gray-300 hover:text-cyan-300 text-left group"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="p-1 bg-cyan-500/20 rounded group-hover:bg-cyan-500/40 transition-colors">
                                  <Icon className="w-3 h-3 text-cyan-400" />
                                </div>
                                <span className="flex-1">{item.question}</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-cyan-500 to-cyan-600'
                                : message.isError
                                ? 'bg-gradient-to-br from-red-500 to-red-600'
                                : 'bg-gradient-to-br from-purple-500 to-emerald-400'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <User className="w-4 h-4 text-black" />
                            ) : message.isError ? (
                              <X className="w-4 h-4 text-black" />
                            ) : (
                              <Bot className="w-4 h-4 text-black" />
                            )}
                          </div>
                          <div
                            className={`max-w-[80%] rounded-xl p-3 relative group ${
                              message.role === 'user'
                                ? 'bg-cyan-500/20 border border-cyan-500/30'
                                : message.isError
                                ? 'bg-red-500/20 border border-red-500/30'
                                : 'bg-gray-800/50 border border-purple-500/30'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <p className="text-white text-xs leading-relaxed whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            ) : (
                              <div className="text-white text-xs leading-relaxed break-words">
                                <ReactMarkdown components={markdownComponents}>
                                  {message.content}
                                </ReactMarkdown>
                              </div>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-gray-400 text-xs">
                                {message.timestamp.toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              {message.role === 'assistant' && !message.isError && (
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => copyToClipboard(message.content)}
                                    className="p-1 hover:bg-gray-700 rounded transition-colors"
                                    title="Copy response"
                                  >
                                    <Copy className="w-3 h-3 text-gray-400" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}
                  
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-lg">
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-3 border border-purple-500/30">
                        <div className="flex items-center gap-3">
                          <div className="flex space-x-1">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
                                animate={{ scale: [1, 1.5, 1] }}
                                transition={{ 
                                  duration: 1, 
                                  repeat: Infinity, 
                                  delay: i * 0.2 
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-xs">Analyzing security protocols...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="p-3 border-t border-cyan-500/20 bg-gray-900/80 backdrop-blur-lg flex-shrink-0">
                  {/* Quick Actions */}
                  {messages.length > 0 && (
                    <div className="flex gap-2 mb-2">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={index}
                          onClick={action.action}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${action.color} hover:bg-gray-700/50`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <action.icon className="w-3 h-3" />
                          {action.label}
                        </motion.button>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about cybersecurity..."
                        className="flex-1 bg-gray-800/50 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-gray-800/70 text-xs backdrop-blur-sm transition-all"
                        disabled={isLoading}
                      />
                      <motion.button
                        type="submit"
                        disabled={!inputMessage.trim() || isLoading}
                        className="bg-gradient-to-br from-cyan-500 to-emerald-400 text-black rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shadow-lg relative overflow-hidden group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="relative z-10">
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </motion.button>
                    </div>
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">
                        {messages.length} messages
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          AI Online
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}