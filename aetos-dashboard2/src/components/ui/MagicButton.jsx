import React from 'react';

//eslint-disable-next-line
import { motion } from 'framer-motion';

export const MagicButton = ({ children, className, ...props }) => {
  return (
    <motion.button
      className={`relative inline-flex h-11 px-8 mt-8
                  items-center justify-center whitespace-nowrap
                  rounded-md text-sm font-medium text-neutral-50
                  ring-offset-neutral-900 transition-colors
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-sky-500 focus-visible:ring-offset-2
                  overflow-hidden group cursor-pointer
                  ${className}`}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      <span className="absolute inset-0 z-0 rounded-md bg-sky-600 transition-colors"></span>

      <motion.span
        className="absolute inset-0 z-[1] rounded-md bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-500"
        variants={{
          hover: { opacity: 1, scale: 1.2 },
          tap: { scale: 0.95 }
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  );
};