// src/pages/Login.jsx
import { useState } from "react";
import AuthTerminal from "../components/AuthTerminal";
import { motion } from "framer-motion";

export default function Login() {
  const [mode, setMode] = useState("login");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <AuthTerminal 
        mode={mode} 
        onSwitchMode={() => setMode(mode === "login" ? "signup" : "login")}
      />
    </motion.div>
  );
}