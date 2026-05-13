import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const dotVariants = {
  hidden: { opacity: 0.4, y: 0 },
  visible: {
    opacity: 1,
    y: -3,
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center gap-1.5 p-[14px_16px] bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[16px_16px_16px_4px]"
      >
        <motion.div variants={dotVariants} className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></motion.div>
        <motion.div variants={dotVariants} className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></motion.div>
        <motion.div variants={dotVariants} className="w-1.5 h-1.5 bg-[var(--text-secondary)] rounded-full"></motion.div>
      </motion.div>
    </div>
  );
}

