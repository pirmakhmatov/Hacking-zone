// src/pages/Level2.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Level2 = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Level 2</h1>
        <p className="text-lg">
          Welcome to Level 2. Complete the challenges to advance your cybersecurity skills!
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Level2; // ✅ shu qator juda muhim
