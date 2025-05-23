"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <motion.div
        className="relative w-24 h-24"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-t-4 border-cyan-400"></div>
        <div className="absolute inset-3 rounded-full bg-gray-900 flex items-center justify-center">
          <span className="text-cyan-400 font-semibold text-sm animate-pulse tracking-wide">
            Loading...
          </span>
        </div>
      </motion.div>
    </div>
  );
}
