// src/pages/Level3.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Level3 = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Level 3</h1>
        <p className="text-lg">
          Welcome to Level 3. Prove your skills and climb the leaderboard!
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Level3; // ✅ shu qator juda muhim
