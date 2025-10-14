// src/components/ui/AnimatedHeading.jsx

import React from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";

// Note: We keep the variants, but the main component won't be a motion.h2 anymore.
const wordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { type: "spring", damping: 12, stiffness: 200 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 12, stiffness: 200 },
  },
};

// The component now just returns the animated spans
export default function AnimatedHeading({ text }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block bg-gradient-to-br from-neutral-200 via-neutral-300 to-sky-400 bg-clip-text text-transparent leading-tighter pb-2"
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </>
  );
}