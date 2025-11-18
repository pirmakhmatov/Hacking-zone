// hacking_zone/src/pages/levels/PasswordVault.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGame } from "../../context/GameContext";
import {
  Shield, Play, Pause, RotateCcw, CheckCircle, XCircle,
  AlertTriangle, Clock, Zap, Trophy, ArrowLeft,
  Lock, Key, Copy, Check, Eye, EyeOff, Cpu,
  Users, Terminal, Star, Sparkles, Award,
  Volume2, VolumeX, ChevronDown, Filter,
  Hash, Fingerprint, UserCheck, Server,
  CheckSquare, X, AlertCircle, TrendingUp,
  ThumbsUp, ThumbsDown, Info, Lightbulb,
  Menu
} from "lucide-react";

// Enhanced Password Strength Meter with Detailed Feedback
const PasswordStrengthMeter = ({ password, requirements, onAnalysis }) => {
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (!password) {
      setAnalysis(null);
      onAnalysis?.(null);
      return;
    }

    const calculateStrength = (pass) => {
      let strength = 0;
      let scoreDetails = {
        length: 0,
        variety: 0,
        complexity: 0,
        patterns: 0,
        entropy: 0
      };

      // Length score (max 30 points)
      const lengthScore = Math.min(30, (pass.length / 16) * 30);
      scoreDetails.length = lengthScore;
      strength += lengthScore;

      // Character variety (max 25 points)
      let varietyScore = 0;
      if (/[A-Z]/.test(pass)) varietyScore += 5;
      if (/[a-z]/.test(pass)) varietyScore += 5;
      if (/\d/.test(pass)) varietyScore += 5;
      if (/[^A-Za-z0-9]/.test(pass)) varietyScore += 10;
      scoreDetails.variety = varietyScore;
      strength += varietyScore;

      // Complexity (max 25 points)
      let complexityScore = 0;
      const uniqueChars = new Set(pass).size;
      complexityScore += Math.min(15, (uniqueChars / pass.length) * 15);
      
      if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) complexityScore += 5;
      if (/\d/.test(pass) && /[^A-Za-z0-9]/.test(pass)) complexityScore += 5;
      scoreDetails.complexity = complexityScore;
      strength += complexityScore;

      // Pattern penalties (max 20 points deduction)
      let patternPenalty = 0;
      const commonPatterns = [
        /password/i, /123456/, /qwerty/i, /admin/i, /welcome/i,
        /letmein/i, /monkey/i, /dragon/i, /master/i, /sunshine/i
      ];
      
      const sequential = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
      if (sequential.test(pass)) patternPenalty += 5;
      
      const repeated = /(.)\1{2,}/;
      if (repeated.test(pass)) patternPenalty += 5;
      
      commonPatterns.forEach(pattern => {
        if (pattern.test(pass)) patternPenalty += 10;
      });
      
      scoreDetails.patterns = Math.max(0, 20 - patternPenalty);
      strength += scoreDetails.patterns;

      // Entropy bonus (max 10 points)
      const entropy = Math.log2(Math.pow(94, pass.length));
      const entropyScore = Math.min(10, entropy / 10);
      scoreDetails.entropy = entropyScore;
      strength += entropyScore;

      const finalScore = Math.min(100, Math.round(strength));
      
      const newAnalysis = {
        score: finalScore,
        details: scoreDetails,
        feedback: generateFeedback(pass, scoreDetails, patternPenalty),
        meetsRequirements: requirements.every(req => req.validator(pass))
      };

      return newAnalysis;
    };

    const generateFeedback = (password, details, patternPenalty) => {
      const feedback = {
        positives: [],
        warnings: [],
        suggestions: []
      };

      if (details.length >= 25) {
        feedback.positives.push("Excellent length - very resistant to brute force attacks");
      } else if (details.length >= 15) {
        feedback.positives.push("Good length - provides decent security");
      }

      if (details.variety >= 20) {
        feedback.positives.push("Great character variety - makes password much stronger");
      } else if (details.variety >= 10) {
        feedback.positives.push("Good mix of character types");
      }

      if (details.complexity >= 15) {
        feedback.positives.push("High complexity - very difficult to guess");
      }

      if (password.length < 8) {
        feedback.warnings.push("Too short - easily cracked by brute force");
      }

      if (details.variety < 10) {
        feedback.warnings.push("Limited character variety - consider adding different character types");
      }

      if (patternPenalty > 10) {
        feedback.warnings.push("Contains common patterns - easily guessed by attackers");
      }

      if (password.length < 12) {
        feedback.suggestions.push("Try making it at least 12 characters long");
      }

      if (!/[A-Z]/.test(password)) {
        feedback.suggestions.push("Add uppercase letters for better security");
      }

      if (!/[^A-Za-z0-9]/.test(password)) {
        feedback.suggestions.push("Include special characters like !@#$%^&*");
      }

      if (/(.)\1{2,}/.test(password)) {
        feedback.suggestions.push("Avoid repeating the same character multiple times");
      }

      if (/(123|abc|qwerty)/i.test(password)) {
        feedback.suggestions.push("Avoid common sequences and keyboard patterns");
      }

      return feedback;
    };

    const newAnalysis = calculateStrength(password);
    setAnalysis(newAnalysis);
    onAnalysis?.(newAnalysis);
  }, [password, requirements, onAnalysis]);

  const strength = analysis?.score || 0;
  
  const getStrengthColor = (strength) => {
    if (strength < 40) return "from-red-500 to-red-600";
    if (strength < 70) return "from-yellow-500 to-orange-500";
    if (strength < 90) return "from-blue-500 to-cyan-500";
    return "from-green-500 to-emerald-500";
  };

  const getStrengthText = (strength) => {
    if (strength < 20) return "Very Weak";
    if (strength < 40) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    if (strength < 90) return "Strong";
    return "Very Strong";
  };

  const getStrengthIcon = (strength) => {
    if (strength < 40) return <ThumbsDown className="w-4 h-4 text-red-400" />;
    if (strength < 70) return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    if (strength < 90) return <ThumbsUp className="w-4 h-4 text-blue-400" />;
    return <Star className="w-4 h-4 text-green-400" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Strength Overview */}
      <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 border border-gray-600/50">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            {getStrengthIcon(strength)}
            <span className="text-xs sm:text-sm font-medium text-gray-300">Password Strength</span>
          </div>
          <div className={`text-base sm:text-lg font-bold ${
            strength < 40 ? 'text-red-400' :
            strength < 70 ? 'text-yellow-400' :
            strength < 90 ? 'text-blue-400' : 'text-green-400'
          }`}>
            {getStrengthText(strength)} ({strength}%)
          </div>
        </div>
        
        {/* Strength Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden mb-1 sm:mb-2">
          <motion.div
            className={`h-2 sm:h-3 rounded-full bg-gradient-to-r ${getStrengthColor(strength)}`}
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>Weak</span>
          <span>Strong</span>
        </div>
      </div>

      {/* Detailed Score Breakdown */}
      {analysis && password && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 rounded-xl p-3 sm:p-4 border border-gray-600/30"
        >
          <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
            Score Breakdown
          </h4>
          <div className="space-y-1 sm:space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Length:</span>
              <span className="text-cyan-400">{Math.round(analysis.details.length)}/30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Variety:</span>
              <span className="text-cyan-400">{Math.round(analysis.details.variety)}/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Complexity:</span>
              <span className="text-cyan-400">{Math.round(analysis.details.complexity)}/25</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Patterns:</span>
              <span className="text-cyan-400">{Math.round(analysis.details.patterns)}/20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entropy:</span>
              <span className="text-cyan-400">{Math.round(analysis.details.entropy)}/10</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Requirements Checklist */}
      <div className="space-y-2 sm:space-y-3">
        <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
          <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
          Security Requirements
        </h4>
        <div className="space-y-1 sm:space-y-2">
          {requirements.map((req, index) => {
            const isMet = req.validator(password);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ${
                  isMet 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {isMet ? <Check className="w-2 h-2 sm:w-3 sm:h-3" /> : <X className="w-2 h-2 sm:w-3 sm:h-3" />}
                </div>
                <span className={isMet ? 'text-green-400' : 'text-gray-400'}>
                  {req.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Detailed Feedback */}
      {analysis && password && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Positive Feedback */}
          {analysis.feedback.positives.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-green-400 text-xs sm:text-sm font-semibold">Strengths</span>
              </div>
              <ul className="text-green-300 text-xs space-y-1">
                {analysis.feedback.positives.map((positive, index) => (
                  <li key={index}>• {positive}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warning Feedback */}
          {analysis.feedback.warnings.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                <span className="text-yellow-400 text-xs sm:text-sm font-semibold">Areas for Improvement</span>
              </div>
              <ul className="text-yellow-300 text-xs space-y-1">
                {analysis.feedback.warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {analysis.feedback.suggestions.length > 0 && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 sm:p-3">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-blue-400 text-xs sm:text-sm font-semibold">Suggestions</span>
              </div>
              <ul className="text-blue-300 text-xs space-y-1">
                {analysis.feedback.suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Assessment */}
          <div className={`rounded-lg p-2 sm:p-3 border ${
            analysis.score >= 80 
              ? 'bg-green-500/10 border-green-500/30' 
              : analysis.score >= 60
              ? 'bg-blue-500/10 border-blue-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2">
              <Shield className={`w-3 h-3 sm:w-4 sm:h-4 ${
                analysis.score >= 80 ? 'text-green-400' :
                analysis.score >= 60 ? 'text-blue-400' : 'text-red-400'
              }`} />
              <span className={`text-xs sm:text-sm font-semibold ${
                analysis.score >= 80 ? 'text-green-400' :
                analysis.score >= 60 ? 'text-blue-400' : 'text-red-400'
              }`}>
                Security Assessment:
              </span>
            </div>
            <p className={`text-xs mt-1 ${
              analysis.score >= 80 ? 'text-green-300' :
              analysis.score >= 60 ? 'text-blue-300' : 'text-red-300'
            }`}>
              {analysis.score >= 80 
                ? "Excellent! This password provides strong security against most attacks."
                : analysis.score >= 60
                ? "Good. This password offers decent protection but could be stronger."
                : "Weak. This password could be easily compromised by attackers."
              }
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Password Creation Component
const PasswordCreationPhase = ({ 
  requirements, 
  onPasswordSubmit, 
  onBack 
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [customPassword, setCustomPassword] = useState("");

  const validatePassword = (pass, confirm) => {
    const newErrors = [];
    
    requirements.forEach(req => {
      if (!req.validator(pass)) {
        newErrors.push(`Failed: ${req.description}`);
      }
    });

    if (pass && confirm && pass !== confirm) {
      newErrors.push("Passwords do not match");
    }

    if (analysis && analysis.score < 70) {
      newErrors.push("Password strength too low (minimum 70% required)");
    }

    return newErrors;
  };

  const handleAnalysisUpdate = (newAnalysis) => {
    setAnalysis(newAnalysis);
    setErrors(validatePassword(password, confirmPassword));
  };

  const handleSubmit = () => {
    const validationErrors = validatePassword(password, confirmPassword);
    setErrors(validationErrors);

    if (validationErrors.length === 0 && analysis && analysis.score >= 70) {
      onPasswordSubmit(password);
    }
  };

  const generateStrongPassword = () => {
    const chars = {
      uppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
      lowercase: 'abcdefghjkmnpqrstuvwxyz',
      numbers: '23456789',
      symbols: '!@#$%^&*'
    };

    let generated = '';
    
    generated += chars.uppercase[Math.floor(Math.random() * chars.uppercase.length)];
    generated += chars.lowercase[Math.floor(Math.random() * chars.lowercase.length)];
    generated += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    generated += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];
    
    const allChars = chars.uppercase + chars.lowercase + chars.numbers + chars.symbols;
    for (let i = generated.length; i < 16; i++) {
      generated += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    generated = generated.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(generated);
    setConfirmPassword(generated);
    setCustomPassword("");
  };

  const handleCustomPassword = (pass) => {
    setCustomPassword(pass);
    setPassword(pass);
    setConfirmPassword(pass);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-cyan-500/30"
    >
      <div className="text-center mb-4 sm:mb-6">
        <Key className="w-8 h-8 sm:w-12 sm:h-12 text-cyan-400 mx-auto mb-2 sm:mb-3" />
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Create Secure Password</h3>
        <p className="text-gray-400 text-sm sm:text-base">
          Now enter your own password that meets all the security requirements
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Password Input Options */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {/* Test Your Own Password */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              Enter Your Password
            </h4>
            <input
              type="text"
              value={customPassword}
              onChange={(e) => handleCustomPassword(e.target.value)}
              placeholder="Enter your password that meets all requirements"
              className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 text-sm"
            />
            <p className="text-gray-400 text-xs">
              Create a password that meets all the security rules you selected
            </p>
          </div>

          {/* Generate Strong Password */}
          <div className="space-y-2 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
              Generate Strong Password
            </h4>
            <button
              onClick={generateStrongPassword}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-yellow-500/20 transition-all text-sm"
            >
              Generate Secure Password
            </button>
            <p className="text-gray-400 text-xs">
              Creates a random password meeting all requirements
            </p>
          </div>
        </div>

        {/* Password Strength Analysis */}
        <PasswordStrengthMeter 
          password={password} 
          requirements={requirements}
          onAnalysis={handleAnalysisUpdate}
        />

        {/* Password Confirmation */}
        {password && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-1 sm:mb-2">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors(validatePassword(password, e.target.value));
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 text-sm"
                />
              </div>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  <span className="text-red-400 font-semibold text-sm sm:text-base">Issues to fix:</span>
                </div>
                <ul className="text-red-300 text-xs sm:text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Success Message */}
            {analysis && analysis.score >= 70 && errors.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4"
              >
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm sm:text-base">Perfect! Ready to Secure!</span>
                </div>
                <p className="text-green-300 text-xs sm:text-sm">
                  Your password meets all security requirements and is ready to use.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-700/50">
          <button
            onClick={onBack}
            className="flex-1 bg-gray-600 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors text-xs sm:text-sm"
          >
            Back to Defense
          </button>
          <button
            onClick={handleSubmit}
            disabled={errors.length > 0 || !password || !confirmPassword || (analysis && analysis.score < 70)}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {analysis && analysis.score >= 70 ? "Complete Level" : "Fix Issues First"}
          </button>
        </div>

        {/* Security Tips */}
        <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-600/50">
          <h4 className="text-green-400 font-semibold text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-2">
            <Info className="w-3 h-3 sm:w-4 sm:h-4" />
            Password Security Tips
          </h4>
          <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs text-gray-300">
            <div className="space-y-1">
              <p className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-400" />
                Use at least 12 characters
              </p>
              <p className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-400" />
                Mix uppercase and lowercase
              </p>
              <p className="flex items-center gap-1">
                <Check className="w-3 h-3 text-green-400" />
                Include numbers and symbols
              </p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1">
                <X className="w-3 h-3 text-red-400" />
                Avoid common words
              </p>
              <p className="flex items-center gap-1">
                <X className="w-3 h-3 text-red-400" />
                Don't use personal info
              </p>
              <p className="flex items-center gap-1">
                <X className="w-3 h-3 text-red-400" />
                Avoid sequential patterns
              </p>
            </div>
          </div>
        </div>

        {/* Password Examples */}
        <div className="bg-blue-500/10 rounded-lg p-3 sm:p-4 border border-blue-500/30">
          <h4 className="text-blue-400 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 flex items-center gap-2">
            <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
            Strong Password Examples
          </h4>
          <div className="space-y-1 sm:space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <code className="text-blue-300 font-mono text-xs">Blu3$ky!Mountain@2024</code>
              <span className="text-green-400 text-xs">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <code className="text-blue-300 font-mono text-xs">T3mp3r@tur3*F0rest</code>
              <span className="text-green-400 text-xs">92%</span>
            </div>
            <div className="flex justify-between items-center">
              <code className="text-blue-300 font-mono text-xs">R@inb0w#Drag0n$Fly</code>
              <span className="text-blue-400 text-xs">88%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PasswordVault() {
  const { user, isAuthenticated } = useAuth();
  const { state: gameState, actions: gameActions } = useGame();
  const navigate = useNavigate();
  
  const [gameStatus, setGameStatus] = useState({
    status: "locked",
    timeElapsed: 0,
    score: 0,
    passwordsCracked: 0,
    defensesBuilt: 0,
    level: 3,
    isPaused: false,
    lives: 3,
    phase: "cracking"
  });

  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [levelPassword, setLevelPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [userCreatedPassword, setUserCreatedPassword] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Password cracking phase
  const [currentHash, setCurrentHash] = useState("");
  const [hashType, setHashType] = useState("md5");
  const [crackingProgress, setCrackingProgress] = useState(0);
  const [crackingAttempts, setCrackingAttempts] = useState(0);
  const [hints, setHints] = useState([]);
  const [usedPasswords, setUsedPasswords] = useState(new Set());

  // Password defense phase
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [defenseRules, setDefenseRules] = useState([
    { 
      id: 1, 
      type: "length", 
      enabled: false, 
      value: 8, 
      description: "Minimum 8 characters",
      validator: (pass) => pass.length >= 8
    },
    { 
      id: 2, 
      type: "uppercase", 
      enabled: false, 
      description: "Include uppercase letters",
      validator: (pass) => /[A-Z]/.test(pass)
    },
    { 
      id: 3, 
      type: "lowercase", 
      enabled: false, 
      description: "Include lowercase letters",
      validator: (pass) => /[a-z]/.test(pass)
    },
    { 
      id: 4, 
      type: "numbers", 
      enabled: false, 
      description: "Include numbers",
      validator: (pass) => /\d/.test(pass)
    },
    { 
      id: 5, 
      type: "symbols", 
      enabled: false, 
      description: "Include symbols",
      validator: (pass) => /[^A-Za-z0-9]/.test(pass)
    },
    { 
      id: 6, 
      type: "no_common", 
      enabled: false, 
      description: "Avoid common passwords",
      validator: (pass) => !/(password|123456|admin|qwerty)/i.test(pass)
    },
    { 
      id: 7, 
      type: "no_repeats", 
      enabled: false, 
      description: "No repeated characters",
      validator: (pass) => !/(.)\1{2,}/.test(pass)
    }
  ]);

  const [bruteForceAttacks, setBruteForceAttacks] = useState([]);
  const [gameLog, setGameLog] = useState([]);

  const audioContextRef = useRef(null);
  const attackCounterRef = useRef(0);

  // Check level status
  useEffect(() => {
    if (gameState.isLoading) return;

    if (gameState.completedLevels.includes(3)) {
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      const existingPassword = gameState.levelPasswords[4];
      if (existingPassword) {
        setLevelPassword(existingPassword);
      }
      return;
    }

    if (gameState.levelUnlocks[3] || gameState.completedLevels.includes(2)) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      if (!gameState.levelUnlocks[3]) {
        gameActions.unlockLevel(3);
      }
    }
  }, [gameState.completedLevels, gameState.levelUnlocks, gameState.isLoading]);

  // Password database for cracking phase
  const passwordDatabase = [
    { hash: "5f4dcc3b5aa765d61d8327deb882cf99", type: "md5", password: "password", hints: ["Very common", "All lowercase", "Related to authentication"] },
    { hash: "e10adc3949ba59abbe56e057f20f883e", type: "md5", password: "123456", hints: ["Numeric only", "Sequential", "Very weak","Less than 8 characters"] },
    { hash: "25d55ad283aa400af464c76d713c07ad", type: "md5", password: "12345678", hints: ["Numeric only", "Longer sequence", "Common pattern"] },
    { hash: "482c811da5d5b4bc6d497ffa98491e38", type: "md5", password: "password123", hints: ["Common base word", "Contains numbers", "Dictionary attack vulnerable"] },
    { hash: "9c9c3b5a5af06d6a8b6a7c8f8a8a8a8a", type: "md5", password: "admin", hints: ["System related", "All lowercase", "Default credential"] },
    { hash: "d8578edf8458ce06fbc5bb76a58c5ca4", type: "md5", password: "qwerty", hints: ["Keyboard pattern", "All lowercase", "Sequential"] },
    { hash: "5e884898da28047151d0e56f8dc62927", type: "md5", password: "abc123", hints: ["Alphanumeric", "Simple pattern", "Common combination"] },
    { hash: "fcea920f7412b5da7be0cf42b8c93759", type: "md5", password: "1234567", hints: ["Numeric sequence", "One digit shorter", "Very common"] }
  ];

  // Sound system
  const playSound = (frequency, duration, type = 'sine') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Password management
  const getStoredLevelPassword = () => {
    const sources = [
      gameState.levelPasswords[3],
      JSON.parse(localStorage.getItem('hacking_zone_level_passwords') || '{}')[3],
      localStorage.getItem('level3_password')
    ];

    return sources.find(p => p && p.startsWith('HZ-L3-'));
  };

  const normalizePassword = (password) => {
    return password.trim().toUpperCase();
  };

  const checkLevelPassword = () => {
    initAudio();
    
    const inputPassword = normalizePassword(passwordInput);
    const savedPassword = getStoredLevelPassword();
    
    if (!inputPassword) {
      setPasswordError("Please enter the Level 3 password");
      return;
    }
    
    if (!savedPassword) {
      setPasswordError("No Level 3 password found. Please complete Phisher's Trap level first.");
      return;
    }
    
    const normalizedSavedPassword = normalizePassword(savedPassword);
    
    if (inputPassword === normalizedSavedPassword) {
      setGameStatus(prev => ({ ...prev, status: "idle" }));
      setPasswordError("");
      setShowTutorial(true);
      gameActions.unlockLevel(3);
      playSound(800, 0.2);
    } else {
      setPasswordError(`Invalid Level 3 password. The password should start with "HZ-L3-".`);
      playSound(300, 0.3, 'square');
    }
  };

  const skipPassword = () => {
    initAudio();
    setGameStatus(prev => ({ ...prev, status: "idle" }));
    setShowTutorial(true);
    gameActions.unlockLevel(3);
  };

  const generateLevelPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return `HZ-L4-${password}`;
  };

  // Game timer
  useEffect(() => {
    let interval;
    if (gameStatus.status === "running" && !gameStatus.isPaused) {
      interval = setInterval(() => {
        setGameStatus(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStatus.status, gameStatus.isPaused]);

  // Initialize new cracking challenge
  const startNewCrackingChallenge = () => {
    const availablePasswords = passwordDatabase.filter(p => !usedPasswords.has(p.password));
    
    if (availablePasswords.length === 0) {
      if (gameStatus.passwordsCracked >= 3) {
        setGameStatus(prev => ({ ...prev, phase: "defense" }));
        addGameLog("🎯 Phase 2: Build password defenses against brute force attacks", "info");
        startDefensePhase();
      } else {
        handleGameOver("Not enough passwords cracked");
      }
      return;
    }

    const randomPassword = availablePasswords[Math.floor(Math.random() * availablePasswords.length)];
    setCurrentHash(randomPassword.hash);
    setHashType(randomPassword.type);
    setHints(randomPassword.hints);
    setCrackingProgress(0);
    setCrackingAttempts(0);
    usedPasswords.add(randomPassword.password);
    setUsedPasswords(new Set(usedPasswords));

    addGameLog(`🔐 New hash detected: ${randomPassword.hash.substring(0, 16)}... (${randomPassword.type})`, "info");
    addGameLog(`💡 Hints: ${randomPassword.hints.join(", ")}`, "warning");
  };

  // Start defense phase
  const startDefensePhase = () => {
    setDefenseRules(rules => rules.map(rule => ({ ...rule, enabled: false })));
    setPasswordStrength(0);
    startBruteForceAttacks();
  };

  // Brute force attack system
  const startBruteForceAttacks = () => {
    const attackInterval = setInterval(() => {
      if (gameStatus.status !== "running" || gameStatus.isPaused || gameStatus.phase !== "defense") {
        clearInterval(attackInterval);
        return;
      }

      attackCounterRef.current += 1;
      const attackTypes = [
        { type: "dictionary", speed: "slow", strength: "weak" },
        { type: "hybrid", speed: "medium", strength: "medium" },
        { type: "bruteforce", speed: "fast", strength: "strong" }
      ];

      const randomAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      
      const newAttack = {
        id: Date.now(),
        ...randomAttack,
        progress: 0,
        timestamp: new Date().toLocaleTimeString()
      };

      setBruteForceAttacks(prev => [...prev.slice(-4), newAttack]);
      addGameLog(`⚡ Incoming ${randomAttack.type} attack (${randomAttack.strength})`, "warning");

    }, 5000);
  };

  // Update brute force attacks
  useEffect(() => {
    if (gameStatus.phase !== "defense" || gameStatus.status !== "running" || gameStatus.isPaused) return;

    const attackUpdate = setInterval(() => {
      setBruteForceAttacks(prev => 
        prev.map(attack => {
          const speedMultiplier = attack.speed === "fast" ? 3 : attack.speed === "medium" ? 2 : 1;
          const defenseMultiplier = Math.max(0.1, 1 - (passwordStrength / 100));
          const newProgress = attack.progress + (speedMultiplier * defenseMultiplier);

          if (newProgress >= 100) {
            setGameStatus(prevStatus => {
              const newLives = prevStatus.lives - 1;
              if (newLives <= 0) {
                handleGameOver("Vault breached");
              }
              return { ...prevStatus, lives: newLives };
            });
            addGameLog(`💀 ${attack.type} attack breached your defenses!`, "error");
            playSound(200, 0.5, 'sawtooth');
            return null;
          }

          return { ...attack, progress: newProgress };
        }).filter(Boolean)
      );
    }, 500);

    return () => clearInterval(attackUpdate);
  }, [gameStatus.phase, gameStatus.status, gameStatus.isPaused, passwordStrength]);

  // Password cracking logic
  const attemptCrack = (attempt) => {
    if (gameStatus.status !== "running" || gameStatus.isPaused || gameStatus.phase !== "cracking") return;

    const currentPassword = passwordDatabase.find(p => p.hash === currentHash);
    setCrackingAttempts(prev => prev + 1);

    if (attempt.toLowerCase() === currentPassword.password.toLowerCase()) {
      setGameStatus(prev => ({
        ...prev,
        passwordsCracked: prev.passwordsCracked + 1,
        score: prev.score + 50
      }));
      addGameLog(`✅ Password cracked: "${currentPassword.password}"`, "success");
      playSound(800, 0.2);
      
      if (gameStatus.passwordsCracked + 1 >= 3) {
        setTimeout(() => {
          setGameStatus(prev => ({ ...prev, phase: "defense" }));
          addGameLog("🎯 Phase 2: Build password defenses against brute force attacks", "info");
          startDefensePhase();
        }, 1500);
      } else {
        setTimeout(startNewCrackingChallenge, 1000);
      }
    } else {
      setGameStatus(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 5)
      }));
      addGameLog(`❌ Failed attempt: "${attempt}"`, "error");
      playSound(300, 0.2, 'square');

      const similarity = calculateSimilarity(attempt, currentPassword.password);
      setCrackingProgress(Math.min(100, crackingProgress + similarity));
    }
  };

  // Calculate password similarity for progress
  const calculateSimilarity = (attempt, actual) => {
    let similarity = 0;
    
    const lengthDiff = Math.abs(attempt.length - actual.length);
    similarity += Math.max(0, 10 - lengthDiff);
    
    const hasUpper = /[A-Z]/.test(attempt) === /[A-Z]/.test(actual);
    const hasLower = /[a-z]/.test(attempt) === /[a-z]/.test(actual);
    const hasNumbers = /\d/.test(attempt) === /\d/.test(actual);
    const hasSymbols = /[^A-Za-z0-9]/.test(attempt) === /[^A-Za-z0-9]/.test(actual);
    
    if (hasUpper) similarity += 5;
    if (hasLower) similarity += 5;
    if (hasNumbers) similarity += 5;
    if (hasSymbols) similarity += 5;
    
    return similarity;
  };

  // Update defense rules
  const toggleDefenseRule = (ruleId) => {
    setDefenseRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  // Calculate overall defense strength
  useEffect(() => {
    if (gameStatus.phase === "defense") {
      const activeRules = defenseRules.filter(rule => rule.enabled);
      const baseStrength = activeRules.length * 12;
      const bonusStrength = activeRules.length >= 5 ? 20 : 0;
      setPasswordStrength(Math.min(100, baseStrength + bonusStrength));
    }
  }, [defenseRules, gameStatus.phase]);

  // Check when ALL defense rules are enabled
  useEffect(() => {
    if (gameStatus.phase === "defense" && gameStatus.status === "running") {
      const allRulesEnabled = defenseRules.every(rule => rule.enabled);
      
      if (allRulesEnabled) {
        setGameStatus(prev => ({ ...prev, phase: "creation" }));
        addGameLog("🎉 All security rules enabled! Now create your own secure password", "success");
        addGameLog("🔐 Enter a password that meets ALL the requirements you selected", "info");
      }
    }
  }, [defenseRules, gameStatus.phase, gameStatus.status]);

  // Handle password creation completion
  const handlePasswordCreation = (password) => {
    setUserCreatedPassword(password);
    addGameLog("🎉 Secure password created successfully!", "success");
    addGameLog(`🔐 Your password meets all security requirements`, "success");
    
    completeLevel();
  };

  // Handle back from creation phase
  const handleBackToDefense = () => {
    setGameStatus(prev => ({ ...prev, phase: "defense" }));
  };

  const addGameLog = (message, type = "info") => {
    setGameLog(prev => [{ id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() }, ...prev.slice(0, 8)]);
  };

  const startGame = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    initAudio();
    
    setGameStatus({
      status: "running",
      timeElapsed: 0,
      score: 0,
      passwordsCracked: 0,
      defensesBuilt: 0,
      level: 3,
      isPaused: false,
      lives: 3,
      phase: "cracking"
    });
    
    setBruteForceAttacks([]);
    setGameLog([]);
    setLevelPassword("");
    setUsedPasswords(new Set());
    setUserCreatedPassword("");
    setShowTutorial(false);
    setMobileMenuOpen(false);
    
    addGameLog("🔓 Game started! Crack 3 passwords to advance to defense phase", "info");
    startNewCrackingChallenge();
    playSound(523, 0.2);
  };

  const pauseGame = () => {
    setGameStatus(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameStatus({
      status: "idle",
      timeElapsed: 0,
      score: 0,
      passwordsCracked: 0,
      defensesBuilt: 0,
      level: 3,
      isPaused: false,
      lives: 3,
      phase: "cracking"
    });
    setBruteForceAttacks([]);
    setGameLog([]);
    setLevelPassword("");
    setUsedPasswords(new Set());
    setUserCreatedPassword("");
    setCurrentHash("");
    setCrackingProgress(0);
    setCrackingAttempts(0);
    setMobileMenuOpen(false);
  };

  const handleGameOver = (reason = "Vault breached") => {
    setGameStatus(prev => ({ ...prev, status: "failed" }));
    addGameLog(`💀 Game Over! ${reason}`, "error");
    playSound(200, 0.5, 'sawtooth');
  };

  const completeLevel = () => {
    if (gameStatus.status === "running") {
      const password = generateLevelPassword();
      setLevelPassword(password);
      setGameStatus(prev => ({ ...prev, status: "completed" }));
      
      addGameLog("🎉 Level Completed! Vault secured successfully", "success");
      addGameLog(`🔑 Level 4 Password: ${password}`, "success");
      
      const xpEarned = 200 + Math.floor(gameStatus.score / 10);
      addGameLog(`✨ +${xpEarned} XP Earned!`, "success");
      
      try {
        gameActions.completeLevel(3, xpEarned, password);
      } catch (error) {
        console.error('GameContext error:', error);
      }
      
      playSound(1000, 0.5);
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText(levelPassword).then(() => {
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    });
  };

  const getAttackColor = (type) => {
    switch (type) {
      case "dictionary": return "from-yellow-500 to-orange-500";
      case "hybrid": return "from-orange-500 to-red-500";
      case "bruteforce": return "from-red-500 to-pink-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md w-full">
          <Shield className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
          <p className="text-gray-400 mb-6">Please log in to play this game</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus.status === "locked") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass card-cyber p-4 sm:p-8 rounded-2xl border border-purple-500/30">
            <Key className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">Password Vault</h1>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-lg">Level 3: Password Security & Brute Force Defense</p>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <Key className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-2 sm:mb-3" />
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Level 3 Password Required</h3>
              <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">
                Enter the password from Phisher's Trap level
              </p>
              
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError("");
                  }}
                  placeholder="Enter Level 3 Password (HZ-L3-...)"
                  className="w-full bg-black/50 border border-purple-500/50 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 text-center font-mono text-sm sm:text-base"
                  onKeyPress={(e) => e.key === 'Enter' && checkLevelPassword()}
                />
                {passwordError && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2">{passwordError}</p>
                )}
                <button
                  onClick={checkLevelPassword}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold mt-3 sm:mt-4 hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm sm:text-base"
                >
                  Unlock Level 3
                </button>
              </div>
            </div>

            <div className="text-left bg-gray-800/30 rounded-xl p-3 sm:p-4">
              <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                What to Expect:
              </h4>
              <ul className="text-gray-300 text-xs sm:text-sm space-y-1 sm:space-y-2">
                <li>• Phase 1: Crack password hashes using hints and analysis</li>
                <li>• Phase 2: Build strong password defenses against brute force attacks</li>
                <li>• Phase 3: Create your own secure password meeting all requirements</li>
                <li>• Learn about hash algorithms and password security</li>
                <li>• Understand brute force and dictionary attacks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black py-4 sm:py-8 px-3 sm:px-4 pt-20 sm:pt-24">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/levels")}
              className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Password Vault</h1>
              <p className="text-purple-400 text-xs">Level 3</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mobile Stats */}
            <div className="flex items-center gap-3 text-xs">
              <div className="text-center">
                <div className="text-purple-400 font-bold">{gameStatus.score}</div>
                <div className="text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-bold">
                  {gameStatus.phase === "cracking" 
                    ? `${gameStatus.passwordsCracked}/3` 
                    : gameStatus.phase === "defense"
                    ? `${defenseRules.filter(r => r.enabled).length}/${defenseRules.length}`
                    : "Creation"
                  }
                </div>
                <div className="text-gray-400">
                  {gameStatus.phase === "cracking" ? "Cracked" : 
                   gameStatus.phase === "defense" ? "Rules" : "Phase"}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-2 text-gray-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/levels")}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Levels
            </button>
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Password Vault</h1>
                <p className="text-purple-400 text-sm">Password Security & Brute Force Defense</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{gameStatus.score}</div>
              <div className="text-gray-400 text-sm">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {gameStatus.phase === "cracking" 
                  ? `${gameStatus.passwordsCracked}/3` 
                  : gameStatus.phase === "defense"
                  ? `${defenseRules.filter(r => r.enabled).length}/${defenseRules.length}`
                  : "Creation"
                }
              </div>
              <div className="text-gray-400 text-sm">
                {gameStatus.phase === "cracking" ? "Cracked" : 
                 gameStatus.phase === "defense" ? "Rules" : "Phase"}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1">
                <div className="text-2xl font-bold text-red-400">{gameStatus.lives}</div>
                <Shield className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-gray-400 text-sm">Lives</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 capitalize">
                {gameStatus.phase}
              </div>
              <div className="text-gray-400 text-sm">Phase</div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="lg:hidden fixed top-16 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-sm border-l border-gray-700 z-20 p-4 overflow-y-auto"
            >
              {/* Game Stats */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Game Stats
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Score:</span>
                    <span className="text-purple-400">{gameStatus.score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Passwords Cracked:</span>
                    <span className="text-green-400">{gameStatus.passwordsCracked}/3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense Strength:</span>
                    <span className="text-blue-400">{passwordStrength}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Rules:</span>
                    <span className="text-purple-400">
                      {defenseRules.filter(r => r.enabled).length}/{defenseRules.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lives:</span>
                    <span className="text-red-400">{gameStatus.lives}</span>
                  </div>
                </div>
              </div>

              {/* Game Log */}
              <div className="glass card-cyber p-4 rounded-2xl border border-gray-700/50">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Security Log
                </h3>
                <div className="bg-gray-800/50 rounded-xl p-3 max-h-48 overflow-y-auto">
                  {gameLog.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No activity yet</p>
                  ) : (
                    <div className="space-y-2">
                      {gameLog.map(log => (
                        <div key={log.id} className="flex items-start gap-2 text-xs">
                          <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">{log.timestamp}</span>
                          <span className={`flex-1 ${
                            log.type === "error" ? "text-red-400" :
                            log.type === "warning" ? "text-yellow-400" :
                            log.type === "success" ? "text-green-400" : "text-gray-300"
                          }`}>
                            {log.message}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutorial Overlay */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass card-cyber p-4 sm:p-6 max-w-2xl w-full border border-purple-500/30 rounded-2xl"
              >
                <h2 className="text-xl sm:text-3xl font-bold text-white mb-4 text-center">Welcome to Password Vault</h2>
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Hash className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Phase 1: Password Cracking</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Crack 3 password hashes using hints and analysis</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Phase 2: Defense Building</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Enable ALL password defense rules to proceed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Key className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-white font-semibold text-sm sm:text-base">Phase 3: Password Creation</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">Create your own secure password meeting all requirements</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full bg-purple-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors text-sm sm:text-base"
                >
                  Start Game
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50 h-full">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  {gameStatus.phase === "cracking" ? <Hash className="w-4 h-4 sm:w-5 sm:h-5" /> : 
                   gameStatus.phase === "defense" ? <Shield className="w-4 h-4 sm:w-5 sm:h-5" /> :
                   <Key className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {gameStatus.phase === "cracking" ? "Password Cracking" : 
                   gameStatus.phase === "defense" ? "Vault Defense" : "Password Creation"}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 sm:p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Game Content */}
              {gameStatus.phase === "cracking" ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Current Hash */}
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-purple-500/30">
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
                      Crack This Hash
                    </h3>
                    <div className="bg-black/70 p-3 sm:p-4 rounded border border-gray-600 mb-3 sm:mb-4">
                      <code className="text-green-400 font-mono text-xs sm:text-sm break-all">
                        {currentHash}
                      </code>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
                      <span>Type: {hashType.toUpperCase()}</span>
                      <span>Attempts: {crackingAttempts}</span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-3 sm:mb-4">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${crackingProgress}%` }}
                      ></div>
                    </div>

                    {/* Hints */}
                    <div className="space-y-1 sm:space-y-2">
                      <h4 className="text-yellow-400 text-xs sm:text-sm font-semibold">Hints:</h4>
                      {hints.map((hint, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                          <Sparkles className="w-3 h-3 text-yellow-400" />
                          {hint}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="text"
                      placeholder="Enter your password guess..."
                      className="w-full bg-gray-800 border border-gray-600 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && attemptCrack(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input');
                        if (input.value) {
                          attemptCrack(input.value);
                          input.value = '';
                        }
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all text-sm sm:text-base"
                    >
                      Attempt Crack
                    </button>
                  </div>
                </div>
              ) : gameStatus.phase === "defense" ? (
                <div className="space-y-4 sm:space-y-6">
                  {/* Defense Rules */}
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-green-500/30">
                    <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                      Password Defense Rules
                      <span className="text-xs sm:text-sm text-gray-400">
                        ({defenseRules.filter(r => r.enabled).length}/{defenseRules.length} enabled)
                      </span>
                    </h3>
                    
                    {/* Success Message when ALL rules are enabled */}
                    {defenseRules.every(rule => rule.enabled) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4"
                      >
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="font-semibold text-sm sm:text-base">Perfect! All 7 security rules enabled!</span>
                        </div>
                        <p className="text-green-300 text-xs sm:text-sm mt-1">
                          <strong>Next:</strong> Create a password that meets ALL these requirements
                        </p>
                        <button
                          onClick={() => {
                            setGameStatus(prev => ({ ...prev, phase: "creation" }));
                          }}
                          className="mt-2 bg-green-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-600 transition-colors"
                        >
                          Proceed to Password Creation →
                        </button>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {defenseRules.map(rule => (
                        <motion.div
                          key={rule.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                            rule.enabled
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-gray-700/50 border-gray-600/50"
                          }`}
                          onClick={() => toggleDefenseRule(rule.id)}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`w-3 h-3 rounded-full border ${
                              rule.enabled 
                                ? "bg-green-400 border-green-500" 
                                : "bg-gray-600 border-gray-500"
                            }`} />
                            <span className={`text-xs sm:text-sm ${rule.enabled ? "text-white" : "text-gray-400"}`}>
                              {rule.description}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Defense Strength */}
                  <div className="bg-gray-800/50 rounded-xl p-4 sm:p-6 border border-blue-500/30">
                    <h3 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                      Defense Strength
                    </h3>
                    <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mb-1 sm:mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-400">Weak</span>
                      <span className="text-blue-400 font-semibold">{passwordStrength}%</span>
                      <span className="text-gray-400">Strong</span>
                    </div>
                  </div>

                  {/* Active Attacks */}
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-white font-semibold flex items-center gap-2 text-sm sm:text-base">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                      Active Attacks
                    </h3>
                    {bruteForceAttacks.length === 0 ? (
                      <p className="text-gray-500 text-xs sm:text-sm italic">No active attacks</p>
                    ) : (
                      bruteForceAttacks.map(attack => (
                        <div key={attack.id} className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 sm:p-3">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <span className="text-white font-semibold text-xs sm:text-sm capitalize">{attack.type} Attack</span>
                            <span className="text-red-400 text-xs sm:text-sm">{attack.strength}</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${attack.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <PasswordCreationPhase
                  requirements={defenseRules.filter(r => r.enabled)}
                  onPasswordSubmit={handlePasswordCreation}
                  onBack={handleBackToDefense}
                />
              )}

              {/* Game Controls */}
              {gameStatus.phase !== "creation" && (
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-700/50">
                  <div className="flex gap-2 sm:gap-3">
                    {gameStatus.status === "idle" ? (
                      <button
                        onClick={startGame}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                      >
                        <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                        Start Game
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={pauseGame}
                          className="flex-1 bg-yellow-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                        >
                          {gameStatus.isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
                          {gameStatus.isPaused ? "Resume" : "Pause"}
                        </button>
                        <button
                          onClick={resetGame}
                          className="flex-1 bg-red-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
                        >
                          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel - Hidden on mobile, shown in sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Stats */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Game Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-cyan-400">
                    {Math.floor(gameStatus.timeElapsed / 60)}:{(gameStatus.timeElapsed % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Passwords Cracked:</span>
                  <span className="text-green-400">{gameStatus.passwordsCracked}/3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Defense Strength:</span>
                  <span className="text-blue-400">{passwordStrength}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Rules:</span>
                  <span className="text-purple-400">
                    {defenseRules.filter(r => r.enabled).length}/{defenseRules.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Game Log */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                Security Log
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-4 max-h-60 overflow-y-auto">
                {gameLog.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No activity yet</p>
                ) : (
                  <div className="space-y-2">
                    {gameLog.map(log => (
                      <div key={log.id} className="flex items-start gap-3 text-sm">
                        <span className="text-gray-500 text-xs mt-0.5 flex-shrink-0">{log.timestamp}</span>
                        <span className={`flex-1 ${
                          log.type === "error" ? "text-red-400" :
                          log.type === "warning" ? "text-yellow-400" :
                          log.type === "success" ? "text-green-400" : "text-gray-300"
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Learning Tips */}
            <div className="glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                Tips
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>• Use hints to narrow down password possibilities</p>
                <p>• Enable ALL defense rules to proceed to password creation</p>
                <p>• Longer passwords with variety are harder to crack</p>
                <p>• Avoid common words and patterns</p>
                {gameStatus.phase === "creation" && (
                  <p>• Create a password that meets ALL the enabled requirements</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="mt-6 sm:mt-8 glass card-cyber p-4 sm:p-6 rounded-2xl border border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
            Learning Objectives
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
              <h4 className="font-semibold text-purple-400 mb-1 sm:mb-2 text-sm sm:text-base">Hash Cracking</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand how password hashes work and cracking techniques</p>
            </div>
            <div className="p-3 sm:p-4 bg-green-500/10 rounded-xl border border-green-500/20">
              <h4 className="font-semibold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">Password Strength</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Learn what makes passwords strong and resistant to attacks</p>
            </div>
            <div className="p-3 sm:p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <h4 className="font-semibold text-yellow-400 mb-1 sm:mb-2 text-sm sm:text-base">Brute Force Defense</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Understand different attack types and defense strategies</p>
            </div>
            <div className="p-3 sm:p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <h4 className="font-semibold text-cyan-400 mb-1 sm:mb-2 text-sm sm:text-base">Secure Creation</h4>
              <p className="text-gray-300 text-xs sm:text-sm">Apply knowledge to create strong, secure passwords</p>
            </div>
          </div>
        </div>

        {/* Game Overlays */}
        <AnimatePresence>
          {gameStatus.status === "completed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            >
              <div className="text-center bg-gray-800/95 p-4 sm:p-8 rounded-2xl border border-green-500/30 max-w-md w-full shadow-2xl">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Level Complete!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Vault secured successfully</p>
                
                {userCreatedPassword && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Your Secure Password:</span>
                    </div>
                    <div className="bg-black/70 p-2 sm:p-3 rounded border border-gray-600">
                      <code className="text-green-400 font-mono text-xs sm:text-sm break-all">
                        {userCreatedPassword}
                      </code>
                    </div>
                    <p className="text-green-300 text-xs mt-2">
                      This password meets all security requirements!
                    </p>
                  </div>
                )}
                
                <div className="bg-gray-700/80 p-3 sm:p-4 rounded-xl border border-purple-500/30 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <span className="text-white font-semibold text-sm sm:text-base">Level 4 Password:</span>
                    </div>
                    <button
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      {passwordCopied ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
                      <span className="text-xs">{passwordCopied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="bg-black/70 p-2 sm:p-3 rounded border border-gray-600">
                    <code className="text-green-400 font-mono text-xs sm:text-sm break-all">
                      {levelPassword}
                    </code>
                  </div>
                </div>
                
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={resetGame}
                    className="flex-1 bg-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => navigate("/levels")}
                    className="flex-1 bg-cyan-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-cyan-600 transition-colors text-sm sm:text-base"
                  >
                    Go to Levels
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {gameStatus.status === "failed" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-red-500/10 backdrop-blur-sm flex items-center justify-center z-20 p-4"
            >
              <div className="text-center bg-gray-800/95 p-4 sm:p-6 rounded-2xl border border-red-500/30 max-w-md w-full">
                <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Vault Breached!</h3>
                <p className="text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">Too many attacks penetrated your defenses</p>
                <button
                  onClick={resetGame}
                  className="bg-purple-500 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}