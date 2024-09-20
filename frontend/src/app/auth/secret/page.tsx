"use client";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";

const WelcomePage = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Trigger confetti after a short delay
    const timer = setTimeout(() => setShowConfetti(true), 1000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  const letters = "Welcome to CHEM!".split("");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-400 to-green-500">
      {showConfetti && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center"
      >
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="inline-block text-6xl font-bold text-white"
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="mt-8 text-2xl text-white"
      >
        You&apos;ve found the secret code!
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        className="mt-8 text-xl text-white"
      >
        The onboarding code is: Hubert_Rizz 🤫🤫
      </motion.div>

      <motion.div className="mt-12 space-x-4">
        {["🧪", "🔬", "⚗️"].map((emoji, index) => (
          <motion.span
            key={index}
            className="inline-block text-5xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 15,
              delay: 2.5 + index * 0.2,
            }}
          >
            {emoji}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomePage;
