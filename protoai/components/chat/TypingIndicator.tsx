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
      repeatType: "reverse" as const,
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start px-6 mb-8">
      <div className="flex gap-4">
        {/* Assistant Icon Placeholder */}
        <div className="w-10 h-10 shrink-0 rounded-full bg-[#1a1a1a] border border-[#333333] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c.5 4.5 4.5 8.5 9 9-4.5.5-8.5 4.5-9 9-.5-4.5-4.5-8.5-9-9 4.5-.5 8.5-4.5 9-9z" />
          </svg>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-1.5 p-[14px_16px] bg-[#1a1a1a] border border-[#333333] rounded-[16px_16px_16px_4px]"
        >
          <motion.div variants={dotVariants} className="w-1.5 h-1.5 bg-[#999999] rounded-full"></motion.div>
          <motion.div variants={dotVariants} className="w-1.5 h-1.5 bg-[#999999] rounded-full"></motion.div>
          <motion.div variants={dotVariants} className="w-1.5 h-1.5 bg-[#999999] rounded-full"></motion.div>
        </motion.div>
      </div>
    </div>
  );
}

