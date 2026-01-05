"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // 1. Start state: Invisible and slightly lower down
      initial={{ opacity: 0, y: 20 }}
      
      // 2. End state: Fully visible and in natural position
      animate={{ opacity: 1, y: 0 }}
      
      // 3. Animation settings: Slow and smooth (0.75s is elegant)
      transition={{ ease: "easeInOut", duration: 0.75 }}
      
      className="w-full"
    >
      {children}
    </motion.div>
  );
}