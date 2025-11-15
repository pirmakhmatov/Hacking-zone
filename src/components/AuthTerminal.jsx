import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Terminal, Key, User, Shield, Zap, Eye, EyeOff, Lock, Network, Cpu, CheckCircle, XCircle, Loader2, Check, X } from "lucide-react";

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

  const { login, signup, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const terminalMessages = mode === "login" 
    ? ["> INITIALIZING HACKING-ZONE TERMINAL...", "> SCANNING NETWORK SECURITY...", "> ESTABLISHING ENCRYPTED CONNECTION...", "> ACCESSING MAINFRAME...", "> PLEASE ENTER YOUR ACCESS CREDENTIALS"]
    : ["> INITIALIZING AGENT REGISTRATION...", "> SCANNING SECURITY CLEARANCE...", "> GENERATING ENCRYPTION PROTOCOLS...", "> ACCESSING RECRUITMENT DATABASE...", "> PLEASE ENTER YOUR AGENT DETAILS"];

  // Password requirements
  const passwordRequirements = [
    { id: 'length', text: 'At least 6 characters', validator: (pwd) => pwd.length >= 6 },
    { id: 'number', text: 'Contains at least one number', validator: (pwd) => /\d/.test(pwd) },
    { id: 'letter', text: 'Contains at least one letter', validator: (pwd) => /[a-zA-Z]/.test(pwd) },
    { id: 'special', text: 'Contains at least one special character', validator: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  const getPasswordRequirementStatus = () => {
    return passwordRequirements.map(req => ({
      ...req,
      met: req.validator(password)
    }));
  };

  const isPasswordValid = () => {
    return passwordRequirements.every(req => req.validator(password));
  };

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
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [mode]);

  // Check if user exists in localStorage
  const checkUserExists = (username, email = null) => {
    const users = JSON.parse(localStorage.getItem('hackingZoneUsers') || '[]');
    if (email) {
      return users.find(user => user.username === username || user.email === email);
    }
    return users.find(user => user.username === username || user.email === username);
  };

  // Validate login credentials
  const validateLogin = (username, password) => {
    const users = JSON.parse(localStorage.getItem('hackingZoneUsers') || '[]');
    const user = users.find(user => 
      (user.username === username || user.email === username) && 
      user.password === password
    );
    return user;
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setStep("verifying");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (mode === "login") {
        // Login logic
        const user = validateLogin(username, password);
        if (user) {
          // Store current session
          localStorage.setItem('currentUser', JSON.stringify(user));
          setAccessStatus("granted");
          setTimeout(() => { 
            // Call the actual login function from AuthContext to update state
            login(user.username, user.password);
            navigate("/");
          }, 2000);
        } else {
          throw new Error("Invalid credentials. Agent not found.");
        }
      } else {
        // Signup logic
        if (password !== confirmPassword) {
          throw new Error("Encryption keys do not match");
        }

        if (!isPasswordValid()) {
          throw new Error("Encryption key does not meet security requirements");
        }

        // Check if user already exists
        const existingUser = checkUserExists(username, email);
        if (existingUser) {
          throw new Error("Agent codename or email already registered");
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(),
          username,
          email,
          password, // In real app, this should be hashed
          createdAt: new Date().toISOString(),
          level: 1,
          xp: 0,
          completedCourses: []
        };

        // Save to localStorage
        const users = JSON.parse(localStorage.getItem('hackingZoneUsers') || '[]');
        users.push(newUser);
        localStorage.setItem('hackingZoneUsers', JSON.stringify(users));
        
        // Store current session
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        setAccessStatus("granted");
        setTimeout(() => { 
          // Call the actual signup function from AuthContext to update state
          signup(newUser.username, newUser.email, newUser.password, newUser.password);
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setAccessStatus("denied");
      setError(err.message);
      setTimeout(() => { setStep("credentials"); setAccessStatus(""); }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(25)].map((_, i) => (
            <motion.div key={i} className="absolute text-green-400 text-xs font-mono"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, 1000], opacity: [0, 1, 1, 0] }}
              transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, delay: Math.random() * 5 }} >
              {Math.random().toString(36).substring(2, 8)}
            </motion.div>
          ))}
        </div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <motion.div className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} >
        <motion.div className="glass card-cyber p-6 border border-cyan-500/30 rounded-t-lg shadow-2xl shadow-cyan-500/10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} >
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

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}
                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 overflow-hidden" >
                <div className="flex items-center gap-2 text-red-400 text-sm font-mono">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>⚠️ {error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === "terminal" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="bg-black/80 p-4 rounded-lg font-mono text-green-400 text-sm h-48 overflow-hidden border border-green-500/20" >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {terminalText}
                  {isTyping && ( <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="ml-1">█</motion.span> )}
                </pre>
              </motion.div>
            )}

            {step === "credentials" && (
              <motion.form onSubmit={handleAuth} className="space-y-4"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} >
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
                  />
                </div>

                {mode === "signup" && (
                  <div>
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
                    />
                  </div>
                )}

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
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 p-1" >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Requirements - Only show for signup */}
                  {mode === "signup" && password && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 space-y-2"
                    >
                      <div className="text-xs text-cyan-400 font-mono mb-2">
                        ENCRYPTION KEY REQUIREMENTS:
                      </div>
                      {getPasswordRequirementStatus().map((req) => (
                        <motion.div
                          key={req.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex items-center gap-2 text-xs ${
                            req.met ? 'text-green-400' : 'text-red-400'
                          }`}
                        >
                          {req.met ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <X className="w-3 h-3" />
                          )}
                          <span>{req.text}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {mode === "signup" && (
                  <div>
                    <label className="flex items-center gap-2 text-cyan-400 text-sm font-mono mb-2">
                      <Shield className="w-4 h-4" />
                      CONFIRM_ENCRYPTION_KEY:
                    </label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-3 bg-black/80 border rounded-lg text-white font-mono placeholder-gray-500 focus:outline-none transition-colors duration-300 pr-12 ${
                          confirmPassword && password !== confirmPassword
                            ? 'border-red-500/50 focus:border-red-400'
                            : 'border-cyan-500/30 focus:border-cyan-400'
                        }`}
                        placeholder="Re-enter your encryption key" 
                        required 
                        disabled={isLoading} 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-200 p-1" >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 text-red-400 text-xs font-mono flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Encryption keys do not match
                      </motion.div>
                    )}
                  </div>
                )}

                <motion.button 
                  whileHover={{ scale: isLoading ? 1 : 1.02 }} 
                  whileTap={{ scale: isLoading ? 1 : 0.98 }} 
                  type="submit" 
                  disabled={isLoading || (mode === 'signup' && (!isPasswordValid() || password !== confirmPassword))}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20" >
                  {isLoading ? ( 
                    <> 
                      <Loader2 className="w-4 h-4 animate-spin" /> 
                      <span className="font-mono">PROCESSING...</span> 
                    </> 
                  ) : ( 
                    <> 
                      <Zap className="w-4 h-4" /> 
                      <span className="font-mono">{mode === "login" ? "INITIATE ACCESS" : "CREATE AGENT PROFILE"}</span> 
                    </> 
                  )}
                </motion.button>
              </motion.form>
            )}

            {step === "verifying" && !accessStatus && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="bg-black/80 p-4 rounded-lg font-mono text-green-400 text-sm h-48 overflow-hidden border border-green-500/20" >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {"> VERIFYING IDENTITY CREDENTIALS...\n"}{"> CHECKING SECURITY CLEARANCE...\n"}{"> ESTABLISHING SECURE CONNECTION...\n"}{"> VALIDATING ENCRYPTION KEYS...\n"}
                  <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="text-cyan-400"> > PLEASE WAIT</motion.span>
                </pre>
              </motion.div>
            )}

            {step === "verifying" && accessStatus === "granted" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="bg-black/80 p-4 rounded-lg font-mono text-green-400 text-sm h-48 overflow-hidden border border-green-500/20" >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {"> IDENTITY CONFIRMED "}<CheckCircle className="w-4 h-4 text-green-400 inline ml-1" />{"\n"}
                  {"> SECURITY CLEARANCE: GRANTED "}<CheckCircle className="w-4 h-4 text-green-400 inline ml-1" />{"\n"}
                  {"> ENCRYPTION: ACTIVE\n"}{"> WELCOME TO HACKING-ZONE, AGENT\n\n"}
                  <motion.span animate={{ opacity: [1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} className="text-cyan-400"> > REDIRECTING TO MISSION CONTROL...</motion.span>
                </pre>
              </motion.div>
            )}

            {step === "verifying" && accessStatus === "denied" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                className="bg-black/80 p-4 rounded-lg font-mono text-red-400 text-sm h-48 overflow-hidden border border-red-500/20" >
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {"> IDENTITY VERIFICATION FAILED "}<XCircle className="w-4 h-4 text-red-400 inline ml-1" />{"\n"}
                  {"> SECURITY CLEARANCE: DENIED "}<XCircle className="w-4 h-4 text-red-400 inline ml-1" />{"\n"}
                  {"> ACCESS TO MAINFRAME BLOCKED\n"}{"> REASON: {error}\n\n"}
                  <motion.span animate={{ opacity: [1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} className="text-yellow-400"> RETURNING TO CREDENTIALS...</motion.span>
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="glass card-cyber p-4 border border-gray-700/50 rounded-b-lg border-t-0 text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} >
          <p className="text-gray-400 text-sm font-mono">
            {mode === "login" ? "New to Hacking-Zone?" : "Already have an agent profile?"} {" "}
            <button 
              onClick={onSwitchMode} 
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-200 font-mono disabled:opacity-50" 
              disabled={isLoading} >
              {mode === "login" ? "CREATE AGENT PROFILE" : "ACCESS TERMINAL"}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}