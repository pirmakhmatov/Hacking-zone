// src/components/AuthTerminal.jsx
import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  Terminal, Key, User, Shield, Zap, 
  Eye, EyeOff, Lock, Network, Cpu,
  CheckCircle, XCircle, Loader2
} from "lucide-react";

// FIXED: process.env removed, direct URL used
const API_URL = 'http://localhost:5000/api';

export default function AuthTerminal({ mode = "login", onSwitchMode }) {
  const [step, setStep] = useState("terminal");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [terminalText, setTerminalText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [accessStatus, setAccessStatus] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ""
  });

  const { login, signup, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const terminalMessages = mode === "login" 
    ? [
        "> INITIALIZING HACKING-ZONE TERMINAL...",
        "> SCANNING NETWORK SECURITY...",
        "> ESTABLISHING ENCRYPTED CONNECTION...",
        "> ACCESSING MAINFRAME...",
        "> PLEASE ENTER YOUR ACCESS CREDENTIALS"
      ]
    : [
        "> INITIALIZING AGENT REGISTRATION...",
        "> SCANNING SECURITY CLEARANCE...",
        "> GENERATING ENCRYPTION PROTOCOLS...",
        "> ACCESSING RECRUITMENT DATABASE...",
        "> PLEASE ENTER YOUR AGENT DETAILS"
      ];

  // Calculate password strength
  useEffect(() => {
    if (password && mode === "signup") {
      let score = 0;
      let feedback = [];

      if (password.length >= 8) score += 1;
      else feedback.push("At least 8 characters");

      if (/[A-Z]/.test(password)) score += 1;
      else feedback.push("One uppercase letter");

      if (/[a-z]/.test(password)) score += 1;
      else feedback.push("One lowercase letter");

      if (/[0-9]/.test(password)) score += 1;
      else feedback.push("One number");

      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      else feedback.push("One special character");

      setPasswordStrength({
        score,
        feedback: feedback.length > 0 ? feedback.join(", ") : "Strong password!"
      });
    }
  }, [password, mode]);

  // Terminal typing effect
  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    let timeoutId;
    
    const typeText = () => {
      if (currentIndex < terminalMessages.length) {
        const currentMessage = terminalMessages[currentIndex];
        
        if (currentText.length < currentMessage.length) {
          currentText = currentMessage.slice(0, currentText.length + 1);
          setTerminalText(currentText);
          timeoutId = setTimeout(typeText, 50);
        } else {
          currentIndex++;
          currentText = "";
          if (currentIndex === terminalMessages.length) {
            setIsTyping(false);
            timeoutId = setTimeout(() => setStep("credentials"), 1000);
          } else {
            timeoutId = setTimeout(typeText, 100);
          }
        }
      }
    };

    typeText();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [mode]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score <= 2) return "text-red-400";
    if (passwordStrength.score <= 3) return "text-yellow-400";
    if (passwordStrength.score <= 4) return "text-green-400";
    return "text-emerald-400";
  };

  const getPasswordStrengthWidth = () => {
    return `${(passwordStrength.score / 5) * 100}%`;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setStep("verifying");
    
    try {
      let result;
      
      if (mode === "login") {
        result = await login(username, password);
      } else {
        // Signup validation
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        if (passwordStrength.score < 3) {
          throw new Error("Password is too weak. Please use a stronger password.");
        }
        
        result = await signup(username, email, password, confirmPassword);
      }

      if (result.success) {
        setAccessStatus("granted");
        
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error(result.error);
      }

    } catch (err) {
      setAccessStatus("denied");
      setError(err.message);
      
      setTimeout(() => {
        setStep("credentials");
        setAccessStatus("");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
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
        duration: 0.6
      }
    }
  };

  const terminalVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Matrix-like code rain */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 text-xs font-mono"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, 1000],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              {Math.random().toString(36).substring(2, 8)}
            </motion.div>
          ))}
        </div>
        
        {/* Floating network nodes */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 8)}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Background orbs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Terminal Header */}
        <motion.div 
          className="glass card-cyber p-6 border border-cyan-500/30 rounded-t-lg shadow-2xl shadow-cyan-500/10"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-4">
            <Terminal className="w-6 h-6 text-cyan-400" />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gradient bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                HACKING-ZONE TERMINAL
              </h1>
              <p className="text-gray-400 text-sm font-mono">
                {mode === "login" ? "Secure Access Required" : "New Agent Registration"}
              </p>
            </div>
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>⚠️ {error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Content */}
          <AnimatePresence mode="wait">
            {step === "terminal" && (
              <motion.div
                key="terminal"
                variants={terminalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-black/80 p-4 rounded-lg font-mono text-green-400 text-sm h-48 overflow-hidden border border-green-500/20"
              >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {terminalText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-1"
                    >
                      █
                    </motion.span>
                  )}
                </pre>
              </motion.div>
            )}

            {step === "credentials" && (
              <motion.form
                key="credentials"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onSubmit={handleAuth}
                className="space-y-4"
              >
                {/* Username Field */}
                <div>
                  <label className="flex items-center gap-2 text-cyan-400 text-sm font-mono mb-2">
                    <User className="w-4 h-4" />
                    {mode === "login" ? "AGENT_ID:" : "CODENAME:"}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-black/80 border border-cyan-500/30 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                    placeholder={mode === "login" ? "Enter username or email" : "Choose your agent codename"}
                    required
                    disabled={isLoading}
                    autoComplete={mode === "login" ? "username" : "off"}
                  />
                </div>

                {/* Email Field (Signup only) */}
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="flex items-center gap-2 text-cyan-400 text-sm font-mono mb-2">
                      <Network className="w-4 h-4" />
                      SECURE_EMAIL:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black/80 border border-cyan-500/30 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                      placeholder="Enter your secure email"
                      required
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </motion.div>
                )}

                {/* Password Field */}
                <div>
                  <label className="flex items-center gap-2 text-cyan-400 text-sm font-mono mb-2">
                    <Key className="w-4 h-4" />
                    {mode === "login" ? "DECRYPTION_KEY:" : "ENCRYPTION_KEY:"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-black/80 border border-cyan-500/30 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors duration-300 pr-12"
                      placeholder={mode === "login" ? "Enter your password" : "Create strong encryption key"}
                      required
                      disabled={isLoading}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 p-1"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  {/* Password Strength Meter (Signup only) */}
                  {mode === "signup" && password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-mono ${getPasswordStrengthColor()}`}>
                          {passwordStrength.feedback}
                        </span>
                        <span className="text-gray-400 font-mono">
                          {password.length}/12
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <motion.div 
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            passwordStrength.score <= 2 ? "bg-red-400" :
                            passwordStrength.score <= 3 ? "bg-yellow-400" :
                            passwordStrength.score <= 4 ? "bg-green-400" :
                            "bg-emerald-400"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: getPasswordStrengthWidth() }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password (Signup only) */}
                {mode === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="flex items-center gap-2 text-cyan-400 text-sm font-mono mb-2">
                      <Shield className="w-4 h-4" />
                      CONFIRM_ENCRYPTION_KEY:
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-black/80 border border-cyan-500/30 rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors duration-300 pr-12"
                        placeholder="Re-enter your encryption key"
                        required
                        disabled={isLoading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 p-1"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Security Tips */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 text-cyan-400 text-sm mb-2">
                    <Lock className="w-4 h-4" />
                    <span className="font-mono">SECURITY PROTOCOL:</span>
                  </div>
                  <p className="text-gray-400 text-xs font-mono leading-relaxed">
                    {mode === "login" 
                      ? "Ensure you're using a secure connection. Your credentials are encrypted with military-grade AES-256 encryption."
                      : "Choose a strong passphrase with mixed characters. Weak passwords can be cracked in seconds by modern GPUs."
                    }
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  type="submit"
                  disabled={isLoading || (mode === "signup" && passwordStrength.score < 3)}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-cyan-500 disabled:hover:to-emerald-500 shadow-lg shadow-cyan-500/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-mono">PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span className="font-mono">
                        {mode === "login" ? "INITIATE ACCESS" : "CREATE AGENT PROFILE"}
                      </span>
                    </>
                  )}
                </motion.button>
              </motion.form>
            )}

            {/* Verification States */}
            {step === "verifying" && !accessStatus && (
              <motion.div
                key="verifying"
                variants={terminalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-black/80 p-4 rounded-lg font-mono text-green-400 text-sm h-48 overflow-hidden border border-green-500/20"
              >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {"> VERIFYING IDENTITY CREDENTIALS...\n"}
                  {"> CHECKING SECURITY CLEARANCE...\n"}
                  {"> ESTABLISHING SECURE CONNECTION...\n"}
                  {"> VALIDATING ENCRYPTION KEYS...\n"}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    > PLEASE WAIT
                  </motion.span>
                </pre>
              </motion.div>
            )}

            {step === "verifying" && accessStatus === "granted" && (
              <motion.div
                key="granted"
                variants={terminalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-black/80 p-4 rounded-lg font-mono text-green-400 text-sm h-48 overflow-hidden border border-green-500/20"
              >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {"> IDENTITY CONFIRMED "}
                  <CheckCircle className="w-4 h-4 text-green-400 inline ml-1" />
                  {"\n"}
                  {"> SECURITY CLEARANCE: GRANTED "}
                  <CheckCircle className="w-4 h-4 text-green-400 inline ml-1" />
                  {"\n"}
                  {"> ENCRYPTION: ACTIVE\n"}
                  {"> WELCOME TO HACKING-ZONE, AGENT\n\n"}
                  <motion.span
                    animate={{ opacity: [1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-cyan-400"
                  >
                    > REDIRECTING TO MISSION CONTROL...
                  </motion.span>
                </pre>
              </motion.div>
            )}

            {step === "verifying" && accessStatus === "denied" && (
              <motion.div
                key="denied"
                variants={terminalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-black/80 p-4 rounded-lg font-mono text-red-400 text-sm h-48 overflow-hidden border border-red-500/20"
              >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {"> IDENTITY VERIFICATION FAILED "}
                  <XCircle className="w-4 h-4 text-red-400 inline ml-1" />
                  {"\n"}
                  {"> SECURITY CLEARANCE: DENIED "}
                  <XCircle className="w-4 h-4 text-red-400 inline ml-1" />
                  {"\n"}
                  {"> ACCESS TO MAINFRAME BLOCKED\n"}
                  {"> REASON: {error}\n\n"}
                  <motion.span
                    animate={{ opacity: [1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-yellow-400"
                  >
                     RETURNING TO CREDENTIALS...
                  </motion.span>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Switch Mode */}
        <motion.div 
          className="glass card-cyber p-4 border border-gray-700/50 rounded-b-lg border-t-0 text-center"
          variants={itemVariants}
        >
          <p className="text-gray-400 text-sm font-mono">
            {mode === "login" ? "New to Hacking-Zone?" : "Already have an agent profile?"}
            {" "}
            <button
              onClick={onSwitchMode}
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200 font-mono disabled:opacity-50"
              disabled={isLoading}
            >
              {mode === "login" ? "CREATE AGENT PROFILE" : "ACCESS TERMINAL"}
            </button>
          </p>
        </motion.div>

        {/* Security Status */}
        {step === "credentials" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs font-mono">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure terminal connection established</span>
              <Cpu className="w-3 h-3" />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}