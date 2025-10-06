// src/components/ui/AnimatedHeading.jsx

//eslint-disable-next-line
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
  }),
};

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

export default function AnimatedHeading({ text, className }) {
  const words = text.split(" ");

  return (
    <motion.h2
      className={`text-4xl md:text-7xl font-extrabold tracking-tight ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          // ADD THESE CLASSES to give enough vertical space
          className="inline-block bg-gradient-to-br from-neutral-200 via-neutral-300 to-sky-400 bg-clip-text text-transparent leading-tighter pb-2"
          // You can try `leading-tight` or `leading-normal` if `leading-none` isn't enough
        >
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.h2>
  );
}