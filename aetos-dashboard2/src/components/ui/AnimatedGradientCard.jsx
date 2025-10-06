import React from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const AnimatedGradientCard = ({ children, className, ...props }) => {
  return (
    <motion.div
      variants={cardVariants}
      className={`relative rounded-xl p-12 max-w-6xl mx-auto overflow-hidden
                  group
                  bg-neutral-950
                  ${className}`}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-0 opacity-50
                   bg-gradient-to-br from-sky-700 via-neutral-900 to-indigo-700
                   transition-all duration-700 ease-in-out"
        style={{ backgroundSize: "200% 200%" }} 
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{
          duration: 12, 
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className="absolute inset-0 z-[1] opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <motion.div
        className="absolute inset-0 z-[2] rounded-xl transition-colors duration-300"
      />
      <div className="relative z-10 text-center">
        {children}
      </div>
    </motion.div>
  );
};